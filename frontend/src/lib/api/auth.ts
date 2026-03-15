import api from '../api-client';

export interface User {
    id: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
    createdAt: string;
}

export interface AuthResponse {
    statusCode: number;
    message: string;
}

export const authApi = {
    register: (email: string, password: string) =>
        api.post<AuthResponse>('/auth/register', { email, password }),

    login: (email: string, password: string) =>
        api.post<AuthResponse>('/auth/login', { email, password }),

    googleAuth: (idToken: string) =>
        api.post<AuthResponse>('/auth/google', { idToken }),

    refresh: () =>
        api.post<AuthResponse>('/auth/refresh'),

    logout: () =>
        api.post<AuthResponse>('/auth/logout'),

    logoutAll: () =>
        api.post<AuthResponse>('/auth/logout-all'),

    getProfile: () =>
        api.get<User>('/users/me'),
};
