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
    });

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
    });

    describe('softDelete', () => {
        it('should set deletedAt on the category', async () => {
            mockPrismaService.category.findFirst.mockResolvedValue({ id: 'cat-1' });
            mockPrismaService.category.update.mockResolvedValue({});

            const result = await service.softDelete('cat-1');
            expect(result.message).toBe('Category deleted successfully');
        });
    });
});
