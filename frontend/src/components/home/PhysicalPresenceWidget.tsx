import React from 'react';

const REVIEWS = [
    {
        name: 'Venkatesh Raghavan',
        badge: 'Verified Bangalore Resident (Malleshwaram)',
        rating: 5,
        quote:
            'The Benne Murukku is exactly what we used to get in the 80s from traditional home kitchens. You can smell the real cold-pressed groundnut oil the second you open the nitrogen seal. Night and day compared to supermarket brands.',
        snack: 'Benne Butter Murukku',
    },
    {
        name: 'Ananya Sridhar',
        badge: 'Verified Filter Coffee Purist (Indiranagar)',
        rating: 5,
        quote:
            'I refuse to drink my 4 PM filter coffee without their Spicy Nendran Chips or Congress Kadlekai. The crunch is extraordinarily fresh, and zero palm oil means zero greasy aftertaste.',
        snack: 'Spicy Nendran Chips',
    },
    {
        name: 'Dr. Mohan Kumar',
        badge: '3rd-Gen South Indian Food Purist (Jayanagar)',
        rating: 5,
        quote:
            'Clean ingredients are non-negotiable for my family. BLR Snacks uses pure cow ghee and cold-pressed oils with complete transparency. This is what true Karnataka craft food looks like.',
        snack: 'The Bangalore Heritage Box',
    },
];

const STOCKIST_VENUES = [
    {
        name: 'Third Wave Roastery Partner Shelf',
        neighborhood: '12th Main, Indiranagar',
        type: 'Artisanal Coffee Bar',
        timing: '8 AM – 11 PM Daily',
    },
    {
        name: 'Airlines Heritage Tasting Counter',
        neighborhood: 'Lavelle Road, Central Bangalore',
        type: 'Open-Air Landmark',
        timing: '7 AM – 9 PM Daily',
    },
    {
        name: 'Dyu Art Cafe Artisanal Pantry',
        neighborhood: 'Koramangala 5th Block',
        type: 'Courtyard Cafe & Gallery',
        timing: '10 AM – 10 PM Daily',
    },
    {
        name: 'Malleshwaram 8th Cross Tasting Kiosk',
        neighborhood: 'Margosa Road, Malleshwaram',
        type: 'Heritage Craft Counter',
        timing: '9 AM – 8:30 PM Daily',
    },
];

export function PhysicalPresenceWidget() {
    return (
        <section className="py-20 lg:py-28 bg-stone-50 border-t border-stone-200/80 reveal">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ─── Part 1: Verifiable Connoisseur Reviews ─────────────────── */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-700 block mb-2">
                        Verifiable Proof
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold font-display text-stone-900">
                        Loved by Pure-Food Connoisseurs
                    </h2>
                    <p className="mt-3 text-stone-600 text-sm sm:text-base">
                        Real testimonials from Bangalore residents who know the difference between palm-oil mass manufacturing and genuine wood-fired craft.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {REVIEWS.map((review, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-1 text-amber-500 mb-3 text-sm" aria-label={`${review.rating} out of 5 stars`}>
                                    {'★'.repeat(review.rating)}
                                </div>
                                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                                    &ldquo;{review.quote}&rdquo;
                                </p>
                            </div>

                            <div className="pt-4 border-t border-stone-100">
                                <div className="font-bold text-xs sm:text-sm text-stone-900 font-display">
                                    {review.name}
                                </div>
                                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                                    <span>✓</span> {review.badge}
                                </div>
                                <div className="text-[10px] text-stone-400 mt-1">
                                    Verified purchase: <span className="text-stone-600">{review.snack}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── Part 2: Physical Presence & Partner Tasting Points ────────── */}
                <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-xs">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-stone-200">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-1">
                                Physical Presence Authority
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
                                Where to Taste BLR Snacks in Bangalore
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                                Prefer to taste before ordering? Experience our fresh morning batches served alongside specialty filter coffees at selected heritage partners.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium shrink-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>4 Active Tasting Points Across the City</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {STOCKIST_VENUES.map((venue, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                            >
                                <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block mb-1">
                                    {venue.type}
                                </span>
                                <h4 className="text-sm font-bold text-stone-900 font-display mb-1">
                                    {venue.name}
                                </h4>
                                <p className="text-xs text-stone-600 mb-2">
                                    📍 {venue.neighborhood}
                                </p>
                                <span className="text-[10px] text-stone-400 block">
                                    🕒 {venue.timing}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
