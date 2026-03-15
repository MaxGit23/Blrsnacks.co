'use client';

// import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useAuth } from '@/context/auth-context';
// import { Skeleton } from '@/components/ui';

const NAV_ITEMS = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/products', icon: '🍌', label: 'Products' },
    { href: '/admin/inventory', icon: '📦', label: 'Inventory' },
    { href: '/admin/orders', icon: '🧾', label: 'Orders' },
    { href: '/admin/customers', icon: '👥', label: 'Customers' },
];

/* ── TODO: Restore auth check before going to production ───────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // const router = useRouter();
    // const { user, isAuthenticated, isLoading } = useAuth();
    const user = { email: 'admin@blrsnacks.co', role: 'ADMIN' };

    // useEffect(() => {
    //     if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
    //         router.push('/login?redirect=/admin');
    //     }
    // }, [isLoading, isAuthenticated, user, router]);

    const isActive = (href: string) =>
        href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex">
            {/* ─── Sidebar ─────────────────────────────────────────────────── */}
            <aside className="hidden md:flex w-64 shrink-0 flex-col bg-bg-secondary border-r border-border-light">
                <div className="p-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-4">Admin Panel</h2>
                    <nav className="space-y-1">
                        {NAV_ITEMS.map(({ href, icon, label }) => (
                            <Link
                                key={href}
                                href={href}
                                id={`admin-nav-${label.toLowerCase()}`}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all ${isActive(href)
                                    ? 'bg-brand-primary text-white shadow-sm'
                                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                                    }`}
                            >
                                <span>{icon}</span>
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-border-light">
                    <div className="text-xs text-text-tertiary">Logged in as</div>
                    <div className="text-sm font-medium text-text-primary truncate">{user?.email}</div>
                </div>
            </aside>

            {/* ─── Mobile Nav ──────────────────────────────────────────────── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border-light">
                <nav className="flex justify-around py-2">
                    {NAV_ITEMS.map(({ href, icon, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${isActive(href) ? 'text-brand-primary' : 'text-text-tertiary'
                                }`}
                        >
                            <span className="text-lg">{icon}</span>
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* ─── Content ─────────────────────────────────────────────────── */}
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {children}
            </main>
        </div>
    );
}
