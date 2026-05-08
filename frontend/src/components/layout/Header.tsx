'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';

const navLinks = [
  { href: '/products', label: 'Shop All' },
  { href: '/categories/chips', label: 'Chips' },
  { href: '/categories/mixtures', label: 'Mixtures' },
  { href: '/categories/sweets', label: 'Sweets' },
  { href: '/categories/murukku', label: 'Murukku' },
];

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="sticky top-0 z-50 flex flex-col w-full">
            {/* Announcement Bar */}
            <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white text-xs sm:text-sm font-medium py-2 px-4 text-center badge-shine">
                <span className="hidden sm:inline">
                    <svg className="inline w-4 h-4 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1012 10.125 2.625 2.625 0 0012 4.875z" /></svg>
                    Free delivery on orders over ₹500!
                </span>
                {' '}Use code <code className="font-bold bg-white/20 px-2 py-0.5 rounded ml-1">BLRSNACKS</code>
            </div>

            <header className={`transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-white/95 border-b border-stone-200'}`}>
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
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
                    <div className="flex items-center gap-1.5">
                        {/* Search */}
                        <button 
                            className="hidden sm:flex p-2.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 cursor-pointer" 
                            aria-label="Search"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Account */}
                        <div className="relative hidden lg:block" ref={userDropdownRef}>
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="p-2.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 cursor-pointer"
                                aria-label="Account"
                                aria-expanded={userDropdownOpen}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </button>

                            {userDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 glass rounded-xl shadow-xl py-2 animate-fade-in-up z-50">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="px-4 py-2 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200/60 mb-1">
                                                {user?.email?.split('@')[0] || 'Account'}
                                            </div>
                                            <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer" onClick={() => setUserDropdownOpen(false)}>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                My Orders
                                            </Link>
                                            <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer" onClick={() => setUserDropdownOpen(false)}>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Settings
                                            </Link>
                                            {user?.role === 'ADMIN' && (
                                                <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer" onClick={() => setUserDropdownOpen(false)}>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => { logout(); setUserDropdownOpen(false); }}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer" onClick={() => setUserDropdownOpen(false)}>
                                                Sign In
                                            </Link>
                                            <Link href="/register" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 mx-2 rounded-lg transition-colors cursor-pointer" onClick={() => setUserDropdownOpen(false)}>
                                                Create Account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2.5 rounded-full text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                            aria-label={`Cart with ${itemCount} items`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-scale-in">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </span>
                            )}
                        </Link>

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
                {mobileOpen && (
                    <div id="mobile-menu" className="lg:hidden absolute top-full left-0 w-full glass shadow-xl border-b border-stone-200/50 animate-fade-in-down z-50">
                        <div className="px-4 py-4 space-y-2">
                            {isAuthenticated ? (
                                <div className="flex items-center justify-between py-2 border-b border-stone-200/50 mb-2">
                                    <span className="text-sm font-semibold text-stone-900">
                                        Hi, {user?.email?.split('@')[0] || 'Snacker'}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex gap-3 py-2 border-b border-stone-200/50 mb-2">
                                    <Link href="/login" className="flex-1 text-center text-sm font-medium py-2.5 rounded-lg border border-stone-200 text-stone-700 hover:border-red-300 transition-colors cursor-pointer" onClick={() => setMobileOpen(false)}>
                                        Log in
                                    </Link>
                                    <Link href="/register" className="flex-1 text-center text-sm font-medium py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer" onClick={() => setMobileOpen(false)}>
                                        Sign up
                                    </Link>
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
                                    {user?.role === 'ADMIN' && (
                                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" onClick={() => setMobileOpen(false)}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}