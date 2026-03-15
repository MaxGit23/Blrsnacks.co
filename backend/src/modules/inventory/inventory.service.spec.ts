import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('InventoryService', () => {
    let service: InventoryService;

    const mockPrismaService = {
        inventory: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
        $transaction: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InventoryService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<InventoryService>(InventoryService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getByProductId', () => {
        it('should throw NotFoundException if inventory not found', async () => {
            mockPrismaService.inventory.findUnique.mockResolvedValue(null);

            await expect(service.getByProductId('prod-1')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should return inventory with product info', async () => {
            const mockInventory = {
                id: 'inv-1',
                productId: 'prod-1',
                stock: 50,
                reservedStock: 5,
                product: { id: 'prod-1', name: 'Test', slug: 'test' },
            };
            mockPrismaService.inventory.findUnique.mockResolvedValue(mockInventory);

            const result = await service.getByProductId('prod-1');
            expect(result.stock).toBe(50);
            expect(result.product.name).toBe('Test');
        });
    });

    describe('updateStock', () => {
        it('should throw NotFoundException if inventory not found', async () => {
            mockPrismaService.inventory.findUnique.mockResolvedValue(null);

            await expect(service.updateStock('prod-1', 100, 'admin-1')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw BadRequestException if new stock < reserved', async () => {
            mockPrismaService.inventory.findUnique.mockResolvedValue({
                stock: 50,
                reservedStock: 20,
            });

            await expect(service.updateStock('prod-1', 10, 'admin-1')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should update stock successfully', async () => {
            mockPrismaService.inventory.findUnique.mockResolvedValue({
                stock: 50,
                reservedStock: 5,
            });
            mockPrismaService.inventory.update.mockResolvedValue({ stock: 100 });

            const result = await service.updateStock('prod-1', 100, 'admin-1');
            expect(result.stock).toBe(100);
        });
    });

    describe('reserveStock', () => {
        it('should throw BadRequestException if insufficient stock', async () => {
            mockPrismaService.$transaction.mockImplementation(async (fn: (tx: typeof mockPrismaService) => Promise<unknown>) => {
                return fn(mockPrismaService);
            });
            mockPrismaService.inventory.findUnique.mockResolvedValue({
                stock: 10,
                reservedStock: 8,
            });

            await expect(service.reserveStock('prod-1', 5)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should reserve stock successfully', async () => {
            mockPrismaService.$transaction.mockImplementation(async (fn: (tx: typeof mockPrismaService) => Promise<unknown>) => {
                return fn(mockPrismaService);
            });
            mockPrismaService.inventory.findUnique.mockResolvedValue({
                stock: 10,
                reservedStock: 2,
            });
            mockPrismaService.inventory.update.mockResolvedValue({ reservedStock: 5 });

            const result = await service.reserveStock('prod-1', 3);
            expect(result.reservedStock).toBe(5);
        });
    });

    describe('getLowStockProducts', () => {
        it('should return products below threshold', async () => {
            const lowStock = [
                { id: 'inv-1', stock: 3, product: { name: 'Low Product' } },
            ];
            mockPrismaService.inventory.findMany.mockResolvedValue(lowStock);

            const result = await service.getLowStockProducts(10);
            expect(result).toHaveLength(1);
            expect(result[0].stock).toBe(3);
        });
    });
});
