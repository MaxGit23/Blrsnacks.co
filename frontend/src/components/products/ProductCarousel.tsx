'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';

interface ProductCarouselProps {
    products: Product[];
    label?: string;
}

export function ProductCarousel({ products, label = 'Related products' }: ProductCarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    // Track scroll bounds so arrows reflect reality at all times
    const updateBounds = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }, []);

    useEffect(() => {
        updateBounds();
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateBounds, { passive: true });
        window.addEventListener('resize', updateBounds);
        return () => {
            el.removeEventListener('scroll', updateBounds);
            window.removeEventListener('resize', updateBounds);
        };
    }, [updateBounds]);

    const page = useCallback((dir: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollBy({
            left: dir * el.clientWidth,
            behavior: reduce ? 'auto' : 'smooth',
        });
    }, []);

    if (products.length === 0) return null;

    return (
        <div className="relative" role="region" aria-label={label}>
            {/* Left / right CTAs */}
            {products.length > 3 && (
                <>
                    <button
                        type="button"
                        onClick={() => page(-1)}
                        disabled={!canPrev}
                        aria-label={`Previous ${label}`}
                        className={`absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-700 shadow-lg ring-1 ring-stone-200 transition-[color,box-shadow] duration-200 active:scale-[0.94] ${canPrev ? 'hover:text-brand-primary cursor-pointer' : 'opacity-35 cursor-default'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => page(1)}
                        disabled={!canNext}
                        aria-label={`Next ${label}`}
                        className={`absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-700 shadow-lg ring-1 ring-stone-200 transition-[color,box-shadow] duration-200 active:scale-[0.94] ${canNext ? 'hover:text-brand-primary cursor-pointer' : 'opacity-35 cursor-default'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </>
            )}

            {/* Snap-scrolling track — native swipe stays available */}
            <div
                ref={trackRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
                    >
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    );
}
