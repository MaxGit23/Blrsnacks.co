import Link from 'next/link';
import { generateSeoMetadata } from '@/lib/seo';
import { Container } from '@/components/layout';

export const metadata = generateSeoMetadata({
  title: 'Batch Specials — Short-Dated Craft Snacks',
  description: 'Grab artisanal BLR Snacks at special prices before the batch date passes. Same craft, same quality — just closer to their peak.',
  path: '/batch-specials',
});

export default function BatchSpecialsPage() {
  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Limited availability
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 font-display mb-4">
          Batch Specials
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed font-body mb-8">
          Same craft. Same quality. Just closer to their peak freshness date —
          so we pass the savings on to you. These won&rsquo;t last long.
        </p>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-8 mb-10">
          <svg className="w-12 h-12 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h2 className="text-xl font-semibold text-stone-800 font-display mb-2">
            No Batch Specials Right Now
          </h2>
          <p className="text-stone-600 font-body mb-6">
            We sell through so quickly that we rarely have short-dated stock.
            Check back soon, or explore our fresh collection.
          </p>
          <Link
            href="/products"
            className="pressable inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-[background-color,box-shadow] duration-200 shadow-lg shadow-red-600/25 cursor-pointer"
          >
            Explore the Collection
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Why this page exists */}
        <div className="text-left rounded-xl border border-stone-200 p-6 bg-stone-50/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3">Why Batch Specials?</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-body">
            We never discount our core collection — those prices reflect the real cost of
            cold-pressed oils, hand-shaping, and same-day freshness. But occasionally,
            a batch nears its peak date before we sell through. Rather than waste craft,
            we offer it here at a reduced price. Same recipe, same quality, just enjoy it sooner.
          </p>
        </div>
      </div>
    </Container>
  );
}
