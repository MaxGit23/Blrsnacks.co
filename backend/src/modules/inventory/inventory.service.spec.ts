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

  // ─── getByProductId ─────────────────────────────────────────────────────────

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

  // ─── updateStock ────────────────────────────────────────────────────────────

  describe('updateStock', () => {
    it('should throw NotFoundException if inventory not found', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStock('prod-1', 100, 'admin-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if new stock < reserved', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 50,
        reservedStock: 20,
      });

      await expect(
        service.updateStock('prod-1', 10, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
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

    it('should allow setting stock equal to reserved', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 50,
        reservedStock: 20,
      });
      mockPrismaService.inventory.update.mockResolvedValue({ stock: 20 });

      const result = await service.updateStock('prod-1', 20, 'admin-1');
      expect(result.stock).toBe(20);
    });

    it('should pass updatedBy to the update call', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 50,
        reservedStock: 0,
      });
      mockPrismaService.inventory.update.mockResolvedValue({ stock: 75 });

      await service.updateStock('prod-1', 75, 'admin-42');

      expect(mockPrismaService.inventory.update).toHaveBeenCalledWith({
        where: { productId: 'prod-1' },
        data: { stock: 75, updatedBy: 'admin-42' },
      });
    });
  });

  // ─── reserveStock ───────────────────────────────────────────────────────────

  describe('reserveStock', () => {
    beforeEach(() => {
      mockPrismaService.$transaction.mockImplementation(
        async (fn: (tx: typeof mockPrismaService) => Promise<unknown>) =>
          fn(mockPrismaService),
      );
    });

    it('should throw NotFoundException if inventory not found', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue(null);

      await expect(service.reserveStock('prod-1', 5)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if insufficient stock', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 10,
        reservedStock: 8,
      });

      await expect(service.reserveStock('prod-1', 5)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reserve stock successfully', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 10,
        reservedStock: 2,
      });
      mockPrismaService.inventory.update.mockResolvedValue({
        reservedStock: 5,
      });

      const result = await service.reserveStock('prod-1', 3);
      expect(result.reservedStock).toBe(5);
    });

    it('should use increment for reservedStock', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 100,
        reservedStock: 0,
      });
      mockPrismaService.inventory.update.mockResolvedValue({
        reservedStock: 7,
      });

      await service.reserveStock('prod-1', 7);

      expect(mockPrismaService.inventory.update).toHaveBeenCalledWith({
        where: { productId: 'prod-1' },
        data: { reservedStock: { increment: 7 } },
      });
    });
  });

  // ─── releaseStock ───────────────────────────────────────────────────────────

  describe('releaseStock', () => {
    beforeEach(() => {
      mockPrismaService.$transaction.mockImplementation(
        async (fn: (tx: typeof mockPrismaService) => Promise<unknown>) =>
          fn(mockPrismaService),
      );
    });

    it('should throw NotFoundException if inventory not found', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue(null);

      await expect(service.releaseStock('prod-1', 5)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if releasing more than reserved', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 50,
        reservedStock: 3,
      });

      await expect(service.releaseStock('prod-1', 10)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should release reserved stock successfully', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 50,
        reservedStock: 10,
      });
      mockPrismaService.inventory.update.mockResolvedValue({
        reservedStock: 5,
      });

      const result = await service.releaseStock('prod-1', 5);
      expect(result.reservedStock).toBe(5);
    });

    it('should use decrement for reservedStock', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 50,
        reservedStock: 10,
      });
      mockPrismaService.inventory.update.mockResolvedValue({
        reservedStock: 7,
      });

      await service.releaseStock('prod-1', 3);

      expect(mockPrismaService.inventory.update).toHaveBeenCalledWith({
        where: { productId: 'prod-1' },
        data: { reservedStock: { decrement: 3 } },
      });
    });
  });

  // ─── confirmStockDeduction ──────────────────────────────────────────────────

  describe('confirmStockDeduction', () => {
    beforeEach(() => {
      mockPrismaService.$transaction.mockImplementation(
        async (fn: (tx: typeof mockPrismaService) => Promise<unknown>) =>
          fn(mockPrismaService),
      );
    });

    it('should throw NotFoundException if inventory not found', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue(null);

      await expect(service.confirmStockDeduction('prod-1', 5)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should decrement both stock and reservedStock', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue({
        stock: 50,
        reservedStock: 10,
      });
      mockPrismaService.inventory.update.mockResolvedValue({
        stock: 45,
        reservedStock: 5,
      });

      const result = await service.confirmStockDeduction('prod-1', 5);

      expect(result.stock).toBe(45);
      expect(mockPrismaService.inventory.update).toHaveBeenCalledWith({
        where: { productId: 'prod-1' },
        data: {
          stock: { decrement: 5 },
          reservedStock: { decrement: 5 },
        },
      });
    });
  });

  // ─── getLowStockProducts ────────────────────────────────────────────────────

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

    it('should default threshold to 10', async () => {
      mockPrismaService.inventory.findMany.mockResolvedValue([]);

      await service.getLowStockProducts();

      expect(mockPrismaService.inventory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            stock: { lte: 10 },
          }),
        }),
      );
    });

    it('should exclude soft-deleted products', async () => {
      mockPrismaService.inventory.findMany.mockResolvedValue([]);

      await service.getLowStockProducts(5);

      expect(mockPrismaService.inventory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            product: { deletedAt: null },
          }),
        }),
      );
    });

    it('should order by stock ascending', async () => {
      mockPrismaService.inventory.findMany.mockResolvedValue([]);

      await service.getLowStockProducts(10);

      expect(mockPrismaService.inventory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { stock: 'asc' },
        }),
      );
    });
  });
});
