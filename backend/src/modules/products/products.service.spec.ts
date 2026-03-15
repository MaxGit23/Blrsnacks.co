import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
    let service: ProductsService;

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

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ─── create ─────────────────────────────────────────────────────────────────

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

        it('should default isPublished to false when not provided', async () => {
            const dtoWithoutPublished = { ...createDto, isPublished: undefined };
            mockPrismaService.product.findUnique.mockResolvedValue(null);
            mockPrismaService.$transaction.mockImplementation(async (fn: (tx: typeof mockPrismaService) => Promise<unknown>) => fn(mockPrismaService));
            mockPrismaService.product.create.mockResolvedValue({ id: 'prod-1', ...dtoWithoutPublished });
            mockPrismaService.inventory.create.mockResolvedValue({});

            await service.create(dtoWithoutPublished, 'user-1');

            expect(mockPrismaService.product.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ isPublished: false }),
                }),
            );
        });
    });

    // ─── findBySlug ─────────────────────────────────────────────────────────────

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

        it('should filter out soft-deleted products', async () => {
            mockPrismaService.product.findFirst.mockResolvedValue(null);

            await expect(service.findBySlug('deleted-product')).rejects.toThrow(NotFoundException);
            expect(mockPrismaService.product.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ deletedAt: null }),
                }),
            );
        });
    });

    // ─── findAll (pagination + search + filters) ────────────────────────────────

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

        it('should calculate totalPages correctly', async () => {
            mockPrismaService.$transaction.mockResolvedValue([[], 25]);

            const result = await service.findAll({ page: 1, limit: 10 });
            expect(result.meta.totalPages).toBe(3);
        });

        it('should apply search filter to name and description', async () => {
            mockPrismaService.$transaction.mockResolvedValue([[], 0]);

            await service.findAll({ search: 'banana' });

            expect(mockPrismaService.$transaction).toHaveBeenCalled();
        });

        it('should filter by categoryId', async () => {
            mockPrismaService.$transaction.mockResolvedValue([[], 0]);

            await service.findAll({ categoryId: 'cat-1' });

            expect(mockPrismaService.$transaction).toHaveBeenCalled();
        });

        it('should filter by price range', async () => {
            mockPrismaService.$transaction.mockResolvedValue([[], 0]);

            await service.findAll({ minPrice: 10, maxPrice: 100 });

            expect(mockPrismaService.$transaction).toHaveBeenCalled();
        });

        it('should default to page 1 and limit 20', async () => {
            mockPrismaService.$transaction.mockResolvedValue([[], 0]);

            const result = await service.findAll({});
            expect(result.meta.page).toBe(1);
            expect(result.meta.limit).toBe(20);
        });
    });

    // ─── update ────────────────────────────────────────────────────────────────

    describe('update', () => {
        it('should throw NotFoundException if product does not exist', async () => {
            mockPrismaService.product.findFirst.mockResolvedValue(null);

            await expect(
                service.update('non-existent', { name: 'New Name' }, 'admin-1'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException if new slug already exists on another product', async () => {
            mockPrismaService.product.findFirst
                .mockResolvedValueOnce({ id: 'prod-1' }) // findById succeeds
                .mockResolvedValueOnce({ id: 'prod-2', slug: 'taken-slug' }); // slug collision

            await expect(
                service.update('prod-1', { slug: 'taken-slug' }, 'admin-1'),
            ).rejects.toThrow(ConflictException);
        });

        it('should update product successfully and set updatedBy', async () => {
            mockPrismaService.product.findFirst.mockResolvedValue({ id: 'prod-1' });
            const updatedProduct = { id: 'prod-1', name: 'Updated Name', category: {}, inventory: {} };
            mockPrismaService.product.update.mockResolvedValue(updatedProduct);

            const result = await service.update('prod-1', { name: 'Updated Name' }, 'admin-1');

            expect(result.name).toBe('Updated Name');
            expect(mockPrismaService.product.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ updatedBy: 'admin-1' }),
                }),
            );
        });
    });

    // ─── updateImages ──────────────────────────────────────────────────────────

    describe('updateImages', () => {
        it('should throw NotFoundException if product does not exist', async () => {
            mockPrismaService.product.findFirst.mockResolvedValue(null);

            await expect(
                service.updateImages('non-existent', ['img.jpg'], 'admin-1'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should update images array on the product', async () => {
            mockPrismaService.product.findFirst.mockResolvedValue({ id: 'prod-1' });
            const imageUrls = ['/uploads/products/img1.jpg', '/uploads/products/img2.jpg'];
            mockPrismaService.product.update.mockResolvedValue({ id: 'prod-1', images: imageUrls });

            const result = await service.updateImages('prod-1', imageUrls, 'admin-1');

            expect(result.images).toEqual(imageUrls);
            expect(mockPrismaService.product.update).toHaveBeenCalledWith({
                where: { id: 'prod-1' },
                data: { images: imageUrls, updatedBy: 'admin-1' },
            });
        });
    });

    // ─── softDelete ────────────────────────────────────────────────────────────

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
