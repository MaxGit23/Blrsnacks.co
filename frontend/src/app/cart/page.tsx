'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cartApi, type Cart } from '@/lib/api';
import { Button, Skeleton, Card } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/auth-context';

export default function CartPage() {
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const loadCart = useCallback(async () => {
        try {
            const data = await cartApi.get();
            setCart(data);
        } catch {
            setCart(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const updateQuantity = async (itemId: string, quantity: number) => {
        setUpdatingId(itemId);
        try {
            const updated = await cartApi.updateItem(itemId, quantity);
            setCart(updated);
        } catch {
            addToast('Failed to update quantity', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const removeItem = async (itemId: string) => {
        setUpdatingId(itemId);
        try {
            const updated = await cartApi.removeItem(itemId);
            setCart(updated);
            addToast('Item removed from cart', 'info');
        } catch {
            addToast('Failed to remove item', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const clearCart = async () => {
        try {
            await cartApi.clear();
            setCart(null);
            addToast('Cart cleared', 'info');
        } catch {
            addToast('Failed to clear cart', 'error');
        }
    };

    const subtotal = cart?.items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
    ) ?? 0;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-[var(--radius-lg)]" />
                    ))}
                </div>
            </div>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-brand-secondary mb-8">Your Cart</h1>

            {isEmpty ? (
                <div className="text-center py-20">
                    <span className="text-6xl mb-6 block">🛒</span>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">Your cart is empty</h2>
                    <p className="text-text-secondary mb-8">Add some delicious snacks to get started!</p>
                    <Link href="/products">
                        <Button variant="primary" size="lg">Browse Snacks</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <Card key={item.id} padding="none" className="overflow-hidden">
                                <div className={`flex gap-4 p-4 ${updatingId === item.id ? 'opacity-50' : ''} transition-opacity`}>
                                    {/* Thumbnail */}
                                    <div className="w-20 h-20 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden">
                                        {item.product.images.length > 0 ? (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">📦</div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/products/${item.product.slug}`} className="text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors line-clamp-1">
                                            {item.product.name}
                                        </Link>
                                        <div className="text-sm font-bold text-brand-primary mt-1">₹{Number(item.product.price).toFixed(0)}</div>

                                        {/* Quantity controls */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border border-border-default rounded-[var(--radius-md)]">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    disabled={item.quantity <= 1 || updatingId === item.id}
                                                    className="px-2 py-1 text-xs text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="px-3 py-1 text-xs font-semibold border-x border-border-default text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updatingId === item.id}
                                                    className="px-2 py-1 text-xs text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={updatingId === item.id}
                                                className="text-xs text-error hover:text-error/80 transition-colors disabled:opacity-40"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Line total */}
                                    <div className="text-right shrink-0">
                                        <span className="text-sm font-bold text-text-primary">
                                            ₹{(Number(item.product.price) * item.quantity).toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-sm text-text-tertiary hover:text-error transition-colors"
                        >
                            Clear entire cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Subtotal ({cart.items.length} items)</span>
                                    <span className="font-medium text-text-primary">₹{subtotal.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Delivery</span>
                                    <span className="font-medium text-success">{subtotal >= 500 ? 'Free' : '₹50'}</span>
                                </div>
                                <div className="border-t border-border-light pt-3 flex justify-between">
                                    <span className="font-semibold text-text-primary">Total</span>
                                    <span className="text-xl font-bold text-brand-primary">
                                        ₹{(subtotal + (subtotal >= 500 ? 0 : 50)).toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            {subtotal < 500 && (
                                <div className="mt-4 px-3 py-2 bg-info-light text-info text-xs rounded-[var(--radius-md)]">
                                    Add ₹{(500 - subtotal).toFixed(0)} more for free delivery!
                                </div>
                            )}

                            <div className="mt-6">
                                {isAuthenticated ? (
                                    <Link href="/checkout">
                                        <Button variant="primary" fullWidth size="lg">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/login?redirect=/cart">
                                        <Button variant="primary" fullWidth size="lg">
                                            Login to Checkout
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <div className="mt-4 text-center">
                                <span className="text-xs text-text-tertiary">💰 Cash on Delivery available</span>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
