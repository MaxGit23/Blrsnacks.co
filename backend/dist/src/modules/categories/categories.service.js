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
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CategoriesService = CategoriesService_1 = class CategoriesService {
    prisma;
    logger = new common_1.Logger(CategoriesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
        if (existing) {
            throw new common_1.ConflictException(`Category with slug "${dto.slug}" already exists`);
        }
        if (dto.parentId) {
            const parent = await this.prisma.category.findFirst({
                where: { id: dto.parentId, deletedAt: null },
            });
            if (!parent) {
                throw new common_1.NotFoundException(`Parent category not found`);
            }
        }
        const category = await this.prisma.category.create({
            data: {
                name: dto.name,
                slug: dto.slug,
                parentId: dto.parentId ?? null,
                createdBy: userId,
                updatedBy: userId,
            },
        });
        this.logger.log(`Category created: ${category.name} (${category.id})`);
        return category;
    }
    async findAll() {
        return this.prisma.category.findMany({
            where: { deletedAt: null },
            include: {
                children: {
                    where: { deletedAt: null },
                    select: { id: true, name: true, slug: true },
                },
                _count: { select: { products: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findFirst({
            where: { slug, deletedAt: null },
            include: {
                children: {
                    where: { deletedAt: null },
                    select: { id: true, name: true, slug: true },
                },
                _count: { select: { products: true } },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug "${slug}" not found`);
        }
        return category;
    }
    async findById(id) {
        const category = await this.prisma.category.findFirst({
            where: { id, deletedAt: null },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }
    async update(id, dto, userId) {
        await this.findById(id);
        if (dto.slug) {
            const existing = await this.prisma.category.findFirst({
                where: { slug: dto.slug, id: { not: id }, deletedAt: null },
            });
            if (existing) {
                throw new common_1.ConflictException(`Category with slug "${dto.slug}" already exists`);
            }
        }
        const updated = await this.prisma.category.update({
            where: { id },
            data: { ...dto, updatedBy: userId },
        });
        this.logger.log(`Category updated: ${updated.name} (${updated.id})`);
        return updated;
    }
    async softDelete(id) {
        await this.findById(id);
        await this.prisma.category.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        this.logger.log(`Category soft-deleted: ${id}`);
        return { message: 'Category deleted successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map