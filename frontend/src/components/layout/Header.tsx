'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { DEMO_PRODUCTS } from '@/lib/mock-products';
import { getImageUrl } from '@/lib/images';
import { formatPrice } from '@/lib/format';

const navLinks = [
  { href: '/products', label: 'Shop All' },
  { href: '/categories/chips', label: 'Chips' },
  { href: '/categories/mixtures', label: 'Mixtures' },
  { href: '/categories/murukku', label: 'Murukku' },
  { href: '/categories/sweets', label: 'Sweets' },
];

export default function Header() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIdx, setActiveIdx] = useState(-1);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Live product matches — tolerant of word order and extra words (Postel's Law)
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        const words = q.split(/\s+/);
        return DEMO_PRODUCTS.filter((p) => {
            const haystack = `${p.name} ${p.description} ${p.category.name}`.toLowerCase();
            return words.every((w) => haystack.includes(w));
        }).slice(0, 5);
    }, [query]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close the search popover on outside pointer press
    useEffect(() => {
        if (!searchOpen) return;
        const onDown = (e: PointerEvent) => {
            const panel = document.getElementById('header-search');
            const trigger = document.getElementById('header-search-trigger');
            if (panel && !panel.contains(e.target as Node) && trigger && !trigger.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('pointerdown', onDown);
        return () => document.removeEventListener('pointerdown', onDown);
    }, [searchOpen]);

    const submitSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (activeIdx >= 0 && results[activeIdx]) {
            router.push(`/products/${results[activeIdx].slug}`);
        } else {
            const q = query.trim();
            if (!q) return;
            router.push(`/products?search=${encodeURIComponent(q)}`);
        }
        setSearchOpen(false);
        setQuery('');
        setActiveIdx(-1);
    }, [query, activeIdx, results, router]);

    const closeSearch = useCallback(() => {
        setSearchOpen(false);
        searchInputRef.current?.blur();
    }, []);

    const openSearch = useCallback(() => {
        setActiveIdx(-1);
        setSearchOpen((o) => !o);
    }, []);

    return (
        <div className="sticky top-0 z-50 flex flex-col w-full">
            {/* Announcement Bar — one message, all breakpoints */}
            <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white text-xs sm:text-sm font-medium py-2 px-4 text-center">
                Free delivery on orders over ₹500 · Cash on Delivery
            </div>

            <header className={`[transition-property:background-color,border-color,box-shadow] duration-300 ease-out ${scrolled ? 'glass shadow-lg' : 'bg-white/95 border-b border-stone-200'}`}>
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-stone-900 group-hover:text-red-600 transition-colors font-display tracking-wide">
                                BLR Snacks
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="relative flex items-center gap-1.5">
                        {/* Search */}
                        <button
                            id="header-search-trigger"
                            className={`hidden sm:flex p-2.5 rounded-full transition-colors duration-200 cursor-pointer ${searchOpen ? 'text-red-600 bg-red-50' : 'text-stone-500 hover:text-red-600 hover:bg-red-50'}`}
                            aria-label="Search"
                            aria-expanded={searchOpen}
                            aria-controls="header-search"
                            onClick={openSearch}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Search Popover — translucent material anchored to its trigger */}
                        <div
                            id="header-search"
                            role="search"
                            data-open={searchOpen}
                            className="search-panel absolute right-0 top-full mt-3 w-[22rem] max-w-[calc(100vw-2rem)] z-50"
                        >
                            <div className="surface-popover rounded-2xl overflow-hidden">
                                <form onSubmit={submitSearch} className="flex items-center gap-2.5 px-4 py-3.5">
                                    <svg className="w-[18px] h-[18px] text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        ref={searchInputRef}
                                        autoFocus
                                        type="text"
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            setActiveIdx(-1);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                                closeSearch();
                                                return;
                                            }
                                            if (e.key === 'ArrowDown') {
                                                e.preventDefault();
                                                setActiveIdx((i) => Math.min(i + 1, results.length));
                                            } else if (e.key === 'ArrowUp') {
                                                e.preventDefault();
                                                setActiveIdx((i) => Math.max(i - 1, -1));
                                            }
                                        }}
                                        placeholder="Search snacks..."
                                        aria-label="Search snacks"
                                        aria-controls="header-search-results"
                                        enterKeyHint="search"
                                        autoComplete="off"
                                        role="combobox"
                                        aria-expanded={searchOpen}
                                        className="flex-1 min-w-0 bg-transparent text-[15px] font-medium tracking-[-0.01em] text-text-primary placeholder:font-normal placeholder:text-text-tertiary focus:outline-none font-body"
                                    />
                                    <kbd className="hidden sm:inline-flex items-center px-1.5 h-5 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary border border-border-light rounded-md select-none">
                                        Esc
                                    </kbd>
                                </form>

                                {query.trim() !== '' && (
                                    <div id="header-search-results" className="border-t border-black/5 py-1.5">
                                        {results.map((p, i) => (
                                            <Link
                                                key={p.id}
                                                href={`/products/${p.slug}`}
                                                onClick={() => setSearchOpen(false)}
                                                onMouseEnter={() => setActiveIdx(i)}
                                                className={`mx-1.5 flex items-center gap-3 px-2.5 py-2 rounded-xl transition-colors duration-150 ${activeIdx === i ? 'bg-brand-primary-light' : ''}`}
                                            >
                                                {p.images[0] ? (
                                                    <img
                                                        src={getImageUrl(p.images[0])}
                                                        alt=""
                                                        className="w-10 h-10 rounded-lg object-cover bg-bg-secondary shrink-0"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <span className="w-10 h-10 rounded-lg bg-bg-secondary shrink-0" />
                                                )}
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-sm font-semibold tracking-[-0.01em] text-text-primary truncate">
                                                        {p.name}
                                                    </span>
                                                    <span className="block text-xs text-text-tertiary truncate">
                                                        {p.category.name}
                                                    </span>
                                                </span>
                                                <span className="text-sm font-bold text-brand-primary shrink-0">
                                                    {formatPrice(p.price)}
                                                </span>
                                            </Link>
                                        ))}

                                        {results.length > 0 && (
                                            <button
                                                type="submit"
                                                className={`mx-1.5 mt-0.5 w-[calc(100%-0.75rem)] flex items-center justify-between px-2.5 py-2.5 rounded-xl text-sm transition-colors duration-150 cursor-pointer ${activeIdx === results.length ? 'bg-brand-primary-light' : 'hover:bg-bg-tertiary'}`}
                                            >
                                                <span className="font-medium text-brand-primary truncate">
                                                    See all results for “{query.trim()}”
                                                </span>
                                                <svg className="w-3.5 h-3.5 text-brand-primary shrink-0 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </button>
                                        )}

                                        {results.length === 0 && (
                                            <p className="px-4 py-3 text-sm text-text-secondary">
                                                No matches for “{query.trim()}” — press Enter to search everything.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-all duration-200 cursor-pointer"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div
                    id="mobile-menu"
                    data-open={mobileOpen}
                    className="lg:hidden absolute top-full left-0 w-full glass shadow-xl border-b border-stone-200/50 menu-panel z-50"
                >
                    <div className="px-4 py-4 space-y-2">
                            {isAuthenticated && (
                                <div className="flex items-center justify-between py-2 border-b border-stone-200/50 mb-2">
                                    <span className="text-sm font-semibold text-stone-900">
                                        Hi, {user?.email?.split('@')[0] || 'Snacker'}
                                    </span>
                                </div>
                            )}

                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-stone-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 cursor-pointer"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isAuthenticated && (
                                <div className="pt-4 border-t border-stone-200/50 space-y-1">
                                    <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-base font-medium text-stone-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" onClick={() => setMobileOpen(false)}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        My Orders
                                    </Link>
                                    <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-base font-medium text-stone-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" onClick={() => setMobileOpen(false)}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Account Settings
                                    </Link>
                                </div>
                            )}
                        </div>
                </div>
            </header>
        </div>
    );
}
