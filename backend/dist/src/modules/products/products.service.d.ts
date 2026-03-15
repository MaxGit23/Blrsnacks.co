import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto, userId: string): Promise<{
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
        price: Prisma.Decimal;
        categoryId: string;
        images: Prisma.JsonValue;
        isPublished: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
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
            price: Prisma.Decimal;
            categoryId: string;
            images: Prisma.JsonValue;
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
        price: Prisma.Decimal;
        categoryId: string;
        images: Prisma.JsonValue;
        isPublished: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
    findById(id: string): Promise<{
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
        price: Prisma.Decimal;
        categoryId: string;
        images: Prisma.JsonValue;
        isPublished: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
    update(id: string, dto: UpdateProductDto, userId: string): Promise<{
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
        price: Prisma.Decimal;
        categoryId: string;
        images: Prisma.JsonValue;
        isPublished: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
    updateImages(productId: string, imageUrls: string[], userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        price: Prisma.Decimal;
        categoryId: string;
        images: Prisma.JsonValue;
        isPublished: boolean;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
}
