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
var InventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InventoryService = InventoryService_1 = class InventoryService {
    prisma;
    logger = new common_1.Logger(InventoryService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByProductId(productId) {
        const inventory = await this.prisma.inventory.findUnique({
            where: { productId },
            include: {
                product: { select: { id: true, name: true, slug: true } },
            },
        });
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventory for product "${productId}" not found`);
        }
        return inventory;
    }
    async updateStock(productId, newStock, userId) {
        const inventory = await this.prisma.inventory.findUnique({
            where: { productId },
        });
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventory for product "${productId}" not found`);
        }
        if (newStock < inventory.reservedStock) {
            throw new common_1.BadRequestException(`Stock cannot be less than reserved stock (${inventory.reservedStock})`);
        }
        const updated = await this.prisma.inventory.update({
            where: { productId },
            data: { stock: newStock, updatedBy: userId },
        });
        this.logger.log(`Inventory updated for product ${productId}: stock=${newStock}`);
        return updated;
    }
    async reserveStock(productId, quantity) {
        return this.prisma.$transaction(async (tx) => {
            const inventory = await tx.inventory.findUnique({
                where: { productId },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`Inventory for product "${productId}" not found`);
            }
            const availableStock = inventory.stock - inventory.reservedStock;
            if (quantity > availableStock) {
                throw new common_1.BadRequestException(`Insufficient stock. Available: ${availableStock}, Requested: ${quantity}`);
            }
            return tx.inventory.update({
                where: { productId },
                data: { reservedStock: { increment: quantity } },
            });
        });
    }
    async releaseStock(productId, quantity) {
        return this.prisma.$transaction(async (tx) => {
            const inventory = await tx.inventory.findUnique({
                where: { productId },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`Inventory for product "${productId}" not found`);
            }
            if (quantity > inventory.reservedStock) {
                throw new common_1.BadRequestException('Cannot release more than reserved stock');
            }
            return tx.inventory.update({
                where: { productId },
                data: { reservedStock: { decrement: quantity } },
            });
        });
    }
    async confirmStockDeduction(productId, quantity) {
        return this.prisma.$transaction(async (tx) => {
            const inventory = await tx.inventory.findUnique({
                where: { productId },
            });
            if (!inventory) {
                throw new common_1.NotFoundException(`Inventory for product "${productId}" not found`);
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
    async getLowStockProducts(threshold = 10) {
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map