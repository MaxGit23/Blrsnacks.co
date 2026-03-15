import api from '../api-client';

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    priceAtAdd: number;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string[];
    };
}

export interface Cart {
    id: string;
    userId: string | null;
    sessionId: string | null;
    items: CartItem[];
}

export const cartApi = {
    get: () =>
        api.get<Cart>('/cart'),

    addItem: (productId: string, quantity: number) =>
        api.post<Cart>('/cart/items', { productId, quantity }),

    updateItem: (itemId: string, quantity: number) =>
        api.patch<Cart>(`/cart/items/${itemId}`, { quantity }),

    removeItem: (itemId: string) =>
        api.delete<Cart>(`/cart/items/${itemId}`),

    clear: () =>
        api.delete<{ message: string }>('/cart'),
};
