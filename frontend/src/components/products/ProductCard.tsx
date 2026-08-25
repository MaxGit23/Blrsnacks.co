'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/api';
import type { DemoProduct, ProductVariant } from '@/lib/mock-products';
import { Card } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { getImageUrl } from '@/lib/images';

export function ProductCard({ product }: { product: Product }) {
    const variants: ProductVariant[] | undefined =
        (product as DemoProduct).variants;
    const [variantIdx, setVariantIdx] = useState(0);
    const activeVariant = variants?.[variantIdx];
    const displayPrice = activeVariant ? activeVariant.price : Number(product.price);

    return (
        <Link href={`/products/${product.slug}`} id={`product-${product.slug}`}>
            <Card hoverable padding="none" className="overflow-hidden group">
                <div className="card-media-zoom relative h-48 bg-bg-secondary flex items-center justify-center overflow-hidden">
                    {product.images.length > 0 ? (
                        <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <img
                            src="/placeholder-product.svg"
                            alt={product.name}
                            className="w-24 h-24 opacity-50"
                        />
                    )}
                </div>
                <div className="p-4">
                    <div className="text-xs text-text-tertiary uppercase tracking-wide mb-1">{product.category?.name}</div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-text-secondary line-clamp-2">{product.description}</p>

                    {/* Weight selector */}
                    {variants && variants.length > 0 && (
                        <label className="mt-3 block">
                            <span className="sr-only">Select weight for {product.name}</span>
                            <select
                                value={variantIdx}
                                onChange={(e) => setVariantIdx(Number(e.target.value))}
                                onClick={(e) => e.preventDefault()}
                                className="w-full px-3 py-2 text-sm border border-border-default rounded-[var(--radius-md)] bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none cursor-pointer"
                            >
                                {variants.map((v, i) => (
                                    <option key={v.id} value={i}>
                                        {v.label} — {formatPrice(v.price)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    <div className="mt-3">
                        <span className="text-lg font-bold text-brand-primary">{formatPrice(displayPrice)}</span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
