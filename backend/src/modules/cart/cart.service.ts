import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestException('Either userId or sessionId is required');
    }

    const where = userId ? { userId } : { sessionId };

    let cart = await this.prisma.cart.findFirst({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                deletedAt: true,
                inventory: { select: { stock: true, reservedStock: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId, sessionId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                  deletedAt: true,
                  inventory: { select: { stock: true, reservedStock: true } },
                },
              },
            },
          },
        },
      });
      this.logger.log(
        `Cart created for ${userId ? 'user' : 'session'}: ${userId ?? sessionId}`,
      );
    }

    return cart;
  }

  async getCart(userId?: string, sessionId?: string) {
    return this.getOrCreateCart(userId, sessionId);
  }

  async addItem(dto: AddCartItemDto, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    // Validate product exists and is available
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, deletedAt: null, isPublished: true },
      include: { inventory: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found or unavailable');
    }

    const availableStock =
      (product.inventory?.stock ?? 0) - (product.inventory?.reservedStock ?? 0);
    if (dto.quantity > availableStock) {
      throw new BadRequestException(`Only ${availableStock} units available`);
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (newQuantity > availableStock) {
        throw new BadRequestException(
          `Cannot add more. Only ${availableStock} units available total`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });

      this.logger.log(
        `Cart item updated: product ${dto.productId}, qty ${newQuantity}`,
      );
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
          priceAtAdd: product.price,
        },
      });

      this.logger.log(
        `Cart item added: product ${dto.productId}, qty ${dto.quantity}`,
      );
    }

    return this.getCart(userId, sessionId);
  }

  async updateItem(
    itemId: string,
    dto: UpdateCartItemDto,
    userId?: string,
    sessionId?: string,
  ) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: { include: { inventory: true } } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const availableStock =
      (cartItem.product.inventory?.stock ?? 0) -
      (cartItem.product.inventory?.reservedStock ?? 0);
    if (dto.quantity > availableStock) {
      throw new BadRequestException(`Only ${availableStock} units available`);
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    this.logger.log(`Cart item ${itemId} quantity updated to ${dto.quantity}`);

    return this.getCart(userId, sessionId);
  }

  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });

    this.logger.log(`Cart item removed: ${itemId}`);

    return this.getCart(userId, sessionId);
  }

  async clearCart(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    this.logger.log(
      `Cart cleared for ${userId ? 'user' : 'session'}: ${userId ?? sessionId}`,
    );

    return { message: 'Cart cleared successfully' };
  }

  async mergeGuestCart(sessionId: string, userId: string) {
    const guestCart = await this.prisma.cart.findFirst({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) return;

    const userCart = await this.getOrCreateCart(userId);

    for (const guestItem of guestCart.items) {
      const existingItem = await this.prisma.cartItem.findFirst({
        where: { cartId: userCart.id, productId: guestItem.productId },
      });

      if (existingItem) {
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + guestItem.quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            priceAtAdd: guestItem.priceAtAdd,
          },
        });
      }
    }

    // Delete guest cart (cascade deletes items)
    await this.prisma.cart.delete({ where: { id: guestCart.id } });
    this.logger.log(`Guest cart merged into user cart: ${userId}`);
  }
}
