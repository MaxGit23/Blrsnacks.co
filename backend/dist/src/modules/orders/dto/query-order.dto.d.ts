import { OrderStatus } from '@prisma/client';
export declare class QueryOrderDto {
    status?: OrderStatus;
    userId?: string;
    page?: number;
    limit?: number;
}
