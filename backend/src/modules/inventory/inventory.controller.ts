import {
    Controller,
    Get,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
    Logger,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

class LowStockQuery {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    threshold?: number;
}

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class InventoryController {
    private readonly logger = new Logger(InventoryController.name);

    constructor(private readonly inventoryService: InventoryService) { }

    @Get('low-stock')
    async getLowStock(@Query() query: LowStockQuery) {
        return this.inventoryService.getLowStockProducts(query.threshold);
    }

    @Get(':productId')
    async getByProductId(@Param('productId') productId: string) {
        return this.inventoryService.getByProductId(productId);
    }

    @Put(':productId')
    async updateStock(
        @Param('productId') productId: string,
        @Body() dto: UpdateInventoryDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.inventoryService.updateStock(productId, dto.stock, user.sub);
    }
}
