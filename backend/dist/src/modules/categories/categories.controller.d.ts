import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';
export declare class CategoriesController {
    private readonly categoriesService;
    private readonly logger;
    constructor(categoriesService: CategoriesService);
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
    create(dto: CreateCategoryDto, user: JwtPayload): Promise<{
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
    update(id: string, dto: UpdateCategoryDto, user: JwtPayload): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
