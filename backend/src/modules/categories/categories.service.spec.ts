import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockPrismaService = {
    category: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    const createDto = { name: 'Snacks', slug: 'snacks' };

    it('should throw ConflictException if slug exists', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue({ id: 'cat-1' });

      await expect(service.create(createDto, 'admin-1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create category successfully', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);
      const mockCategory = { id: 'cat-1', ...createDto };
      mockPrismaService.category.create.mockResolvedValue(mockCategory);

      const result = await service.create(createDto, 'admin-1');
      expect(result.name).toBe('Snacks');
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Snacks',
          slug: 'snacks',
          parentId: null,
          createdBy: 'admin-1',
          updatedBy: 'admin-1',
        },
      });
    });

    it('should throw NotFoundException if parentId does not exist', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ ...createDto, parentId: 'non-existent' }, 'admin-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should accept and store parentId when parent exists', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);
      mockPrismaService.category.findFirst.mockResolvedValue({
        id: 'parent-1',
      });
      mockPrismaService.category.create.mockResolvedValue({
        id: 'cat-2',
        ...createDto,
        parentId: 'parent-1',
      });

      const result = await service.create(
        { ...createDto, parentId: 'parent-1' },
        'admin-1',
      );

      expect(result.parentId).toBe('parent-1');
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ parentId: 'parent-1' }),
      });
    });
  });

  // ─── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return categories with children and product count', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Snacks', children: [], _count: { products: 5 } },
      ];
      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]._count.products).toBe(5);
    });

    it('should exclude soft-deleted categories', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null },
        }),
      );
    });

    it('should order categories by name ascending', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { name: 'asc' },
        }),
      );
    });
  });

  // ─── findBySlug ─────────────────────────────────────────────────────────────

  describe('findBySlug', () => {
    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.findBySlug('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return category with children and product count', async () => {
      const mockCategory = {
        id: 'cat-1',
        name: 'Snacks',
        slug: 'snacks',
        children: [{ id: 'sub-1', name: 'Chips', slug: 'chips' }],
        _count: { products: 3 },
      };
      mockPrismaService.category.findFirst.mockResolvedValue(mockCategory);

      const result = await service.findBySlug('snacks');
      expect(result.name).toBe('Snacks');
      expect(result.children).toHaveLength(1);
    });

    it('should filter out soft-deleted categories', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      try {
        await service.findBySlug('test');
      } catch {
        /* expected */
      }

      expect(mockPrismaService.category.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: null }),
        }),
      );
    });
  });

  // ─── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should throw NotFoundException if category does not exist', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'New Name' }, 'admin-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new slug is taken by another category', async () => {
      mockPrismaService.category.findFirst
        .mockResolvedValueOnce({ id: 'cat-1' }) // findById
        .mockResolvedValueOnce({ id: 'cat-2', slug: 'taken' }); // slug collision

      await expect(
        service.update('cat-1', { slug: 'taken' }, 'admin-1'),
      ).rejects.toThrow(ConflictException);
    });

    it('should update category successfully', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      mockPrismaService.category.update.mockResolvedValue({
        id: 'cat-1',
        name: 'Renamed',
      });

      const result = await service.update(
        'cat-1',
        { name: 'Renamed' },
        'admin-1',
      );

      expect(result.name).toBe('Renamed');
      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
        data: { name: 'Renamed', updatedBy: 'admin-1' },
      });
    });

    it('should skip slug conflict check when slug is not being updated', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      mockPrismaService.category.update.mockResolvedValue({
        id: 'cat-1',
        name: 'Updated',
      });

      await service.update('cat-1', { name: 'Updated' }, 'admin-1');

      // findFirst called only once (for findById), not twice (no slug check)
      expect(mockPrismaService.category.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  // ─── softDelete ─────────────────────────────────────────────────────────────

  describe('softDelete', () => {
    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.softDelete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should set deletedAt on the category', async () => {
      mockPrismaService.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      mockPrismaService.category.update.mockResolvedValue({});

      const result = await service.softDelete('cat-1');
      expect(result.message).toBe('Category deleted successfully');
      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
