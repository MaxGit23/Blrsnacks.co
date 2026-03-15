import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
    let service: ProductsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        product: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
        inventory: {
            create: jest.fn(),
        },
        $transaction: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        prisma = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createDto = {
            name: 'Test Product',
            slug: 'test-product',
            description: 'A test product description with enough length',
            price: 9.99,
            categoryId: 'cat-1',
            images: ['img1.jpg'],
            isPublished: false,
        };

        it('should throw ConflictException if slug exists', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.create(createDto, 'user-1')).rejects.toThrow(
                ConflictException,
            );
        });

        it('should create product with inventory in a transaction', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue(null);

            const mockProduct = { id: 'prod-1', ...createDto, category: { id: 'cat-1', name: 'Test' } };
            mockPrismaService.$transaction.mockImplementation(async (fn: (tx: typeof mockPrismaService) => Promise<unknown>) => {
                return fn(mockPrismaService);
            });
            mockPrismaService.product.create.mockResolvedValue(mockProduct);
            mockPrismaService.inventory.create.mockResolvedValue({});

            const result = await service.create(createDto, 'user-1');

            expect(result).toEqual(mockProduct);
            expect(mockPrismaService.product.create).toHaveBeenCalled();
            expect(mockPrismaService.inventory.create).toHaveBeenCalledWith({
                data: {
                    productId: 'prod-1',
                    stock: 0,
                    reservedStock: 0,
                    updatedBy: 'user-1',
                },
            });
        });
    });

    describe('findBySlug', () => {
        it('should throw NotFoundException if product not found', async () => {
            mockPrismaService.product.findFirst.mockResolvedValue(null);

            await expect(service.findBySlug('non-existent')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should return product with category and inventory', async () => {
            const mockProduct = {
                id: 'prod-1',
                slug: 'test-product',
                category: { id: 'cat-1', name: 'Test', slug: 'test' },
                inventory: { stock: 10, reservedStock: 2 },
            };
            mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);

            const result = await service.findBySlug('test-product');
            expect(result).toEqual(mockProduct);
        });
    });

    describe('findAll', () => {
        it('should return paginated products', async () => {
            const mockProducts = [
                { id: 'prod-1', name: 'Product 1' },
                { id: 'prod-2', name: 'Product 2' },
            ];
            mockPrismaService.$transaction.mockResolvedValue([mockProducts, 2]);

            const result = await service.findAll({ page: 1, limit: 10 });

            expect(result.data).toEqual(mockProducts);
            expect(result.meta.total).toBe(2);
            expect(result.meta.page).toBe(1);
            expect(result.meta.totalPages).toBe(1);
        });
    });

    describe('softDelete', () => {
        it('should throw NotFoundException if product not found', async () => {
            mockPrismaService.product.findFirst.mockResolvedValue(null);

            await expect(service.softDelete('non-existent')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should set deletedAt on the product', async () => {
            mockPrismaService.product.findFirst.mockResolvedValue({ id: 'prod-1' });
            mockPrismaService.product.update.mockResolvedValue({});

            const result = await service.softDelete('prod-1');

            expect(result.message).toBe('Product deleted successfully');
            expect(mockPrismaService.product.update).toHaveBeenCalledWith({
                where: { id: 'prod-1' },
                data: { deletedAt: expect.any(Date) },
            });
        });
    });
});
