import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto';
export declare class CartService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getOrCreateCart(userId?: string, sessionId?: string): Promise<{
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
    getCart(userId?: string, sessionId?: string): Promise<{
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
    addItem(dto: AddCartItemDto, userId?: string, sessionId?: string): Promise<{
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
    updateItem(itemId: string, dto: UpdateCartItemDto, userId?: string, sessionId?: string): Promise<{
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
    removeItem(itemId: string, userId?: string, sessionId?: string): Promise<{
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
    clearCart(userId?: string, sessionId?: string): Promise<{
        message: string;
    }>;
    mergeGuestCart(sessionId: string, userId: string): Promise<void>;
}
