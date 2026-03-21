import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto, userId: string) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(
        `Category with slug "${dto.slug}" already exists`,
      );
    }

    if (dto.parentId) {
      const parent = await this.prisma.category.findFirst({
        where: { id: dto.parentId, deletedAt: null },
      });
      if (!parent) {
        throw new NotFoundException(`Parent category not found`);
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

  async findBySlug(slug: string) {
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
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  async findById(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, userId: string) {
    await this.findById(id);

    if (dto.slug) {
      const existing = await this.prisma.category.findFirst({
        where: { slug: dto.slug, id: { not: id }, deletedAt: null },
      });
      if (existing) {
        throw new ConflictException(
          `Category with slug "${dto.slug}" already exists`,
        );
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: { ...dto, updatedBy: userId },
    });

    this.logger.log(`Category updated: ${updated.name} (${updated.id})`);
    return updated;
  }

  async softDelete(id: string) {
    await this.findById(id);

    await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Category soft-deleted: ${id}`);
    return { message: 'Category deleted successfully' };
  }
}
