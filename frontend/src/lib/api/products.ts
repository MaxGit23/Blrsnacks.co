import api from '../api-client';
import type { ApiResponse } from '../api-client';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    isPublished: boolean;
    category: { id: string; name: string; slug: string };
    inventory?: { stock: number; reservedStock: number };
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    children?: { id: string; name: string; slug: string }[];
    _count?: { products: number };
}

export interface ProductQuery {
    search?: string;
    categoryId?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export const productsApi = {
    getAll: (query?: ProductQuery) =>
        api.get<ApiResponse<Product[]>>('/products', query as Record<string, string | number>),

    getBySlug: (slug: string) =>
        api.get<Product>(`/products/${slug}`),

    // Admin
    getAllAdmin: (query?: ProductQuery) =>
        api.get<ApiResponse<Product[]>>('/products/admin/all', query as Record<string, string | number>),
    create: (data: FormData | Record<string, unknown>) =>
        api.post<Product>('/products', data),

    update: (id: string, data: Record<string, unknown>) =>
        api.put<Product>(`/products/${id}`, data),

    delete: (id: string) =>
        api.delete(`/products/${id}`),

    uploadImages: (productId: string, formData: FormData) =>
        api.post<Product>(`/products/${productId}/images`, formData),

    updateImages: (productId: string, images: string[]) =>
        api.put<Product>(`/products/${productId}/images`, { images }),

    deleteImage: (productId: string, imageUrl: string) =>
        api.delete<Product>(`/products/${productId}/images`, { imageUrl }),
};

export const categoriesApi = {
    getAll: () =>
        api.get<Category[]>('/categories'),

    getBySlug: (slug: string) =>
        api.get<Category>(`/categories/${slug}`),

    create: (data: Record<string, unknown>) =>
        api.post<Category>('/categories', data),

    update: (id: string, data: Record<string, unknown>) =>
        api.put<Category>(`/categories/${id}`, data),

    delete: (id: string) =>
        api.delete(`/categories/${id}`),
};
