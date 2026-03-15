import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(dto: CreateCategoryDto, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
        parentId: string | null;
    }>;
    findAll(): Promise<({
        _count: {
            products: number;
        };
        children: {
            name: string;
            id: string;
            slug: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
        parentId: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        _count: {
            products: number;
        };
        children: {
            name: string;
            id: string;
            slug: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
        parentId: string | null;
    }>;
    findById(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
        parentId: string | null;
    }>;
    update(id: string, dto: UpdateCategoryDto, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
        parentId: string | null;
    }>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
}
