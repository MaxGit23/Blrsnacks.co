import api from '../api-client';

export interface InventoryRecord {
    id: string;
    productId: string;
    stock: number;
    reservedStock: number;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string[];
    };
}

export const inventoryApi = {
    getByProductId: (productId: string) =>
        api.get<InventoryRecord>(`/inventory/${productId}`),

    updateStock: (productId: string, stock: number) =>
        api.put<InventoryRecord>(`/inventory/${productId}`, { stock }),

    getLowStock: (threshold: number = 10) =>
        api.get<InventoryRecord[]>('/inventory/low-stock', { threshold }),
};
