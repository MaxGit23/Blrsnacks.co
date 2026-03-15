'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import { cartApi, type Cart, type CartItem } from '@/lib/api';

interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    itemCount: number;
    total: number;
}

interface CartContextValue extends CartState {
    refreshCart: () => Promise<void>;
    addItem: (productId: string, quantity?: number) => Promise<void>;
    updateItemQty: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    getItemByProductId: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextValue | null>(null);

function calcTotal(items: CartItem[]): number {
    return items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<CartState>({
        cart: null,
        isLoading: true,
        itemCount: 0,
        total: 0,
    });

    const refreshCart = useCallback(async () => {
        try {
            const cart = await cartApi.get();
            setState({
                cart,
                isLoading: false,
                itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
                total: calcTotal(cart.items),
            });
        } catch {
            setState({ cart: null, isLoading: false, itemCount: 0, total: 0 });
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addItem = useCallback(
        async (productId: string, quantity = 1) => {
            await cartApi.addItem(productId, quantity);
            await refreshCart();
        },
        [refreshCart],
    );

    const updateItemQty = useCallback(
        async (itemId: string, quantity: number) => {
            if (quantity <= 0) {
                await cartApi.removeItem(itemId);
            } else {
                await cartApi.updateItem(itemId, quantity);
            }
            await refreshCart();
        },
        [refreshCart],
    );

    const removeItem = useCallback(
        async (itemId: string) => {
            await cartApi.removeItem(itemId);
            await refreshCart();
        },
        [refreshCart],
    );

    const clearCart = useCallback(async () => {
        await cartApi.clear();
        setState({ cart: null, isLoading: false, itemCount: 0, total: 0 });
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
