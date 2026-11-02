'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/format';
import { getImageUrl } from '@/lib/images';
import { DEMO_PRODUCTS } from '@/lib/mock-products';

const FREE_SHIPPING_THRESHOLD = 750;

export function CartDrawer() {
    const {
        cart,
        isCartOpen,
        closeCart,
        updateItemQty,
        removeItem,
        total,
        itemCount,
        addItem,
    } = useCart();

    const drawerRef = useRef<HTMLDivElement>(null);

    // Escape key listener to close drawer
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && isCartOpen) {
                closeCart();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCartOpen, closeCart]);

    // Prevent body scrolling when open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
    const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

    // Suggest 2 items that are not already in the cart
    const cartProductIds = new Set(cart?.items.map((i) => i.productId) || []);
    const upsellItems = DEMO_PRODUCTS.filter((p) => !cartProductIds.has(p.id)).slice(0, 2);

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isCartOpen}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={closeCart}
            />

            {/* Sliding Panel */}
            <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Your Artisanal Cart"
                className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isCartOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                                Your Tasting Vault
                            </h2>
                            {itemCount > 0 && (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-stone-700 bg-stone-200 rounded-full">
                                    {itemCount} {itemCount === 1 ? 'pack' : 'packs'}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                            Fresh batches dispatched direct from Bangalore
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={closeCart}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 transition-colors active:scale-95"
                        aria-label="Close cart drawer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Free Shipping AOV Progress Bar */}
                <div className="px-4 py-3 bg-amber-50/60 border-b border-amber-200/60">
                    <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                        {amountNeeded > 0 ? (
                            <span className="text-stone-800">
                                Add {/* PRICE HIDDEN <strong className="text-red-700 font-bold">{formatPrice(amountNeeded)}</strong> */} more for <span className="font-semibold text-stone-900">Free Express Shipping</span>
                            </span>
                        ) : (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <span>🎉</span> Free Express Shipping Unlocked!
                            </span>
                        )}
                        <span className="text-[11px] font-semibold text-stone-500">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                        <div
                            className={`h-full transition-[width] duration-300 ease-out ${
                                amountNeeded === 0 ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Body / Items list */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    {!cart || cart.items.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-2xl">
                                🥨
                            </div>
                            <h3 className="text-base font-bold text-stone-900 font-display">
                                Your Vault is Currently Empty
                            </h3>
                            <p className="text-xs text-stone-600 mt-2 max-w-xs mx-auto leading-relaxed">
                                Our wood-fired brass kadai batches are sizzling. Explore the collection to build your handcrafted tasting box.
                            </p>
                            <button
                                type="button"
                                onClick={closeCart}
                                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors active:scale-95 shadow-sm"
                            >
                                Explore The Collection
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3.5">
                            {cart.items.map((item) => {
                                const itemPrice = item.priceAtAdd || item.product.price;
                                const itemTotal = itemPrice * item.quantity;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex gap-3.5 p-3 rounded-xl border border-stone-200/80 bg-stone-50/40 hover:bg-stone-50 transition-colors"
                                    >
                                        <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-stone-200">
                                            {item.product.images.length > 0 ? (
                                                <img
                                                    src={getImageUrl(item.product.images[0])}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                                                    BLR
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-xs font-semibold text-stone-900 truncate font-display">
                                                        {item.product.name}
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-stone-400 hover:text-red-700 transition-colors p-0.5"
                                                        aria-label={`Remove ${item.product.name}`}
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {item.variantLabel && (
                                                    <span className="inline-block mt-0.5 text-[11px] font-medium text-stone-500">
                                                        Pack: {item.variantLabel}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/50">
                                                {/* Quantity Pill */}
                                                <div className="inline-flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateItemQty(item.id, item.quantity - 1)}
                                                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 transition-colors text-xs active:scale-95"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-2 text-xs font-bold text-stone-900 min-w-5 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateItemQty(item.id, item.quantity + 1)}
                                                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 transition-colors text-xs active:scale-95"
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* PRICE HIDDEN
                                                <span className="text-xs font-bold text-stone-900 font-display">
                                                    {formatPrice(itemTotal)}
                                                </span>
                                                */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* "Complete The Tasting" 1-Click Upsell */}
                    {cart && cart.items.length > 0 && upsellItems.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-stone-200">
                            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block mb-2.5">
                                Complete The Tasting
                            </span>
                            <div className="space-y-2">
                                {upsellItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-dashed border-stone-300 bg-white"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                                                <img
                                                    src={getImageUrl(item.images[0])}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-xs font-semibold text-stone-900 truncate">
                                                    {item.name}
                                                </p>
                                                {/* PRICE HIDDEN
                                                <p className="text-[11px] text-stone-500 font-medium">
                                                    {formatPrice(item.price)}
                                                </p>
                                                */}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => addItem(item.id, 1, item.variants?.[0])}
                                            className="px-3 py-1 text-xs font-bold rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-700 hover:text-white transition-[background-color,color] duration-150 active:scale-95 shrink-0"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Checkout */}
                {cart && cart.items.length > 0 && (
                    <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-stone-600 font-medium">Subtotal</span>
                            {/* PRICE HIDDEN
                            <span className="text-base font-extrabold text-stone-900 font-display">
                                {formatPrice(total)}
                            </span>
                            */}
                        </div>

                        <div className="flex items-center justify-between text-xs text-stone-500">
                            <span>Express Shipping</span>
                            <span>{amountNeeded === 0 ? 'FREE' : 'Calculated at checkout'}</span>
                        </div>

                        <Link
                            href="/cart"
                            onClick={closeCart}
                            className="w-full py-3 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-center text-sm shadow-md transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            <span>Proceed to Fresh Checkout</span>
                            <span>→</span>
                        </Link>

                        {/* Reassurance Micro-Copy */}
                        <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-stone-500">
                            <span>🛡️ 30-Day Crisp Guarantee</span>
                            <span>•</span>
                            <span>💵 Cash on Delivery</span>
                            <span>•</span>
                            <span>⚡ Same-Day BLR</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
