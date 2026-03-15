import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';
export declare class ProductsController {
    private readonly productsService;
    private readonly logger;
    constructor(productsService: ProductsService);
    findAll(query: QueryProductDto): Promise<{
        data: ({
            category: {
                name: string;
                id: string;
                slug: string;
            };
            inventory: {
                stock: number;
                reservedStock: number;
            } | null;
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            categoryId: string;
            images: import("@prisma/client/runtime/library").JsonValue;
            isPublished: boolean;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
        };
        inventory: {
            stock: number;
            reservedStock: number;
        } | null;
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        images: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
    create(dto: CreateProductDto, user: JwtPayload): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
            parentId: string | null;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        images: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
    update(id: string, dto: UpdateProductDto, user: JwtPayload): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
            parentId: string | null;
        };
        inventory: {
            id: string;
            updatedAt: Date;
            updatedBy: string | null;
            productId: string;
            stock: number;
            reservedStock: number;
        } | null;
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        images: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    uploadImages(id: string, files: Express.Multer.File[], user: JwtPayload): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        images: import("@prisma/client/runtime/library").JsonValue;
        isPublished: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
}
