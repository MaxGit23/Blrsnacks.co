import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    Query,
    Body,
    UseGuards,
    Logger,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, QueryOrderDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    private readonly logger = new Logger(OrdersController.name);

    constructor(private readonly ordersService: OrdersService) { }

    // ─── Customer Endpoints ────────────────────────────────────────────────────

    @Post()
    async placeOrder(
        @Body() dto: CreateOrderDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.ordersService.placeOrder(dto, user.sub);
    }

    @Get('me')
    async getMyOrders(
        @Query() query: QueryOrderDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.ordersService.getUserOrders(user.sub, query);
    }

    @Get('me/:id')
    async getMyOrder(
        @Param('id') id: string,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.ordersService.getOrderById(id, user.sub);
    }

    @Post('me/:id/cancel')
    async cancelMyOrder(
        @Param('id') id: string,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.ordersService.cancelOrder(id, user.sub);
    }

    // ─── Admin Endpoints ──────────────────────────────────────────────────────

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async getAllOrders(@Query() query: QueryOrderDto) {
        return this.ordersService.getAllOrders(query);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async getOrder(@Param('id') id: string) {
        return this.ordersService.getOrderById(id);
    }

    @Put(':id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateOrderStatusDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.ordersService.updateStatus(id, dto, user.sub);
    }
}
