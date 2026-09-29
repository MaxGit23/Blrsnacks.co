'use client';

import React from 'react';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/format';

interface Bundle {
    id: string;
    title: string;
    tagline: string;
    description: string;
    items: string[];
    price: number;
    originalPrice: number;
    badge: string;
    highlight: string;
    productIdForAdd: string;
}

const CURATED_BUNDLES: Bundle[] = [
    {
        id: 'vault-heritage',
        title: 'The Bangalore Heritage Box',
        tagline: '6 Regional Masterpieces · 1 Curated Box',
        description:
            'A journey through Bengaluru’s golden snacking era: hand-pressed Benne Murukku, wood-fired Congress Kadlekai, thin-sliced Coconut Oil Banana Chips, crunchy Kodubale, Ribbon Mixture, and melt-in-mouth Kaju Katli.',
        items: [
            'Benne Butter Murukku (400g)',
            'Classic Banana Chips (400g)',
            'Congress Kadlekai (400g)',
            'Karnataka Kodubale (200g)',
            'Ribbon Mixture (200g)',
            'Kaju Katli (200g)',
        ],
        price: 699,
        originalPrice: 820,
        badge: 'Most Gifted',
        highlight: 'Save ₹121 (15% off)',
        productIdForAdd: 'demo-product-classic-banana-chips',
    },
    {
        id: 'vault-kaapi',
        title: 'Evening Kaapi & Chai Vault',
        tagline: 'The Ultimate 4 PM Tea-Time Arsenal',
        description:
            'Specifically calibrated to pair with piping hot South Indian filter coffee and spiced ginger chai. Crunchy, fragrant with curry leaves, and 100% cold-pressed.',
        items: [
            'Spicy Nendran Chips (400g)',
            'Benne Butter Murukku (400g)',
            'Kerala Spicy Mixture (200g)',
            'Plain Moong Dal (200g)',
        ],
        price: 499,
        originalPrice: 565,
        badge: 'Connoisseur Pick',
        highlight: 'Save ₹66 (12% off)',
        productIdForAdd: 'demo-product-benne-murukku',
    },
    {
        id: 'vault-grand',
        title: 'Grand Festive Connoisseur Trunk',
        tagline: '8 Handcrafted Sweets & Savouries',
        description:
            'Our largest artisanal spread. Prepared in brass kadais with pure desi cow ghee and cold-pressed groundnut oil. Shipped in premium reusable rigid gift packaging.',
        items: [
            'Pure Ghee Mysore Pak (400g)',
            'Special Mixture (400g)',
            'Classic Banana Chips (400g)',
            'Tomato Murukku (200g)',
            'Bakarwadi (200g)',
            'Dry Fruit Ladoo (200g)',
            'Masala Peanuts (200g)',
            'Butter Rusk (200g)',
        ],
        price: 999,
        originalPrice: 1220,
        badge: 'Free Express Shipping',
        highlight: 'Save ₹221 (18% off)',
        productIdForAdd: 'demo-product-bakarwadi',
    },
];

export function CuratedVaults() {
    const { addItem } = useCart();

    return (
        <section className="py-20 lg:py-28 bg-stone-950 text-white reveal" id="tasting-vaults">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-300 bg-amber-950/60 border border-amber-500/30 mb-4">
                        Curated Tasting Vaults
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white">
                        Multi-Pack Bundles. <br />
                        <span className="text-amber-400">Zero Compromise.</span>
                    </h2>
                    <p className="mt-4 text-stone-400 text-base sm:text-lg leading-relaxed">
                        Curated selections of our finest wood-fired snacks, packed together for maximum sensory variety and exceptional pantry value.
                    </p>
                </div>

                {/* Bundle Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {CURATED_BUNDLES.map((bundle) => (
                        <div
                            key={bundle.id}
                            className="rounded-3xl border border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 transition-[border-color,transform] duration-200 shadow-xl"
                        >
                            <div>
                                {/* Top Badges */}
                                <div className="flex items-center justify-between gap-2 mb-4">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                        {bundle.badge}
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-400">
                                        {bundle.highlight}
                                    </span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-1">
                                    {bundle.title}
                                </h3>
                                <p className="text-xs font-semibold text-amber-400/90 tracking-wide mb-3">
                                    {bundle.tagline}
                                </p>
                                <p className="text-xs text-stone-400 leading-relaxed mb-6">
                                    {bundle.description}
                                </p>

                                {/* What's Inside list */}
                                <div className="space-y-2 mb-8 border-t border-stone-800/80 pt-5">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                                        What’s in the vault:
                                    </span>
                                    {bundle.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-300">
                                            <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price & CTA */}
                            <div className="pt-6 border-t border-stone-800">
                                <div className="flex items-baseline justify-between mb-4">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-extrabold font-display text-white">
                                                {formatPrice(bundle.price)}
                                            </span>
                                            <span className="text-xs text-stone-500 line-through">
                                                {formatPrice(bundle.originalPrice)}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-stone-400 block mt-0.5">
                                            Includes rigid gift packaging
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                        Ships Free in BLR
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addItem(bundle.productIdForAdd, 1)}
                                    className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors duration-150 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Add Vault to Tasting Cart</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
