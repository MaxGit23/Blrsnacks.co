import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);

    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateProductDto, userId: string) {
        const existing = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
        if (existing) {
            throw new ConflictException(`Product with slug "${dto.slug}" already exists`);
        }

        const product = await this.prisma.$transaction(async (tx) => {
            const created = await tx.product.create({
                data: {
                    name: dto.name,
                    slug: dto.slug,
                    description: dto.description,
                    price: dto.price,
                    categoryId: dto.categoryId,
                    images: dto.images ?? [],
                    isPublished: dto.isPublished ?? false,
                    createdBy: userId,
                    updatedBy: userId,
                },
                include: { category: true },
            });

            // Auto-create inventory record
            await tx.inventory.create({
                data: {
                    productId: created.id,
                    stock: 0,
                    reservedStock: 0,
                    updatedBy: userId,
                },
            });

            return created;
        });

        this.logger.log(`Product created: ${product.name} (${product.id})`);
        return product;
    }

    async findAll(query: QueryProductDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {
            deletedAt: null,
        };

        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { description: { contains: query.search } },
            ];
        }

        if (query.categoryId) {
            where.categoryId = query.categoryId;
        }

        if (query.categorySlug) {
            where.category = { slug: query.categorySlug };
        }

        if (query.isPublished !== undefined) {
            where.isPublished = query.isPublished;
        }

        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            where.price = {};
            if (query.minPrice !== undefined) where.price.gte = query.minPrice;
            if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
        }

        const orderBy: Prisma.ProductOrderByWithRelationInput = {};
        if (query.sortBy) {
            orderBy[query.sortBy] = query.sortOrder ?? 'asc';
        } else {
            orderBy.createdAt = 'desc';
        }

        const [products, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    inventory: { select: { stock: true, reservedStock: true } },
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findBySlug(slug: string) {
        const product = await this.prisma.product.findFirst({
            where: { slug, deletedAt: null },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                inventory: { select: { stock: true, reservedStock: true } },
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with slug "${slug}" not found`);
        }

        return product;
    }

    async findById(id: string) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
            include: {
                category: true,
                inventory: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }

        return product;
    }

    async update(id: string, dto: UpdateProductDto, userId: string) {
        await this.findById(id);

        if (dto.slug) {
            const existing = await this.prisma.product.findFirst({
                where: { slug: dto.slug, id: { not: id }, deletedAt: null },
            });
            if (existing) {
                throw new ConflictException(`Product with slug "${dto.slug}" already exists`);
            }
        }

        const updated = await this.prisma.product.update({
            where: { id },
            data: {
                ...dto,
                images: dto.images ?? undefined,
                updatedBy: userId,
            },
            include: { category: true, inventory: true },
        });

        this.logger.log(`Product updated: ${updated.name} (${updated.id})`);
        return updated;
    }

    async softDelete(id: string) {
        await this.findById(id);

        await this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        this.logger.log(`Product soft-deleted: ${id}`);
        return { message: 'Product deleted successfully' };
    }

    async updateImages(productId: string, imageUrls: string[], userId: string) {
        await this.findById(productId);

        return this.prisma.product.update({
            where: { id: productId },
            data: { images: imageUrls, updatedBy: userId },
        });
    }
}
