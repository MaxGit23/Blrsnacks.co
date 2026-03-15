import type { JwtPayload } from '../../common/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    private readonly logger;
    constructor(adminService: AdminService);
    getDashboardStats(user: JwtPayload): Promise<{
        totalUsers: number;
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        pendingOrders: number;
    }>;
}
