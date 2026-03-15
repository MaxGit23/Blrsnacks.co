import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) { }

    // ─── Protected: Get current user profile ─────────────────────────────────

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@CurrentUser() user: JwtPayload) {
        this.logger.log(`Profile requested by user: ${user.sub}`);
        return this.usersService.getProfile(user.sub);
    }

    // ─── Admin Only: List all users ──────────────────────────────────────────

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async findAll() {
        this.logger.log('Admin requested all users');
        return this.usersService.findAll();
    }
}
