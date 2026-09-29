'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi, type Product } from '@/lib/api';
import {
    DEMO_PRODUCTS,
    findDemoProductBySlug,
    getProductArtisanDetails,
    type DemoProduct,
    type ProductVariant,
} from '@/lib/mock-products';
import { Skeleton } from '@/components/ui';
import { Container } from '@/components/layout';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { EfficacyBadges } from '@/components/products/EfficacyBadges';
import { SpiceLevelIndicator } from '@/components/products/SpiceLevelIndicator';
import { CrispnessGuideModal } from '@/components/modals/CrispnessGuideModal';
import { formatPrice } from '@/lib/format';
import { getImageUrl } from '@/lib/images';
import { useCart } from '@/context/cart-context';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isDemo, setIsDemo] = useState(false);
    const [variantIdx, setVariantIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showIngredients, setShowIngredients] = useState(true);
    const [guideOpen, setGuideOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setIsDemo(false);
            setVariantIdx(0);
            setQuantity(1);
            setSelectedImage(0);
            try {
                const data = await productsApi.getBySlug(slug);
                setProduct(data);
            } catch {
                // Backend offline — fall back to the demo catalogue
                const demo = findDemoProductBySlug(slug);
                if (demo) {
                    setProduct(demo);
                    setIsDemo(true);
                } else {
                    router.push('/products');
                }
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [slug, router]);

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

    const artisan = getProductArtisanDetails(product);
    const variants: ProductVariant[] | undefined =
        isDemo ? (product as DemoProduct).variants : undefined;
    const activeVariant = variants?.[variantIdx];
    const activePrice = activeVariant ? activeVariant.price : Number(product.price);
    const pricePer100g = activeVariant
        ? (activeVariant.price * 100) / activeVariant.weightGrams
        : null;
    const bestValueIdx = variants && variants.length > 1
        ? variants.reduce(
              (best, v, i) =>
                  v.price / v.weightGrams < variants[best].price / variants[best].weightGrams ? i : best,
              0,
          )
        : -1;

    const relatedProducts = product.category
        ? DEMO_PRODUCTS.filter((p) => p.category.slug === product.category!.slug && p.id !== product.id).slice(0, 4)
        : [];

    return (
        <Container className="py-8 animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-red-700 transition-colors">Home</Link>
                <span aria-hidden>/</span>
                <Link href="/products" className="hover:text-red-700 transition-colors">The Collection</Link>
                {product.category && (
                    <>
                        <span aria-hidden>/</span>
                        <Link href={`/categories/${product.category.slug}`} className="hover:text-red-700 transition-colors">
                            {product.category.name}
                        </Link>
                    </>
                )}
                <span aria-hidden>/</span>
                <span className="text-stone-900 font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* ─── Product Imagery ───────────────────────────────────────── */}
                <div className="sticky top-24">
                    <div className="relative aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs mb-4">
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

                        {/* Top floating artisan tag */}
                        {artisan.artisanTags.length > 0 && (
                            <div className="absolute top-4 left-4 z-10">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-stone-950/85 backdrop-blur-xs text-amber-300 border border-amber-400/25 shadow-md">
                                    {artisan.artisanTags[0]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Image thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSelectedImage(i)}
                                    id={`product-thumb-${i}`}
                                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-150 active:scale-95 ${
                                        i === selectedImage
                                            ? 'border-red-600 shadow-sm'
                                            : 'border-stone-200 hover:border-stone-400'
                                    }`}
                                >
                                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 30-Day Freshness Guarantee Badge on media side */}
                    <div className="mt-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        <div>
                            <h4 className="text-xs font-semibold text-emerald-950 uppercase tracking-wider">
                                30-Day Crispness Guarantee
                            </h4>
                            <p className="text-xs text-emerald-900/80 mt-0.5 leading-relaxed">
                                If your pack loses its characteristic crunch or arrives damaged in transit, we dispatch a fresh replacement immediately — no questions asked.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── Product Details & CRO Architecture ─────────────────────── */}
                <div className="space-y-6">
                    {/* Category & Spice Profile */}
                    <div className="flex items-center justify-between gap-4">
                        {product.category && (
                            <Link
                                href={`/categories/${product.category.slug}`}
                                className="text-xs font-semibold uppercase tracking-widest text-red-700 hover:text-red-800 transition-colors"
                            >
                                {product.category.name}
                            </Link>
                        )}
                        {artisan.spiceLevel && (
                            <SpiceLevelIndicator level={artisan.spiceLevel} />
                        )}
                    </div>

                    {/* Headline */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display tracking-tight">
                            {product.name}
                        </h1>
                        <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
                            {product.description}
                        </p>
                    </div>

                    {/* Price & Unit Economics */}
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-baseline justify-between gap-4">
                        <div>
                            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                                Direct-from-Kitchen Price
                            </span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-extrabold text-stone-900 font-display tracking-tight" id="product-price">
                                    {formatPrice(activePrice)}
                                </span>
                                {pricePer100g !== null && (
                                    <span className="text-xs font-medium text-stone-500" id="product-unit-price">
                                        ({formatPrice(Number(pricePer100g.toFixed(2)))} / 100g)
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                Freshly Packed
                            </span>
                            <span className="block text-[10px] text-stone-400 mt-1">
                                Batch prepared today
                            </span>
                        </div>
                    </div>

                    {/* Weight Selection & Multi-Pack Volume Tiering */}
                    {variants && variants.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                                    Select Pack Size
                                </span>
                                <span className="text-xs text-stone-500">
                                    Pick larger size for maximum savings
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Select pack size">
                                {variants.map((v, i) => {
                                    const isActive = i === variantIdx;
                                    const isBest = i === bestValueIdx;
                                    const unitPrice = (v.price * 100) / v.weightGrams;
                                    return (
                                        <button
                                            key={v.id}
                                            type="button"
                                            role="radio"
                                            aria-checked={isActive}
                                            onClick={() => setVariantIdx(i)}
                                            id={`weight-option-${v.label}`}
                                            className={`relative p-3.5 rounded-xl border text-left transition-[background-color,border-color,box-shadow] duration-150 active:scale-[0.98] ${
                                                isActive
                                                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                                                    : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50/50'
                                            }`}
                                        >
                                            {isBest && (
                                                <span className={`absolute -top-2.5 right-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-xs ${
                                                    isActive ? 'bg-amber-400 text-stone-950' : 'bg-emerald-600 text-white'
                                                }`}>
                                                    Best Value
                                                </span>
                                            )}
                                            <div className="font-bold text-sm">
                                                {v.label}
                                            </div>
                                            <div className={`text-xs mt-1 font-semibold ${isActive ? 'text-amber-300' : 'text-red-700'}`}>
                                                {formatPrice(v.price)}
                                            </div>
                                            <div className={`text-[10px] mt-0.5 ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                                                {formatPrice(Number(unitPrice.toFixed(1)))}/100g
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Add to Cart CTA */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between sm:justify-start border border-stone-200 rounded-xl bg-white p-1 shrink-0 h-12 shadow-xs">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-lg text-base font-bold transition-colors active:scale-95 cursor-pointer"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span className="w-10 text-center font-bold text-stone-900 text-sm">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => q + 1)}
                                className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-lg text-base font-bold transition-colors active:scale-95 cursor-pointer"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        {/* Primary CTA */}
                        <button
                            type="button"
                            onClick={() => addItem(product.id, quantity, activeVariant)}
                            className="flex-1 h-12 px-6 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                            id="add-to-cart-btn"
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span>Add to Tasting Vault</span>
                            <span className="font-semibold text-white/90">· {formatPrice(activePrice * quantity)}</span>
                        </button>
                    </div>

                    {/* Efficacy & Clean-Label Badges */}
                    <div className="pt-2">
                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                            Purity & Standard Badges
                        </span>
                        <EfficacyBadges certifications={artisan.certifications} />
                    </div>

                    {/* Ingredients & Pure Clean-Label Philosophy */}
                    <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
                        <button
                            type="button"
                            onClick={() => setShowIngredients(!showIngredients)}
                            className="w-full px-4 py-3.5 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-50 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                                Pure Ingredients & Clean Label
                            </span>
                            <span className="text-stone-400">{showIngredients ? '−' : '+'}</span>
                        </button>
                        {showIngredients && (
                            <div className="px-4 pb-4 pt-1 text-xs text-stone-600 border-t border-stone-100 bg-stone-50/30 space-y-2">
                                <p className="leading-relaxed">
                                    <strong className="text-stone-900 font-semibold">Ingredients: </strong>
                                    {artisan.ingredients}
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                                    <span>✓ Zero Palm Oil</span>
                                    <span>✓ Zero Artificial Essences</span>
                                    <span>✓ Zero Chemical Preservatives</span>
                                    <span>✓ 100% Vegetarian</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sensory Pairing & Peak Crunch Storage Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Sensory Pairing */}
                        <div className="p-3.5 rounded-xl border border-stone-200/90 bg-amber-50/40">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-950 mb-1">
                                <span className="text-base">☕</span>
                                Sensory Pairing
                            </div>
                            <p className="text-xs text-stone-700 leading-relaxed">
                                {artisan.pairingTip}
                            </p>
                        </div>

                        {/* Peak Crunch Storage */}
                        <div className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                                    <span className="text-base">🛡️</span>
                                    Peak Crunch Storage
                                </div>
                                <p className="text-xs text-stone-700 leading-relaxed">
                                    {artisan.storageTip}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setGuideOpen(true)}
                                className="mt-2 text-left text-[11px] font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-2 transition-colors cursor-pointer"
                            >
                                Read full 4-step crunch care guide →
                            </button>
                        </div>
                    </div>

                    {/* Express Delivery & Service Details */}
                    <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-2.5">
                        {[
                            {
                                text: 'Free Express Shipping across Bangalore on orders over ₹750',
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                ),
                            },
                            {
                                text: 'Prepared in small wood-fired morning batches — nitrogen-sealed for crunch',
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                                ),
                            },
                            {
                                text: 'Cash on Delivery & Instant UPI options available at checkout',
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5H21a.75.75 0 00-.75-.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                ),
                            },
                        ].map((info, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-600">
                                <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    {info.icon}
                                </svg>
                                <span>{info.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Related Products Carousel ──────────────────────────────────── */}
            {product.category && relatedProducts.length > 0 && (
                <section className="mt-20 pt-12 border-t border-stone-200" aria-label="Related craft snacks">
                    <div className="flex items-baseline justify-between mb-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-red-700 block mb-1">
                                Complete The Tasting
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 font-display">
                                More from {product.category.name}
                            </h2>
                        </div>
                        <Link
                            href={`/categories/${product.category.slug}`}
                            className="text-sm font-semibold text-red-700 hover:text-red-800 transition-colors shrink-0 ml-4 inline-flex items-center gap-1"
                        >
                            Explore category <span>→</span>
                        </Link>
                    </div>
                    <ProductCarousel products={relatedProducts} label={`More ${product.category.name.toLowerCase()}`} />
                </section>
            )}
            {/* Crispness Care Modal */}
            <CrispnessGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
        </Container>
    );
}
