import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, QueryOrderDto } from './dto';
import { OrderStatus, Prisma } from '@prisma/client';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [OrderStatus.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Place Order (COD) ─────────────────────────────────────────────────────

  async placeOrder(dto: CreateOrderDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validate address belongs to user
      const address = await tx.address.findFirst({
        where: { id: dto.addressId, userId },
      });
      if (!address) {
        throw new NotFoundException('Address not found');
      }

      // 2. Get user's cart with items
      const cart = await tx.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { inventory: true },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // 3. Validate stock and calculate total
      let totalAmount = new Prisma.Decimal(0);

      for (const item of cart.items) {
        if (item.product.deletedAt) {
          throw new BadRequestException(
            `Product "${item.product.name}" is no longer available`,
          );
        }

        const available =
          (item.product.inventory?.stock ?? 0) -
          (item.product.inventory?.reservedStock ?? 0);
        if (item.quantity > available) {
          throw new BadRequestException(
            `Insufficient stock for "${item.product.name}". Available: ${available}`,
          );
        }

        totalAmount = totalAmount.add(item.product.price.mul(item.quantity));
      }

      // 4. Create order
      const order = await tx.order.create({
        data: {
          userId,
          addressId: dto.addressId,
          paymentMethod: dto.paymentMethod ?? 'COD',
          totalAmount,
          status: OrderStatus.PENDING,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price,
            })),
          },
          statusHistory: {
            create: {
              status: OrderStatus.PENDING,
              notes: 'Order placed',
              createdBy: userId,
            },
          },
        },
      });

      // 5. Reserve stock for each item
      for (const item of cart.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: { reservedStock: { increment: item.quantity } },
        });
      }

      // 6. Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      this.logger.log(
        `Order placed: ${order.id} by user ${userId}, total: ${totalAmount}`,
      );

      return this.getOrderById(order.id, userId, tx);
    });
  }

  // ─── Get Order by ID ──────────────────────────────────────────────────────

  async getOrderById(id: string, userId?: string, tx?: any) {
    const client = tx ?? this.prisma;

    const where: Prisma.OrderWhereInput = { id };
    if (userId) where.userId = userId;

    const order = await client.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: true },
            },
          },
        },
        address: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        user: { select: { id: true, email: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // ─── User Order History ────────────────────────────────────────────────────

  async getUserOrders(userId: string, query: QueryOrderDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = { userId };
    if (query.status) where.status = query.status;

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, images: true },
              },
            },
          },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Admin: Get All Orders ─────────────────────────────────────────────────

  async getAllOrders(query: QueryOrderDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, slug: true } },
            },
          },
          address: true,
          user: { select: { id: true, email: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Admin: Update Order Status ────────────────────────────────────────────

  async updateStatus(
    orderId: string,
    dto: UpdateOrderStatusDto,
    adminId: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate state machine transition
    const allowedNext = VALID_TRANSITIONS[order.status];
    if (!allowedNext.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from "${order.status}" to "${dto.status}". Allowed: ${allowedNext.join(', ') || 'none'}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: dto.status },
      });

      // Add to status history
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: dto.status,
          notes: dto.notes,
          createdBy: adminId,
        },
      });

      // Handle inventory on status changes
      if (dto.status === OrderStatus.DELIVERED) {
        // Confirm stock deduction: decrement both stock and reserved
        for (const item of order.items) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              stock: { decrement: item.quantity },
              reservedStock: { decrement: item.quantity },
            },
          });
        }
        this.logger.log(`Order ${orderId} delivered — stock deducted`);
      }

      if (dto.status === OrderStatus.CANCELLED) {
        // Release reserved stock
        for (const item of order.items) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: { reservedStock: { decrement: item.quantity } },
          });
        }
        this.logger.log(`Order ${orderId} cancelled — stock released`);
      }

      return this.getOrderById(orderId, undefined, tx);
    });
  }

  // ─── User: Cancel Own Order ────────────────────────────────────────────────

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    return this.updateStatus(
      orderId,
      { status: OrderStatus.CANCELLED, notes: 'Cancelled by customer' },
      userId,
    );
  }
}
