import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto';

@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  private extractIdentifiers(req: Request): {
    userId?: string;
    sessionId?: string;
  } {
    const user = (req as any).user;
    const userId = user?.sub;
    const sessionId =
      req.cookies?.session_id ?? (req.headers['x-session-id'] as string);
    return { userId, sessionId };
  }

  @Get()
  async getCart(@Req() req: Request) {
    const { userId, sessionId } = this.extractIdentifiers(req);
    return this.cartService.getCart(userId, sessionId);
  }

  @Post('items')
  async addItem(@Body() dto: AddCartItemDto, @Req() req: Request) {
    const { userId, sessionId } = this.extractIdentifiers(req);
    return this.cartService.addItem(dto, userId, sessionId);
  }

  @Patch('items/:id')
  async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
    @Req() req: Request,
  ) {
    const { userId, sessionId } = this.extractIdentifiers(req);
    return this.cartService.updateItem(id, dto, userId, sessionId);
  }

  @Delete('items/:id')
  async removeItem(@Param('id') id: string, @Req() req: Request) {
    const { userId, sessionId } = this.extractIdentifiers(req);
    return this.cartService.removeItem(id, userId, sessionId);
  }

  @Delete()
  async clearCart(@Req() req: Request) {
    const { userId, sessionId } = this.extractIdentifiers(req);
    return this.cartService.clearCart(userId, sessionId);
  }
}
