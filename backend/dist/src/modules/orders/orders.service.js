"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const VALID_TRANSITIONS = {
    PENDING: [client_1.OrderStatus.CONFIRMED, client_1.OrderStatus.CANCELLED],
    CONFIRMED: [client_1.OrderStatus.SHIPPED, client_1.OrderStatus.CANCELLED],
    SHIPPED: [client_1.OrderStatus.DELIVERED],
    DELIVERED: [],
    CANCELLED: [],
};
let OrdersService = OrdersService_1 = class OrdersService {
    prisma;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async placeOrder(dto, userId) {
        return this.prisma.$transaction(async (tx) => {
            const address = await tx.address.findFirst({
                where: { id: dto.addressId, userId },
            });
            if (!address) {
                throw new common_1.NotFoundException('Address not found');
            }
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
                throw new common_1.BadRequestException('Cart is empty');
            }
            let totalAmount = new client_1.Prisma.Decimal(0);
            for (const item of cart.items) {
                if (item.product.deletedAt) {
                    throw new common_1.BadRequestException(`Product "${item.product.name}" is no longer available`);
                }
                const available = (item.product.inventory?.stock ?? 0) - (item.product.inventory?.reservedStock ?? 0);
                if (item.quantity > available) {
                    throw new common_1.BadRequestException(`Insufficient stock for "${item.product.name}". Available: ${available}`);
                }
                totalAmount = totalAmount.add(item.product.price.mul(item.quantity));
            }
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId: dto.addressId,
                    paymentMethod: dto.paymentMethod ?? 'COD',
                    totalAmount,
                    status: client_1.OrderStatus.PENDING,
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            priceAtPurchase: item.product.price,
                        })),
                    },
                    statusHistory: {
                        create: {
                            status: client_1.OrderStatus.PENDING,
                            notes: 'Order placed',
                            createdBy: userId,
                        },
                    },
                },
            });
            for (const item of cart.items) {
                await tx.inventory.update({
                    where: { productId: item.productId },
                    data: { reservedStock: { increment: item.quantity } },
                });
            }
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
            this.logger.log(`Order placed: ${order.id} by user ${userId}, total: ${totalAmount}`);
            return this.getOrderById(order.id, userId, tx);
        });
    }
    async getOrderById(id, userId, tx) {
        const client = tx ?? this.prisma;
        const where = { id };
        if (userId)
            where.userId = userId;
        const order = await client.order.findFirst({
            where,
            include: {
                items: {
                    include: {
                        product: { select: { id: true, name: true, slug: true, images: true } },
                    },
                },
                address: true,
                statusHistory: { orderBy: { createdAt: 'desc' } },
                user: { select: { id: true, email: true } },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async getUserOrders(userId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (query.status)
            where.status = query.status;
        const [orders, total] = await this.prisma.$transaction([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            product: { select: { id: true, name: true, slug: true, images: true } },
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
    async getAllOrders(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.userId)
            where.userId = query.userId;
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
    async updateStatus(orderId, dto, adminId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const allowedNext = VALID_TRANSITIONS[order.status];
        if (!allowedNext.includes(dto.status)) {
            throw new common_1.BadRequestException(`Cannot transition from "${order.status}" to "${dto.status}". Allowed: ${allowedNext.join(', ') || 'none'}`);
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: orderId },
                data: { status: dto.status },
            });
            await tx.orderStatusHistory.create({
                data: {
                    orderId,
                    status: dto.status,
                    notes: dto.notes,
                    createdBy: adminId,
                },
            });
            if (dto.status === client_1.OrderStatus.DELIVERED) {
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
            if (dto.status === client_1.OrderStatus.CANCELLED) {
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
    async cancelOrder(orderId, userId) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status !== client_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending orders can be cancelled');
        }
        return this.updateStatus(orderId, { status: client_1.OrderStatus.CANCELLED, notes: 'Cancelled by customer' }, userId);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map