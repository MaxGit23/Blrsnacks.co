import api from '../api-client';
import type { ApiResponse } from '../api-client';

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    priceAtPurchase: number;
    product: { id: string; name: string; slug: string; images: string[] };
}

export interface OrderStatusHistory {
    id: string;
    status: string;
    notes: string | null;
    createdBy: string | null;
    createdAt: string;
}

export interface Order {
    id: string;
    userId: string;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentMethod: 'COD';
    totalAmount: number;
    items: OrderItem[];
    statusHistory: OrderStatusHistory[];
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    user?: { id: string; email: string };
    createdAt: string;
}

export interface OrderQuery {
    status?: string;
    page?: number;
    limit?: number;
}

export const ordersApi = {
    // Customer
    place: (addressId: string, paymentMethod: string = 'COD') =>
        api.post<Order>('/orders', { addressId, paymentMethod }),

    getMyOrders: (query?: OrderQuery) =>
        api.get<ApiResponse<Order[]>>('/orders/me', query as Record<string, string | number>),

    getMyOrder: (id: string) =>
        api.get<Order>(`/orders/me/${id}`),

    cancelOrder: (id: string) =>
        api.post<Order>(`/orders/me/${id}/cancel`),

    // Admin
    getAll: (query?: OrderQuery) =>
        api.get<ApiResponse<Order[]>>('/orders', query as Record<string, string | number>),

    getById: (id: string) =>
        api.get<Order>(`/orders/${id}`),

    updateStatus: (id: string, status: string, notes?: string) =>
        api.put<Order>(`/orders/${id}/status`, { status, notes }),
};
