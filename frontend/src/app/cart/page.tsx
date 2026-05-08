'use client';

import Link from 'next/link';
import { Button, Skeleton, Card, EmptyState } from '@/components/ui';
import { Container, PageHeader } from '@/components/layout';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/format';
import { getImageUrl } from '@/lib/images';

export default function CartPage() {
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const {
        cart,
        isLoading,
        itemCount,
        total,
        updateItemQty,
        removeItem,
        clearCart,
    } = useCart();

    const handleUpdate = async (itemId: string, qty: number) => {
        try {
            await updateItemQty(itemId, qty);
        } catch {
            addToast('Could not update quantity', 'error');
        }
    };

    const handleRemove = async (itemId: string) => {
        try {
            await removeItem(itemId);
            addToast('Item removed from cart', 'info');
        } catch {
            addToast('Could not remove item', 'error');
        }
    };

    const handleClear = async () => {
        try {
            await clearCart();
            addToast('Cart cleared', 'info');
        } catch {
            addToast('Could not clear cart', 'error');
        }
    };

    const deliveryFee = total >= 500 ? 0 : 50;
    const grandTotal = total + deliveryFee;

    if (isLoading) {
        return (
            <Container className="py-8 lg:py-12">
                <Skeleton className="h-8 w-32 mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                    ))}
                </div>
            </Container>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <Container className="py-8 lg:py-12 animate-fade-in">
            <PageHeader 
                title="Your Cart" 
                description={isEmpty ? undefined : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`}
            />

            {isEmpty ? (
                <EmptyState
                    icon="🛒"
                    title="Your cart is empty"
                    description="Looks like you haven't added any snacks yet. Browse our collection and add your favourites!"
                    actionLabel="Browse Snacks"
                    actionHref="/products"
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart!.items.map((item) => (
                            <Card key={item.id} padding="none" className="overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="flex gap-4 p-4">
                                    {/* Thumbnail */}
                                    <Link href={`/products/${item.product.slug}`} className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                                        {item.product.images.length > 0 ? (
                                            <img
                                                src={getImageUrl(item.product.images[0])}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-3xl">🍌</span>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="text-base font-semibold text-stone-900 hover:text-red-600 transition-colors line-clamp-1"
                                        >
                                            {item.product.name}
                                        </Link>
                                        <div className="text-lg font-bold text-red-600 mt-1">
                                            {formatPrice(Number(item.product.price))}
                                        </div>

                                        {/* Quantity controls */}
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => handleUpdate(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="w-12 py-2 text-sm font-semibold text-center border-x border-slate-200">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdate(item.id, item.quantity + 1)}
                                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0-15h-15" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Line total */}
                                    <div className="text-right shrink-0">
                                        <span className="text-base font-bold text-slate-900">
                                            {formatPrice(Number(item.product.price) * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <button
                            onClick={handleClear}
                            className="text-sm text-slate-500 hover:text-red-600 transition-colors"
                        >
                            Remove all items
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24" padding="lg">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span className="font-medium text-slate-900">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery</span>
                                    <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                                        {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                                    </span>
                                </div>
                                {deliveryFee === 0 && (
                                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Free delivery applied!
                                    </div>
                                )}
                                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                                    <span className="font-semibold text-slate-900">Total</span>
                                    <span className="text-2xl font-bold text-red-600" id="cart-total">
                                        {formatPrice(grandTotal)}
                                    </span>
                                </div>
                            </div>

                            {total < 500 && (
                                <div className="mt-4 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2">
                                    <span>🎁</span>
                                    Add {formatPrice(500 - total)} more for free delivery!
                                </div>
                            )}

                            <div className="mt-6">
                                {isAuthenticated ? (
                                    <Link href="/checkout">
                                        <Button id="checkout-btn" variant="primary" fullWidth size="lg" rightIcon={
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        }>
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/login?redirect=/cart">
                                        <Button id="login-checkout-btn" variant="primary" fullWidth size="lg">
                                            Login to Checkout
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00.75.75v.75m0 0H3.75m0 0h-.375c-.621 0-1.125.504-1.125 1.125v5.25c0 .621.504 1.125 1.125 1.125h.375m-1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0v-.375c0-.414.336-.75.75-.75h.75" />
                                </svg>
                                Cash on Delivery available
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </Container>
    );
}