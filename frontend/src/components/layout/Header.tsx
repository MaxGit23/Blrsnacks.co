'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import Button from '@/components/ui/Button';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border-light">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold text-brand-secondary hover:text-brand-primary transition-colors"
                    >
                        <span className="text-2xl">🍌</span>
                        <span>BLR Snacks</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/products"
                            className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
                        >
                            Shop
                        </Link>
                        <Link
                            href="/categories"
                            className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
                        >
                            Categories
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/cart"
                            className="relative p-2 rounded-[var(--radius-md)] text-text-secondary hover:text-brand-primary hover:bg-bg-tertiary transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/orders"
                                    className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
                                >
                                    Orders
                                </Link>
                                {user?.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 rounded-[var(--radius-md)] text-text-secondary hover:bg-bg-tertiary"
                        onClick={() => setMobileOpen(!mobileOpen)}
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

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="md:hidden py-4 border-t border-border-light animate-fade-in-up">
                        <div className="flex flex-col gap-3">
                            <Link href="/products" className="text-sm font-medium text-text-secondary hover:text-brand-primary px-2 py-1.5">Shop</Link>
                            <Link href="/categories" className="text-sm font-medium text-text-secondary hover:text-brand-primary px-2 py-1.5">Categories</Link>
                            <Link href="/cart" className="text-sm font-medium text-text-secondary hover:text-brand-primary px-2 py-1.5">Cart</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link href="/orders" className="text-sm font-medium text-text-secondary hover:text-brand-primary px-2 py-1.5">Orders</Link>
                                    <button onClick={logout} className="text-left text-sm font-medium text-error px-2 py-1.5">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-brand-primary px-2 py-1.5">Login</Link>
                                    <Link href="/register" className="text-sm font-medium text-brand-primary px-2 py-1.5">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
