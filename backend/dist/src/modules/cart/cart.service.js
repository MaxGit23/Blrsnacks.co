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
var CartService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CartService = CartService_1 = class CartService {
    prisma;
    logger = new common_1.Logger(CartService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId, sessionId) {
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either userId or sessionId is required');
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
            this.logger.log(`Cart created for ${userId ? 'user' : 'session'}: ${userId ?? sessionId}`);
        }
        return cart;
    }
    async getCart(userId, sessionId) {
        return this.getOrCreateCart(userId, sessionId);
    }
    async addItem(dto, userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        const product = await this.prisma.product.findFirst({
            where: { id: dto.productId, deletedAt: null, isPublished: true },
            include: { inventory: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found or unavailable');
        }
        const availableStock = (product.inventory?.stock ?? 0) - (product.inventory?.reservedStock ?? 0);
        if (dto.quantity > availableStock) {
            throw new common_1.BadRequestException(`Only ${availableStock} units available`);
        }
        const existingItem = await this.prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId: dto.productId },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + dto.quantity;
            if (newQuantity > availableStock) {
                throw new common_1.BadRequestException(`Cannot add more. Only ${availableStock} units available total`);
            }
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
            this.logger.log(`Cart item updated: product ${dto.productId}, qty ${newQuantity}`);
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity: dto.quantity,
                    priceAtAdd: product.price,
                },
            });
            this.logger.log(`Cart item added: product ${dto.productId}, qty ${dto.quantity}`);
        }
        return this.getCart(userId, sessionId);
    }
    async updateItem(itemId, dto, userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        const cartItem = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id },
            include: { product: { include: { inventory: true } } },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        const availableStock = (cartItem.product.inventory?.stock ?? 0) - (cartItem.product.inventory?.reservedStock ?? 0);
        if (dto.quantity > availableStock) {
            throw new common_1.BadRequestException(`Only ${availableStock} units available`);
        }
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity },
        });
        this.logger.log(`Cart item ${itemId} quantity updated to ${dto.quantity}`);
        return this.getCart(userId, sessionId);
    }
    async removeItem(itemId, userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        const cartItem = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.prisma.cartItem.delete({ where: { id: itemId } });
        this.logger.log(`Cart item removed: ${itemId}`);
        return this.getCart(userId, sessionId);
    }
    async clearCart(userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        this.logger.log(`Cart cleared for ${userId ? 'user' : 'session'}: ${userId ?? sessionId}`);
        return { message: 'Cart cleared successfully' };
    }
    async mergeGuestCart(sessionId, userId) {
        const guestCart = await this.prisma.cart.findFirst({
            where: { sessionId },
            include: { items: true },
        });
        if (!guestCart || guestCart.items.length === 0)
            return;
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
            }
            else {
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
        await this.prisma.cart.delete({ where: { id: guestCart.id } });
        this.logger.log(`Guest cart merged into user cart: ${userId}`);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = CartService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map