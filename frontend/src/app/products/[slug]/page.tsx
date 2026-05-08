'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi, type Product } from '@/lib/api';
import { Button, Badge, Skeleton } from '@/components/ui';
import { Container } from '@/components/layout';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/format';
import { getImageUrl } from '@/lib/images';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const { addItem } = useCart();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await productsApi.getBySlug(slug);
                setProduct(data);
            } catch {
                router.push('/products');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [slug, router]);

    const availableStock = 999; // Override to ALWAYS show in stock

    const handleAddToCart = async () => {
        if (!product) return;
        setAddingToCart(true);
        try {
            await addItem(product.id, quantity);
            addToast(`${product.name} added to your cart!`, 'success');
        } catch {
            addToast('Could not add to cart — please try again', 'error');
        } finally {
            setAddingToCart(false);
        }
    };

    if (isLoading) {
        return (
            <Container className="py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="h-[450px] rounded-[var(--radius-xl)]" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-10 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-12 w-40 mt-6" />
                    </div>
                </div>
            </Container>
        );
    }

    if (!product) return null;

    return (
        <Container className="py-8 animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-8" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
                <span aria-hidden>/</span>
                <Link href="/products" className="hover:text-brand-primary transition-colors">Snacks</Link>
                <span aria-hidden>/</span>
                <span className="text-text-primary font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* ─── Images ───────────────────────────────────────────────── */}
                <div>
                    <div className="relative aspect-square bg-bg-secondary rounded-[var(--radius-xl)] overflow-hidden mb-4">
                        {product.images.length > 0 ? (
                            <img
                                src={getImageUrl(product.images[selectedImage])}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                id="product-main-image"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <img src="/placeholder-product.svg" alt={product.name} className="w-32 h-32 opacity-40" />
                            </div>
                        )}
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    id={`product-thumb-${i}`}
                                    className={`shrink-0 w-20 h-20 rounded-[var(--radius-md)] overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-brand-primary shadow-md' : 'border-border-light hover:border-border-dark'}`}
                                >
                                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── Product Info ──────────────────────────────────────────── */}
                <div>
                    {product.category && (
                        <Link
                            href={`/products?category=${product.category.slug}`}
                            className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                        >
                            {product.category.name}
                        </Link>
                    )}
                    <h1 className="text-3xl md:text-4xl font-bold text-brand-secondary mt-2">{product.name}</h1>

                    <div className="flex items-center gap-3 mt-4">
                        <span className="text-3xl font-bold text-brand-primary" id="product-price">
                            {formatPrice(Number(product.price))}
                        </span>
                        {availableStock > 0 ? (
                            <Badge variant="success">In Stock</Badge>
                        ) : (
                            <Badge variant="error">Sold Out</Badge>
                        )}
                    </div>

                    <p className="mt-6 text-text-secondary leading-relaxed">{product.description}</p>

                    {/* Quantity + Add to Cart */}
                    {availableStock > 0 && (
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <label htmlFor="qty" className="text-sm font-medium text-text-primary">Quantity:</label>
                                <div className="flex items-center border border-border-default rounded-[var(--radius-md)]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors rounded-l-[var(--radius-md)]"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <span id="qty" className="px-4 py-2 text-sm font-semibold border-x border-border-default min-w-[48px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                                        className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors rounded-r-[var(--radius-md)]"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-xs text-text-tertiary">{availableStock} available</span>
                            </div>

                            <Button
                                id="add-to-cart-btn"
                                size="lg"
                                fullWidth
                                isLoading={addingToCart}
                                onClick={handleAddToCart}
                            >
                                Add to Cart — {formatPrice(Number(product.price) * quantity)}
                            </Button>
                        </div>
                    )}

                    {/* Delivery info */}
                    <div className="mt-10 border-t border-stone-200 pt-6 space-y-3">
                        {[
                            { iconPath: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12', text: 'Free delivery on orders above ₹500' },
                            { iconPath: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75-.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', text: 'Cash on Delivery — no prepayment needed' },
                            { iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', text: 'Same-day delivery across Bangalore' },
                            { iconPath: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z', text: 'Freshly prepared, zero preservatives' },
                        ].map((info) => (
                            <div key={info.text} className="flex items-center gap-3 text-sm text-stone-600">
                                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={info.iconPath} /></svg>
                                <span>{info.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
}
