'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { formatPrice, formatDate } from '@/lib/format';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand'> = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPED: 'brand',
    DELIVERED: 'success',
    CANCELLED: 'error',
};

/* ── Demo data (remove when backend is connected) ──────────────────────── */
const DEMO_ORDERS = [
    { id: 'ord-a1b2c3d4', status: 'PENDING' as const, totalAmount: 549, createdAt: '2026-02-26T10:30:00Z', user: { email: 'priya@gmail.com' } },
    { id: 'ord-e5f6g7h8', status: 'CONFIRMED' as const, totalAmount: 1299, createdAt: '2026-02-26T09:15:00Z', user: { email: 'rahul@outlook.com' } },
    { id: 'ord-i9j0k1l2', status: 'SHIPPED' as const, totalAmount: 780, createdAt: '2026-02-25T18:45:00Z', user: { email: 'meena@yahoo.com' } },
    { id: 'ord-m3n4o5p6', status: 'DELIVERED' as const, totalAmount: 2150, createdAt: '2026-02-25T14:00:00Z', user: { email: 'karthik@gmail.com' } },
    { id: 'ord-q7r8s9t0', status: 'PENDING' as const, totalAmount: 430, createdAt: '2026-02-25T12:30:00Z', user: { email: 'deepa@gmail.com' } },
];

const DEMO_LOW_STOCK = [
    { id: 'inv-1', productId: 'p1', stock: 5, reservedStock: 3, product: { name: 'Classic Banana Chips (200g)', price: 149, images: [] } },
    { id: 'inv-2', productId: 'p2', stock: 0, reservedStock: 0, product: { name: 'Spicy Mixture (500g)', price: 299, images: [] } },
    { id: 'inv-3', productId: 'p3', stock: 8, reservedStock: 2, product: { name: 'Butter Murukku (250g)', price: 179, images: [] } },
    { id: 'inv-4', productId: 'p4', stock: 3, reservedStock: 1, product: { name: 'Mysore Pak (12 pcs)', price: 349, images: [] } },
];

const DEMO_STATS = {
    totalOrders: 156,
    totalRevenue: 85430,
    totalProducts: 48,
    totalCustomers: 312,
    pendingOrders: 12,
};
/* ────────────────────────────────────────────────────────────────────────── */

export default function AdminDashboardPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="p-6 md:p-8">
                <div className="h-8 w-48 mb-6 bg-bg-secondary rounded animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-[var(--radius-lg)] bg-bg-secondary animate-pulse" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 rounded-[var(--radius-lg)] bg-bg-secondary animate-pulse" />
                    <div className="h-80 rounded-[var(--radius-lg)] bg-bg-secondary animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-brand-secondary">Dashboard</h1>
                <p className="text-sm text-text-secondary mt-1">Overview of your store performance</p>
            </div>

            {/* ─── Stats Grid ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Orders', value: DEMO_STATS.totalOrders, icon: '🧾', href: '/admin/orders' },
                    { label: 'Revenue', value: formatPrice(DEMO_STATS.totalRevenue), icon: '💰', href: '/admin/orders' },
                    { label: 'Products', value: DEMO_STATS.totalProducts, icon: '🍌', href: '/admin/products' },
                    { label: 'Customers', value: DEMO_STATS.totalCustomers, icon: '👥', href: '/admin/customers' },
                ].map(({ label, value, icon, href }) => (
                    <Link key={label} href={href}>
                        <Card hoverable className="h-full">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-xs font-medium text-text-tertiary uppercase tracking-wider">{label}</div>
                                    <div className="text-2xl font-bold text-text-primary mt-1">{value}</div>
                                </div>
                                <span className="text-2xl">{icon}</span>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {DEMO_STATS.pendingOrders > 0 && (
                <div className="mb-6 px-4 py-3 bg-warning-light text-warning rounded-[var(--radius-md)] text-sm font-medium flex items-center gap-2">
                    <span>⚠️</span>
                    {DEMO_STATS.pendingOrders} order{DEMO_STATS.pendingOrders !== 1 ? 's' : ''} awaiting confirmation
                    <Link href="/admin/orders?status=PENDING" className="ml-auto underline hover:no-underline">
                        Review now →
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ─── Recent Orders ─────────────────────────────────────────── */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-text-primary">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-xs font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {DEMO_ORDERS.map((order) => (
                            <Link
                                key={order.id}
                                href={`/admin/orders`}
                                className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-bg-secondary transition-colors"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs font-mono text-text-tertiary">#{order.id.slice(4, 10).toUpperCase()}</span>
                                    <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-xs text-text-tertiary">{formatDate(order.createdAt)}</span>
                                    <span className="text-sm font-semibold text-text-primary">{formatPrice(order.totalAmount)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>

                {/* ─── Low Stock Alerts ──────────────────────────────────────── */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-text-primary">Low Stock Alerts</h3>
                        <Link href="/admin/inventory" className="text-xs font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
                            Manage inventory →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {DEMO_LOW_STOCK.map((item) => {
                            const available = item.stock - item.reservedStock;
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-bg-secondary"
                                >
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-text-primary truncate">{item.product.name}</div>
                                        <div className="text-xs text-text-tertiary">{formatPrice(item.product.price)}</div>
                                    </div>
                                    <div className="shrink-0">
                                        <Badge variant={available <= 0 ? 'error' : 'warning'}>
                                            {available <= 0 ? 'Out of stock' : `${available} left`}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}
