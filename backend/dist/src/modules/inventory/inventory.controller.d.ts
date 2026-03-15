import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';
declare class LowStockQuery {
    threshold?: number;
}
export declare class InventoryController {
    private readonly inventoryService;
    private readonly logger;
    constructor(inventoryService: InventoryService);
    getLowStock(query: LowStockQuery): Promise<({
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
    updateStock(productId: string, dto: UpdateInventoryDto, user: JwtPayload): Promise<{
        id: string;
        updatedAt: Date;
        updatedBy: string | null;
        productId: string;
        stock: number;
        reservedStock: number;
    }>;
}
export {};
