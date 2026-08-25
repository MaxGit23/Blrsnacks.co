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
