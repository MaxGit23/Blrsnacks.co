import { PrismaService } from '../../prisma/prisma.service';
export declare class InventoryService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getByProductId(productId: string): Promise<{
        product: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        updatedBy: string | null;
        productId: string;
        stock: number;
        reservedStock: number;
    }>;
    updateStock(productId: string, newStock: number, userId: string): Promise<{
        id: string;
        updatedAt: Date;
        updatedBy: string | null;
        productId: string;
        stock: number;
        reservedStock: number;
    }>;
    reserveStock(productId: string, quantity: number): Promise<{
        id: string;
        updatedAt: Date;
        updatedBy: string | null;
        productId: string;
        stock: number;
        reservedStock: number;
    }>;
    releaseStock(productId: string, quantity: number): Promise<{
        id: string;
        updatedAt: Date;
        updatedBy: string | null;
        productId: string;
        stock: number;
        reservedStock: number;
    }>;
    confirmStockDeduction(productId: string, quantity: number): Promise<{
        id: string;
        updatedAt: Date;
        updatedBy: string | null;
        productId: string;
        stock: number;
        reservedStock: number;
    }>;
    getLowStockProducts(threshold?: number): Promise<({
        product: {
            name: string;
            id: string;
            slug: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        updatedAt: Date;
        updatedBy: string | null;
        productId: string;
        stock: number;
        reservedStock: number;
    })[]>;
}
