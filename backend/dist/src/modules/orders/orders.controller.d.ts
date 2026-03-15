import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, QueryOrderDto } from './dto';
import type { JwtPayload } from '../../common/guards/jwt-auth.guard';
export declare class OrdersController {
    private readonly ordersService;
    private readonly logger;
    constructor(ordersService: OrdersService);
    placeOrder(dto: CreateOrderDto, user: JwtPayload): Promise<any>;
    getMyOrders(query: QueryOrderDto, user: JwtPayload): Promise<{
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
                    images: import("@prisma/client/runtime/library").JsonValue;
                };
            } & {
                id: string;
                createdAt: Date;
                productId: string;
                quantity: number;
                priceAtPurchase: import("@prisma/client/runtime/library").Decimal;
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
            totalAmount: import("@prisma/client/runtime/library").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyOrder(id: string, user: JwtPayload): Promise<any>;
    cancelMyOrder(id: string, user: JwtPayload): Promise<any>;
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
                priceAtPurchase: import("@prisma/client/runtime/library").Decimal;
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
            totalAmount: import("@prisma/client/runtime/library").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOrder(id: string): Promise<any>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, user: JwtPayload): Promise<any>;
}
