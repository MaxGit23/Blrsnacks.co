import type { Request } from 'express';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto';
export declare class CartController {
    private readonly cartService;
    private readonly logger;
    constructor(cartService: CartService);
    private extractIdentifiers;
    getCart(req: Request): Promise<{
        items: ({
            product: {
                inventory: {
                    stock: number;
                    reservedStock: number;
                } | null;
                name: string;
                id: string;
                slug: string;
                price: import("@prisma/client/runtime/library").Decimal;
                images: import("@prisma/client/runtime/library").JsonValue;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
            priceAtAdd: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        sessionId: string | null;
    }>;
    addItem(dto: AddCartItemDto, req: Request): Promise<{
        items: ({
            product: {
                inventory: {
                    stock: number;
                    reservedStock: number;
                } | null;
                name: string;
                id: string;
                slug: string;
                price: import("@prisma/client/runtime/library").Decimal;
                images: import("@prisma/client/runtime/library").JsonValue;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
            priceAtAdd: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        sessionId: string | null;
    }>;
    updateItem(id: string, dto: UpdateCartItemDto, req: Request): Promise<{
        items: ({
            product: {
                inventory: {
                    stock: number;
                    reservedStock: number;
                } | null;
                name: string;
                id: string;
                slug: string;
                price: import("@prisma/client/runtime/library").Decimal;
                images: import("@prisma/client/runtime/library").JsonValue;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
            priceAtAdd: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        sessionId: string | null;
    }>;
    removeItem(id: string, req: Request): Promise<{
        items: ({
            product: {
                inventory: {
                    stock: number;
                    reservedStock: number;
                } | null;
                name: string;
                id: string;
                slug: string;
                price: import("@prisma/client/runtime/library").Decimal;
                images: import("@prisma/client/runtime/library").JsonValue;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            cartId: string;
            quantity: number;
            priceAtAdd: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        sessionId: string | null;
    }>;
    clearCart(req: Request): Promise<{
        message: string;
    }>;
}
