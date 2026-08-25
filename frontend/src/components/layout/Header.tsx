'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

const navLinks = [
  { href: '/products', label: 'Shop All' },
  { href: '/categories/chips', label: 'Chips' },
  { href: '/categories/mixtures', label: 'Mixtures' },
  { href: '/categories/sweets', label: 'Sweets' },
  { href: '/categories/murukku', label: 'Murukku' },
];

export default function Header() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

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
        const q = query.trim();
        if (!q) return;
        router.push(`/products?search=${encodeURIComponent(q)}`);
        setSearchOpen(false);
        setQuery('');
    }, [query, router]);

    const closeSearch = useCallback(() => {
        setSearchOpen(false);
        searchInputRef.current?.blur();
    }, []);

    return (
        <div className="sticky top-0 z-50 flex flex-col w-full">
            {/* Announcement Bar */}
            <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white text-xs sm:text-sm font-medium py-2 px-4 text-center">
                <span className="hidden sm:inline">
                    <svg className="inline w-4 h-4 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1012 10.125 2.625 2.625 0 0012 4.875z" /></svg>
                    Free delivery on orders over ₹500!
                </span>
                {' '}Use code <code className="font-bold bg-white/20 px-2 py-0.5 rounded ml-1">BLRSNACKS</code>
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
                            className="hidden sm:flex p-2.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200 cursor-pointer"
                            aria-label="Search"
                            aria-expanded={searchOpen}
                            aria-controls="header-search"
                            onClick={() => setSearchOpen((o) => !o)}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Search Popover */}
                        {searchOpen && (
                            <div
                                id="header-search"
                                role="search"
                                className="absolute right-0 top-full mt-2 w-72 z-50 animate-fade-in-down"
                                style={{ transformOrigin: 'top right' }}
                            >
                                <form
                                    onSubmit={submitSearch}
                                    className="glass rounded-xl shadow-lg border border-stone-200/60 p-2 flex items-center gap-1.5"
                                >
                                    <svg className="w-4 h-4 text-text-tertiary shrink-0 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        ref={searchInputRef}
                                        autoFocus
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') closeSearch();
                                        }}
                                        placeholder="Search snacks..."
                                        aria-label="Search snacks"
                                        enterKeyHint="search"
                                        autoComplete="off"
                                        className="flex-1 min-w-0 py-1.5 text-sm bg-transparent focus:outline-none text-text-primary placeholder:text-text-tertiary font-body"
                                    />
                                    <button
                                        type="button"
                                        onClick={closeSearch}
                                        aria-label="Close search"
                                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors duration-200 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        )}

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
