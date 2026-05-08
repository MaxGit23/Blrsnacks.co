import Link from 'next/link';
import { generateSeoMetadata } from '@/lib/seo';
import { Button } from '@/components/ui';
import Image from 'next/image';
import { ScrollRevealWrapper } from './ScrollRevealWrapper';
import { AnimatedStats } from './AnimatedStats';

export const metadata = generateSeoMetadata({
  title: 'Authentic Bangalore Snacks — Delivered Fresh Daily',
  path: '/',
});

const categories = [
  { image: '/banana-chips.jpg', name: 'Banana Chips', slug: 'banana-chips', icon: 'chips' },
  { image: '/mixtures.jpg', name: 'Mixtures', slug: 'mixtures', icon: 'mixture' },
  { image: '/murukku.jpg', name: 'Murukku', slug: 'murukku', icon: 'murukku' },
  { image: '/sweets.jpg', name: 'Sweets', slug: 'sweets', icon: 'sweets' },
  { image: '/dry-fruits.jpg', name: 'Dry Fruits', slug: 'dry-fruits', icon: 'nuts' },
  { image: '/beverages.jpg', name: 'Beverages', slug: 'beverages', icon: 'beverage' },
];

function CategoryIcon({ type }: { type: string }) {
  const cls = 'w-7 h-7 text-red-600';
  switch (type) {
    case 'chips': return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
    case 'mixture': return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" /></svg>;
    case 'murukku': return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>;
    case 'sweets': return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1012 10.125 2.625 2.625 0 0012 4.875z" /></svg>;
    case 'nuts': return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    default: return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>;
  }
}

const steps = [
  { number: '01', title: 'Choose Your Snacks', description: 'Browse our collection of handcrafted snacks and pick your favourites.', icon: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )},
  { number: '02', title: 'We Deliver Fresh', description: 'Same-day delivery across Bangalore with your preferred time slot.', icon: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v2H8v-2a1 1 0 011-1h4a1 1 0 011 1v2h-1v-2h-1v2h-1v-2h-1V10a1 1 0 011-1h-1" />
    </svg>
  )},
  { number: '03', title: 'Pay on Delivery', description: 'No online payment needed. Pay cash when your snacks arrive.', icon: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )},
];

const stats = [
  { value: '15K+', label: 'Happy Customers' },
  { value: '50+', label: 'Handcrafted Snacks' },
  { value: '98%', label: 'On-time Delivery' },
  { value: '100%', label: 'Natural Ingredients' },
];

const trustBadges = [
  { label: 'Zero Preservatives', iconPath: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z' },
  { label: 'Fresh Daily Batches', iconPath: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
  { label: 'Same-day Delivery', iconPath: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
  { label: 'Cash on Delivery', iconPath: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75-.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
];

export default function Home() {
  return (
    <ScrollRevealWrapper>
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-100 rounded-full badge-shine">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Fresh batches every morning
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.1] tracking-tight font-display">
                Real Bangalore Flavours,
                <br />
                <span className="text-gradient-warm">Delivered Fresh</span>
              </h1>
              <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-lg font-body">
                Discover crispy banana chips, fiery mixtures, crunchy murukku, and traditional sweets — 
                small-batch crafted from time-honoured South Indian recipes.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  id="hero-shop-btn"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-red-600/25 cursor-pointer"
                >
                  Shop All Snacks
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/categories"
                  id="hero-categories-btn"
                  className="inline-flex items-center px-6 py-3 border-2 border-stone-200 text-stone-700 font-semibold rounded-xl hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                >
                  Browse Categories
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">
                {trustBadges.map((badge) => (
                  <span key={badge.label} className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={badge.iconPath} /></svg>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Hero visual */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-amber-500 rounded-3xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/40 to-transparent z-10" />
                  <img
                    src="/hero-product.jpg"
                    alt="Authentic Bangalore Snacks"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {['chips', 'mixture', 'murukku'].map((icon, i) => (
                            <span key={i} className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-full border-2 border-white">
                              <CategoryIcon type={icon} />
                            </span>
                          ))}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-stone-900">50+ Varieties</div>
                          <div className="text-xs text-stone-500">of authentic snacks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
              </div>
              <div className="absolute -bottom-2 -left-4 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg animate-float-delayed">
                <span className="text-lg font-bold text-amber-600">4.9<svg className="inline w-4 h-4 text-amber-500 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" /></svg></span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-red-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-60 h-60 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      </section>

{/* Categories Strip */}
      <section className="border-y border-stone-200 bg-stone-50 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-stone-900 font-display">Shop by Category</h2>
            <Link href="/categories" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer">
              All categories →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                id={`cat-${cat.slug}`}
                className={`flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-stone-200 hover:border-red-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer reveal reveal-delay-${i + 1}`}
              >
                <div className="w-14 h-14 flex items-center justify-center bg-red-50 rounded-full group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                  <CategoryIcon type={cat.icon} />
                </div>
                <span className="text-sm font-semibold text-stone-700 group-hover:text-red-700 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 font-display">How It Works</h2>
            <p className="mt-3 text-stone-600 max-w-md mx-auto text-lg font-body">
              Three simple steps to get authentic Bangalore snacks delivered fresh
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((item, index) => (
              <div key={item.number} className={`relative text-center reveal reveal-delay-${index + 1}`}>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-red-50 to-amber-50 mb-6 relative z-10 group hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <div className="text-red-600">{item.icon}</div>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Step {item.number}</div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2 font-display">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed font-body">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BLR Snacks */}
      <section className="py-20 lg:py-28 bg-stone-900 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight font-display">
                Why Bangalore <br/>
                <span className="text-amber-400">Loves BLR Snacks</span>
              </h2>
              <p className="mt-6 text-stone-400 leading-relaxed text-lg font-body">
                We’re more than a snack store. Every batch is prepared fresh using 
                recipes handed down through generations of South Indian kitchens — 
                with zero artificial additives.
              </p>
              <AnimatedStats />
            </div>
            <div className="relative reveal reveal-delay-2">
              <div className="aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-amber-500 rounded-3xl rotate-3 opacity-20" />
                <div className="relative bg-stone-800 rounded-3xl p-8 border border-stone-700">
                  <div className="space-y-6">
                    {[
                      { title: 'Fresh Daily', desc: 'Batches prepared every morning' },
                      { title: 'Natural', desc: 'Zero preservatives or additives' },
                      { title: 'Traditional', desc: 'Authentic family recipes' },
                      { title: 'Fast Delivery', desc: 'Same-day across Bangalore' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-red-500/20 rounded-xl">
                          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-white font-body">{item.title}</div>
                          <div className="text-sm text-stone-400 font-body">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 reveal">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 px-8 md:px-16 py-14 text-center animate-gradient">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Ready to Taste the <span className="text-amber-200">Authentic Flavours</span>?
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto text-lg font-body">
            Order now and get your favourites delivered fresh today. Cash on delivery — no hassle.
          </p>
          <Link
            href="/products"
            id="cta-shop-btn"
            className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all duration-200 active:scale-[0.98] shadow-xl cursor-pointer"
          >
            Start Shopping
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>
    </div>
    </ScrollRevealWrapper>
  );
}
