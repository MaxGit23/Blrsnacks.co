import api from '../api-client';
import type { ApiResponse } from '../api-client';

export interface AdminUser {
    id: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
    createdAt: string;
    _count?: { orders: number };
}

export interface UserQuery {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
}

export const usersApi = {
    getAll: (query?: UserQuery) =>
        api.get<ApiResponse<AdminUser[]>>('/users', query as Record<string, string | number>),
};
