import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

/**
 * Example admin-only controller.
 * All routes require JWT auth + ADMIN role.
 *
 * Usage pattern for any admin-protected endpoint:
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Roles(Role.ADMIN)
 */
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  /**
   * GET /api/v1/admin/stats
   * Returns dashboard summary stats. Demonstrates a fully protected admin route.
   */
  @Get('stats')
  async getDashboardStats(@CurrentUser() user: JwtPayload) {
    this.logger.log(`Admin ${user.email} requested dashboard stats`);
    return this.adminService.getDashboardStats();
  }
}
