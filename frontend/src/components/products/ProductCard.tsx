'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/api';
import { useCart } from '@/context/cart-context';
import {
    getProductArtisanDetails,
    type DemoProduct,
    type ProductVariant,
} from '@/lib/mock-products';
import { Card } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { getImageUrl } from '@/lib/images';
import { SpiceLevelIndicator } from './SpiceLevelIndicator';

export function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCart();
    const variants: ProductVariant[] | undefined =
        (product as DemoProduct).variants;
    const [variantIdx, setVariantIdx] = useState(0);

    const artisan = getProductArtisanDetails(product);
    const activeVariant = variants && variants.length > 0 ? variants[variantIdx] : undefined;
    const priceToDisplay = activeVariant ? activeVariant.price : Number(product.price);
    const minPrice = variants && variants.length > 0
        ? Math.min(...variants.map((v) => v.price))
        : Number(product.price);

    return (
        <Link href={`/products/${product.slug}`} id={`product-${product.slug}`} className="block h-full group">
            <Card hoverable padding="none" className="overflow-hidden h-full flex flex-col justify-between border-stone-200/90 bg-white">
                <div>
                    {/* Media container */}
                    <div className="card-media-zoom relative h-52 bg-stone-100 flex items-center justify-center overflow-hidden">
                        {product.images.length > 0 ? (
                            <img
                                src={getImageUrl(product.images[0])}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                        ) : (
                            <img
                                src="/placeholder-product.svg"
                                alt={product.name}
                                className="w-24 h-24 opacity-50"
                            />
                        )}

                        {/* Top corner artisan badge */}
                        {artisan.artisanTags.length > 0 && (
                            <div className="absolute top-2.5 left-2.5 z-10">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-stone-900/80 backdrop-blur-xs text-amber-300 border border-amber-400/20 shadow-xs">
                                    {artisan.artisanTags[0]}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-4 flex-1">
                        {/* Category & Spice Level */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                                {product.category?.name}
                            </span>
                            {artisan.spiceLevel && (
                                <SpiceLevelIndicator level={artisan.spiceLevel} showLabel={false} />
                            )}
                        </div>

                        {/* Product Title */}
                        <h3 className="text-base font-semibold text-stone-900 group-hover:text-red-700 transition-colors duration-150 line-clamp-1 font-display">
                            {product.name}
                        </h3>

                        {/* Description */}
                        <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                </div>

                {/* Bottom Section: Weight options & Price */}
                <div className="px-4 pb-4 pt-1 border-t border-stone-100 bg-stone-50/50">
                    <div className="flex items-center justify-between gap-2">
                        {/* PRICE HIDDEN
                        <div>
                            <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                                {variants && variants.length > 1 ? 'Starting from' : 'Price'}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-base font-bold text-stone-900 font-display">
                                    {formatPrice(variants && variants.length > 1 ? minPrice : priceToDisplay)}
                                </span>
                                {activeVariant && (
                                    <span className="text-[11px] text-stone-500">
                                        / {activeVariant.label}
                                    </span>
                                )}
                            </div>
                        </div>
                        */}

                        {/* Weight Variants Pill selector */}
                        {variants && variants.length > 1 && (
                            <div
                                className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-stone-200"
                                onClick={(e) => e.preventDefault()}
                            >
                                {variants.map((v, i) => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setVariantIdx(i);
                                        }}
                                        className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-[background-color,color] duration-150 active:scale-[0.96] ${
                                            variantIdx === i
                                                ? 'bg-stone-900 text-white shadow-xs'
                                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                                        }`}
                                    >
                                        {v.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Add Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product.id, 1, activeVariant);
                        }}
                        className="mt-2.5 w-full py-2 px-3 rounded-lg bg-stone-900 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-150 active:scale-[0.98]"
                    >
                        <span>+ Add to Tasting Vault</span>
                        {/* PRICE HIDDEN <span className="text-stone-300 font-normal">({formatPrice(priceToDisplay)})</span> */}
                    </button>
                </div>
            </Card>
        </Link>
    );
}
