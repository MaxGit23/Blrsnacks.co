import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
    private readonly logger = new Logger(InventoryService.name);

    constructor(private readonly prisma: PrismaService) { }

    async getByProductId(productId: string) {
        const inventory = await this.prisma.inventory.findUnique({
            where: { productId },
            include: {
                product: { select: { id: true, name: true, slug: true } },
            },
        });

        if (!inventory) {
            throw new NotFoundException(`Inventory for product "${productId}" not found`);
        }

        return inventory;
    }

    async updateStock(productId: string, newStock: number, userId: string) {
        const inventory = await this.prisma.inventory.findUnique({
            where: { productId },
        });

        if (!inventory) {
            throw new NotFoundException(`Inventory for product "${productId}" not found`);
        }

        if (newStock < inventory.reservedStock) {
            throw new BadRequestException(
                `Stock cannot be less than reserved stock (${inventory.reservedStock})`,
            );
        }

        const updated = await this.prisma.inventory.update({
            where: { productId },
            data: { stock: newStock, updatedBy: userId },
        });

        this.logger.log(`Inventory updated for product ${productId}: stock=${newStock}`);
        return updated;
    }

    async reserveStock(productId: string, quantity: number) {
        return this.prisma.$transaction(async (tx) => {
            const inventory = await tx.inventory.findUnique({
                where: { productId },
            });

            if (!inventory) {
                throw new NotFoundException(`Inventory for product "${productId}" not found`);
            }

            const availableStock = inventory.stock - inventory.reservedStock;
            if (quantity > availableStock) {
                throw new BadRequestException(
                    `Insufficient stock. Available: ${availableStock}, Requested: ${quantity}`,
                );
            }

            return tx.inventory.update({
                where: { productId },
                data: { reservedStock: { increment: quantity } },
            });
        });
    }

    async releaseStock(productId: string, quantity: number) {
        return this.prisma.$transaction(async (tx) => {
            const inventory = await tx.inventory.findUnique({
                where: { productId },
            });

            if (!inventory) {
                throw new NotFoundException(`Inventory for product "${productId}" not found`);
            }

            if (quantity > inventory.reservedStock) {
                throw new BadRequestException('Cannot release more than reserved stock');
            }

            return tx.inventory.update({
                where: { productId },
                data: { reservedStock: { decrement: quantity } },
            });
        });
    }

    async confirmStockDeduction(productId: string, quantity: number) {
        return this.prisma.$transaction(async (tx) => {
            const inventory = await tx.inventory.findUnique({
                where: { productId },
            });

            if (!inventory) {
                throw new NotFoundException(`Inventory for product "${productId}" not found`);
            }

            return tx.inventory.update({
                where: { productId },
                data: {
                    stock: { decrement: quantity },
                    reservedStock: { decrement: quantity },
                },
            });
        });
    }

    async getLowStockProducts(threshold: number = 10) {
        return this.prisma.inventory.findMany({
            where: {
                stock: { lte: threshold },
                product: { deletedAt: null },
            },
            include: {
                product: { select: { id: true, name: true, slug: true, price: true, images: true } },
            },
            orderBy: { stock: 'asc' },
        });
    }
}
