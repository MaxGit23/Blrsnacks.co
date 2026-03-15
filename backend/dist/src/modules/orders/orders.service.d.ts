import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, QueryOrderDto } from './dto';
import { Prisma } from '@prisma/client';
export declare class OrdersService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    placeOrder(dto: CreateOrderDto, userId: string): Promise<any>;
    getOrderById(id: string, userId?: string, tx?: any): Promise<any>;
    getUserOrders(userId: string, query: QueryOrderDto): Promise<{
        data: ({
            address: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                street: string;
                city: string;
                state: string;
                zip: string;
                country: string;
                isDefault: boolean;
            };
            items: ({
                product: {
                    name: string;
                    id: string;
                    slug: string;
                    images: Prisma.JsonValue;
                };
            } & {
                id: string;
                createdAt: Date;
                productId: string;
                quantity: number;
                priceAtPurchase: Prisma.Decimal;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            addressId: string;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: Prisma.Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAllOrders(query: QueryOrderDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
            };
            address: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                street: string;
                city: string;
                state: string;
                zip: string;
                country: string;
                isDefault: boolean;
            };
            items: ({
                product: {
                    name: string;
                    id: string;
                    slug: string;
                };
            } & {
                id: string;
                createdAt: Date;
                productId: string;
                quantity: number;
                priceAtPurchase: Prisma.Decimal;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            addressId: string;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: Prisma.Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateStatus(orderId: string, dto: UpdateOrderStatusDto, adminId: string): Promise<any>;
    cancelOrder(orderId: string, userId: string): Promise<any>;
}
