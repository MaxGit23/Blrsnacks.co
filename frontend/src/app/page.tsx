import Link from 'next/link';
import { generateSeoMetadata } from '@/lib/seo';

export const metadata = generateSeoMetadata({
  title: 'Authentic Bangalore Snacks Delivered Fresh',
  path: '/',
});

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* ─── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary-light via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/10 rounded-[var(--radius-full)]">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                Now delivering across Bangalore
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-secondary leading-[1.1] tracking-tight">
                Farm-Fresh Snacks,
                <br />
                <span className="text-brand-primary">Straight to You</span>
              </h1>
              <p className="mt-6 text-lg text-text-secondary leading-relaxed">
                Handcrafted banana chips, spicy mixtures, aromatic murukku, and
                traditional sweets — made with authentic South Indian recipes and
                delivered fresh daily.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center px-7 py-3.5 bg-brand-primary text-white font-semibold rounded-[var(--radius-md)] hover:bg-brand-primary-hover transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/25"
                >
                  Browse All Snacks
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center px-7 py-3.5 border-2 border-brand-secondary/15 text-brand-secondary font-semibold rounded-[var(--radius-md)] hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary-light transition-all active:scale-[0.98]"
                >
                  View Categories
                </Link>
              </div>
              {/* Trust badges */}
              <div className="mt-10 flex items-center gap-6 text-sm text-text-tertiary">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  No preservatives
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Made daily
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  COD available
                </span>
              </div>
            </div>
            {/* Hero visual placeholder */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-[420px] h-[420px] rounded-full bg-gradient-to-br from-brand-accent/20 to-brand-primary/10 flex items-center justify-center">
                <span className="text-[140px] leading-none select-none">🍌</span>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-success/10 flex items-center justify-center text-3xl">🌶️</div>
                <div className="absolute -bottom-2 -left-6 w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center text-2xl">🥜</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ─── Categories Strip ─────────────────────────────────────────────────── */}
      <section className="border-y border-border-light bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Shop by Category</h2>
            <Link href="/categories" className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { emoji: '🍌', name: 'Banana Chips', slug: 'banana-chips' },
              { emoji: '🌶️', name: 'Mixtures', slug: 'mixtures' },
              { emoji: '🥨', name: 'Murukku', slug: 'murukku' },
              { emoji: '🍬', name: 'Sweets', slug: 'sweets' },
              { emoji: '🥜', name: 'Dry Fruits', slug: 'dry-fruits' },
              { emoji: '🫖', name: 'Beverages', slug: 'beverages' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-[var(--radius-lg)] border border-border-light hover:border-brand-primary/30 hover:shadow-[var(--shadow-md)] transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <span className="text-sm font-medium text-text-primary group-hover:text-brand-primary transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-secondary">How It Works</h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">From our kitchen to your doorstep in three simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-border-light" />
          {[
            { step: '01', icon: '🛒', title: 'Pick Your Favourites', desc: 'Browse our curated selection of authentic Bangalore snacks and add to cart.' },
            { step: '02', icon: '📍', title: 'Choose Delivery', desc: 'Enter your address. We deliver across Bangalore with same-day options.' },
            { step: '03', icon: '📦', title: 'Pay on Delivery', desc: 'No online payment needed. Pay cash when your fresh snacks arrive.' },
          ].map((item) => (
            <div key={item.step} className="relative text-center px-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-primary-light mb-6 relative z-10">
                <span className="text-4xl">{item.icon}</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2">Step {item.step}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Why BLR Snacks ───────────────────────────────────────────────────── */}
      <section className="bg-bg-inverse text-text-inverse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">Why Thousands Choose BLR Snacks</h2>
              <p className="mt-4 text-text-inverse/60 leading-relaxed">We&apos;re not just another snack store. Every product is crafted in small batches using recipes passed down through generations.</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '5000+', label: 'Happy Customers' },
                { value: '50+', label: 'Products' },
                { value: '99%', label: 'On-time Delivery' },
                { value: '0', label: 'Preservatives Used' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-5 rounded-[var(--radius-lg)] bg-white/5 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-brand-accent">{stat.value}</div>
                  <div className="mt-1 text-sm text-text-inverse/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-r from-brand-primary to-brand-accent px-8 md:px-16 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Taste Bangalore?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">Order now and get your favourite snacks delivered fresh. Cash on delivery available.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3.5 bg-white text-brand-primary font-semibold rounded-[var(--radius-md)] hover:bg-white/90 transition-all active:scale-[0.98] shadow-lg"
          >
            Start Shopping
          </Link>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        </div>
      </section>
    </div>
  );
}
