import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns aggregate stats used by the admin dashboard.
   * Demonstrates Prisma aggregate queries for admin-only data.
   */
  async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      pendingOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
    ]);

    this.logger.log('Dashboard stats computed');

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult._sum.totalAmount ?? 0,
      pendingOrders,
    };
  }
}
