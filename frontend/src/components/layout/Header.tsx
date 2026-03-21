'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import Button from '@/components/ui/Button';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Dropdown states
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userDropdownRef]);

    return (
        <div className="sticky top-0 z-50 flex flex-col w-full shadow-sm">
            {/* Announcement Bar */}
            <div className="w-full bg-brand-primary text-white text-xs sm:text-sm font-medium py-1.5 px-4 text-center tracking-wide">
                Free delivery on all orders over ₹500! Use code BLRSNACKS🚚
            </div>

            {/* Main Header / Navigation */}
            <header className="bg-white/95 backdrop-blur-lg border-b border-border-light relative">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex items-center w-auto xl:w-1/4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xl font-bold text-brand-secondary hover:text-brand-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md"
                        >

                            <span className="tracking-tight hidden sm:block font-sans font-bold">BLR Snacks</span>
                        </Link>
                    </div>

                    {/* Center: Desktop Nav Links */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-6 font-mabry">
                        <Link
                            href="/categories/chips"
                            className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors py-2 whitespace-nowrap"
                        >
                            Chips & Wafers
                        </Link>

                        <Link
                            href="/categories/mixtures"
                            className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors py-2 whitespace-nowrap"
                        >
                            Mixtures
                        </Link>

                        <Link
                            href="/categories/sweets"
                            className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors py-2 whitespace-nowrap"
                        >
                            Sweets
                        </Link>

                        <Link
                            href="/categories/other-condiments"
                            className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors py-2 whitespace-nowrap"
                        >
                            Other Condiments
                        </Link>

                        <Link
                            href="/products"
                            className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors py-2 whitespace-nowrap"
                        >
                            Shop All
                        </Link>
                    </div>

                    {/* Right: Actions / Icons */}
                    <div className="flex-shrink-0 flex items-center justify-end gap-2 md:gap-4 w-auto xl:w-1/4">
                        {/* Search Icon (Mock) */}
                        <button className="hidden sm:block p-2 text-text-secondary hover:text-brand-primary transition-colors focus:outline-none rounded-full hover:bg-bg-tertiary" aria-label="Search">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Account Icon Dropdown */}
                        <div className="relative hidden lg:block" ref={userDropdownRef}>
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="p-2 text-text-secondary hover:text-brand-primary transition-colors focus:outline-none rounded-full hover:bg-bg-tertiary"
                                aria-label="Account"
                                aria-expanded={userDropdownOpen}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>

                            {userDropdownOpen && (
                                <div className="absolute top-full right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 animate-fade-in-up origin-top-right py-1">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="block px-4 py-2 text-xs text-text-tertiary font-semibold uppercase tracking-wider border-b border-border-light mb-1 truncate">
                                                {user?.email || 'My Account'}
                                            </div>
                                            <Link href="/orders" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-brand-primary" onClick={() => setUserDropdownOpen(false)}>My Orders</Link>
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-brand-primary" onClick={() => setUserDropdownOpen(false)}>Account Settings</Link>
                                            {user?.role === 'ADMIN' && (
                                                <Link href="/admin" className="block px-4 py-2 text-sm font-medium text-brand-primary hover:bg-bg-secondary" onClick={() => setUserDropdownOpen(false)}>Admin Dashboard</Link>
                                            )}
                                            <button
                                                onClick={() => { logout(); setUserDropdownOpen(false); }}
                                                className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-bg-secondary mt-1 border-t border-border-light pt-2"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-brand-primary" onClick={() => setUserDropdownOpen(false)}>Sign In</Link>
                                            <Link href="/register" className="block px-4 py-2 text-sm font-medium text-brand-primary hover:bg-bg-secondary" onClick={() => setUserDropdownOpen(false)}>Create Account</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart Icon */}
                        <Link
                            href="/cart"
                            className="relative p-2 rounded-full text-text-secondary hover:text-brand-primary hover:bg-bg-tertiary transition-all focus:outline-none flex-shrink-0"
                            aria-label="Cart"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 -mr-2 rounded-md text-text-secondary hover:bg-bg-tertiary focus:outline-none"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
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

                {/* Mobile Navigation Menu */}
                {mobileOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-b border-border-light animate-fade-in-down z-50">
                        <div className="px-4 pt-2 pb-6 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-80px)]">
                            {/* Mobile User Greeting/Auth */}
                            {isAuthenticated ? (
                                <div className="py-3 px-2 mb-2 border-b border-border-light flex justify-between items-center">
                                    <span className="text-sm font-semibold text-text-primary capitalize truncate pr-4">
                                        Hi, {user?.email?.split('@')[0] || 'Snacker'}
                                    </span>
                                    <button onClick={() => { logout(); setMobileOpen(false); }} className="text-xs font-medium text-error py-1 px-3 border border-error/50 rounded-full hover:bg-error/5">
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <div className="py-3 px-2 mb-2 border-b border-border-light flex gap-3">
                                    <Link href="/login" className="flex-1 text-center text-sm font-medium py-2 rounded-md border border-border-light text-text-secondary" onClick={() => setMobileOpen(false)}>Log in</Link>
                                    <Link href="/register" className="flex-1 text-center text-sm font-medium py-2 rounded-md bg-brand-primary text-white" onClick={() => setMobileOpen(false)}>Sign up</Link>
                                </div>
                            )}

                            {/* Mobile Links */}
                            <div className="flex flex-col gap-1 mt-1 font-mabry">
                                <Link href="/" className="text-base font-medium text-text-primary hover:text-brand-primary hover:bg-bg-secondary px-3 py-3 rounded-md transition-colors" onClick={() => setMobileOpen(false)}>Home</Link>
                                <Link href="/products" className="text-base font-medium text-text-primary hover:text-brand-primary hover:bg-bg-secondary px-3 py-3 rounded-md transition-colors" onClick={() => setMobileOpen(false)}>Shop All</Link>
                                <Link href="/categories/chips" className="text-base font-medium text-text-primary hover:text-brand-primary hover:bg-bg-secondary px-3 py-3 rounded-md transition-colors" onClick={() => setMobileOpen(false)}>Chips & Wafers</Link>
                                <Link href="/categories/mixtures" className="text-base font-medium text-text-primary hover:text-brand-primary hover:bg-bg-secondary px-3 py-3 rounded-md transition-colors" onClick={() => setMobileOpen(false)}>Mixtures</Link>
                                <Link href="/categories/sweets" className="text-base font-medium text-text-primary hover:text-brand-primary hover:bg-bg-secondary px-3 py-3 rounded-md transition-colors" onClick={() => setMobileOpen(false)}>Sweets</Link>
                            </div>

                            {/* Mobile account links */}
                            {isAuthenticated && (
                                <div className="mt-4 pt-4 border-t border-border-light flex flex-col gap-1">
                                    <Link href="/orders" className="text-base font-medium text-text-primary hover:bg-bg-secondary px-3 py-3 rounded-md" onClick={() => setMobileOpen(false)}>My Orders</Link>
                                    <Link href="/profile" className="text-base font-medium text-text-primary hover:bg-bg-secondary px-3 py-3 rounded-md" onClick={() => setMobileOpen(false)}>Account Settings</Link>
                                    {user?.role === 'ADMIN' && (
                                        <Link href="/admin" className="text-base font-semibold text-brand-primary hover:bg-bg-secondary px-3 py-3 rounded-md" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
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
