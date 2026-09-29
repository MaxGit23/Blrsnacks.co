'use client';

// STATIC SITE MODE — the cart is persisted in localStorage instead of a
// backend. The public interface matches the original CartContextValue so UI
// code is unaffected.

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import type { Cart, CartItem } from '@/lib/api';
import { DEMO_PRODUCTS, type ProductVariant } from '@/lib/mock-products';

interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    itemCount: number;
    total: number;
    isCartOpen: boolean;
}

interface CartContextValue extends CartState {
    refreshCart: () => Promise<void>;
    addItem: (productId: string, quantity?: number, variant?: ProductVariant) => Promise<void>;
    updateItemQty: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    getItemByProductId: (productId: string) => CartItem | undefined;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'blrsnacks.demo-cart.v1';

function calcTotal(items: CartItem[]): number {
    return items.reduce(
        (sum, item) => sum + (item.priceAtAdd || item.product.price) * item.quantity,
        0,
    );
}

function emptyCart(): Cart {
    return {
        id: 'demo-cart',
        userId: null,
        sessionId: null,
        items: [],
    };
}

function loadLocalCart(): Cart {
    if (typeof window === 'undefined') return emptyCart();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyCart();
        const parsed = JSON.parse(raw) as Cart;
        if (!Array.isArray(parsed.items)) return emptyCart();
        return parsed;
    } catch {
        return emptyCart();
    }
}

function saveLocalCart(cart: Cart): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<CartState>({
        cart: null,
        isLoading: true,
        itemCount: 0,
        total: 0,
        isCartOpen: false,
    });

    const refreshCart = useCallback(async () => {
        const cart = loadLocalCart();
        setState((prev) => ({
            ...prev,
            cart,
            isLoading: false,
            itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
            total: calcTotal(cart.items),
        }));
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const openCart = useCallback(() => {
        setState((prev) => ({ ...prev, isCartOpen: true }));
    }, []);

    const closeCart = useCallback(() => {
        setState((prev) => ({ ...prev, isCartOpen: false }));
    }, []);

    const toggleCart = useCallback(() => {
        setState((prev) => ({ ...prev, isCartOpen: !prev.isCartOpen }));
    }, []);

    const addItem = useCallback(
        async (productId: string, quantity = 1, variant?: ProductVariant) => {
            const cart = loadLocalCart();
            const itemId = variant
                ? `demo-item-${productId}-${variant.id}`
                : `demo-item-${productId}`;

            const existing = cart.items.find((i) => i.id === itemId);

            if (existing) {
                existing.quantity += quantity;
            } else {
                const demo = DEMO_PRODUCTS.find((p) => p.id === productId);
                const price = variant ? variant.price : (demo?.price ?? 0);
                cart.items.push({
                    id: itemId,
                    productId,
                    variantId: variant?.id,
                    variantLabel: variant?.label,
                    quantity,
                    priceAtAdd: price,
                    product: {
                        id: productId,
                        name: demo?.name ?? 'Product',
                        slug: demo?.slug ?? '',
                        price,
                        images: demo?.images ?? [],
                    },
                });
            }

            saveLocalCart(cart);
            await refreshCart();
            openCart();
        },
        [refreshCart, openCart],
    );

    const updateItemQty = useCallback(
        async (itemId: string, quantity: number) => {
            const cart = loadLocalCart();
            if (quantity <= 0) {
                cart.items = cart.items.filter((i) => i.id !== itemId);
            } else {
                const item = cart.items.find((i) => i.id === itemId);
                if (item) item.quantity = quantity;
            }
            saveLocalCart(cart);
            await refreshCart();
        },
        [refreshCart],
    );

    const removeItem = useCallback(
        async (itemId: string) => {
            const cart = loadLocalCart();
            cart.items = cart.items.filter((i) => i.id !== itemId);
            saveLocalCart(cart);
            await refreshCart();
        },
        [refreshCart],
    );

    const clearCart = useCallback(async () => {
        saveLocalCart(emptyCart());
        setState((prev) => ({
            ...prev,
            cart: emptyCart(),
            isLoading: false,
            itemCount: 0,
            total: 0,
        }));
    }, []);

    const getItemByProductId = useCallback(
        (productId: string) =>
            state.cart?.items.find((i) => i.productId === productId),
        [state.cart],
    );

    return (
        <CartContext.Provider
            value={{
                ...state,
                refreshCart,
                addItem,
                updateItemQty,
                removeItem,
                clearCart,
                getItemByProductId,
                openCart,
                closeCart,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
