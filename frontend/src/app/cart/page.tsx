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
            <Container size="md" className="py-8">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-[var(--radius-lg)]" />
                    ))}
                </div>
            </Container>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <Container size="md" className="py-8 animate-fade-in">
            <PageHeader title="Your Cart" description={isEmpty ? undefined : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`} />

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
                            <Card key={item.id} padding="none" className="overflow-hidden">
                                <div className="flex gap-4 p-4 transition-opacity">
                                    {/* Thumbnail */}
                                    <div className="w-20 h-20 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden">
                                        {item.product.images.length > 0 ? (
                                            <img
                                                src={getImageUrl(item.product.images[0])}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <img src="/placeholder-product.svg" alt="" className="w-10 h-10 opacity-40" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors line-clamp-1"
                                        >
                                            {item.product.name}
                                        </Link>
                                        <div className="text-sm font-bold text-brand-primary mt-1">
                                            {formatPrice(Number(item.product.price))}
                                        </div>

                                        {/* Quantity controls */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border border-border-default rounded-[var(--radius-md)]">
                                                <button
                                                    onClick={() => handleUpdate(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="px-2 py-1 text-xs text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="px-3 py-1 text-xs font-semibold border-x border-border-default text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdate(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-xs text-error hover:text-error/80 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Line total */}
                                    <div className="text-right shrink-0">
                                        <span className="text-sm font-bold text-text-primary">
                                            {formatPrice(Number(item.product.price) * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <button
                            onClick={handleClear}
                            id="clear-cart-btn"
                            className="text-sm text-text-tertiary hover:text-error transition-colors"
                        >
                            Remove all items
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span className="font-medium text-text-primary">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Delivery</span>
                                    <span className={`font-medium ${deliveryFee === 0 ? 'text-success' : 'text-text-primary'}`}>
                                        {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                                    </span>
                                </div>
                                <div className="border-t border-border-light pt-3 flex justify-between">
                                    <span className="font-semibold text-text-primary">Total</span>
                                    <span className="text-xl font-bold text-brand-primary" id="cart-total">
                                        {formatPrice(grandTotal)}
                                    </span>
                                </div>
                            </div>

                            {total < 500 && (
                                <div className="mt-4 px-3 py-2 bg-info-light text-info text-xs rounded-[var(--radius-md)]">
                                    Add {formatPrice(500 - total)} more for free delivery!
                                </div>
                            )}

                            <div className="mt-6">
                                {isAuthenticated ? (
                                    <Link href="/checkout">
                                        <Button id="checkout-btn" variant="primary" fullWidth size="lg">
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

                            <div className="mt-4 text-center">
                                <span className="text-xs text-text-tertiary">💰 Cash on Delivery available</span>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </Container>
    );
}
