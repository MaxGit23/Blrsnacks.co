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

    const availableStock = product?.inventory
        ? product.inventory.stock - product.inventory.reservedStock
        : 0;

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
                    <div className="mt-10 border-t border-border-light pt-6 space-y-3">
                        {[
                            { icon: '🚚', text: 'Free delivery on orders above ₹500' },
                            { icon: '💰', text: 'Cash on Delivery — no prepayment needed' },
                            { icon: '⚡', text: 'Same-day delivery across Bangalore' },
                            { icon: '🌿', text: 'Freshly prepared, zero preservatives' },
                        ].map((info) => (
                            <div key={info.text} className="flex items-center gap-3 text-sm text-text-secondary">
                                <span>{info.icon}</span>
                                <span>{info.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
}
