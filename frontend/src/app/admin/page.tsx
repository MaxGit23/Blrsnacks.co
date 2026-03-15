'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ordersApi, productsApi, inventoryApi, usersApi, type Order, type InventoryRecord } from '@/lib/api';
import { Card, Badge, Skeleton } from '@/components/ui';
import { formatPrice, formatDate } from '@/lib/format';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand'> = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPED: 'brand',
    DELIVERED: 'success',
    CANCELLED: 'error',
};

interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    pendingOrders: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [lowStock, setLowStock] = useState<InventoryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [ordersRes, productsRes, usersRes, lowStockRes] = await Promise.allSettled([
                    ordersApi.getAll({ limit: 5 }),
                    productsApi.getAll({ limit: 1 }),
                    usersApi.getAll({ limit: 1 }),
                    inventoryApi.getLowStock(15),
                ]);

                const orders = ordersRes.status === 'fulfilled' ? ordersRes.value : null;
                const products = productsRes.status === 'fulfilled' ? productsRes.value : null;
                const users = usersRes.status === 'fulfilled' ? usersRes.value : null;
                const lowStockData = lowStockRes.status === 'fulfilled' ? lowStockRes.value : [];

                setRecentOrders(orders?.data ?? []);
                setLowStock(Array.isArray(lowStockData) ? lowStockData : []);

                const allOrders = orders?.data ?? [];
                const pendingCount = allOrders.filter(o => o.status === 'PENDING').length;
                const revenue = allOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

                setStats({
                    totalOrders: orders?.meta?.total ?? allOrders.length,
                    totalRevenue: revenue,
                    totalProducts: products?.meta?.total ?? 0,
                    totalCustomers: users?.meta?.total ?? 0,
                    pendingOrders: pendingCount,
                });
            } catch {
                /* noop — individual failures handled by Promise.allSettled */
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    if (isLoading) {
        return (
            <div className="p-6 md:p-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-[var(--radius-lg)]" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-80 rounded-[var(--radius-lg)]" />
                    <Skeleton className="h-80 rounded-[var(--radius-lg)]" />
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
                    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: '🧾', href: '/admin/orders' },
                    { label: 'Revenue', value: formatPrice(stats?.totalRevenue ?? 0), icon: '💰', href: '/admin/orders' },
                    { label: 'Products', value: stats?.totalProducts ?? 0, icon: '🍌', href: '/admin/products' },
                    { label: 'Customers', value: stats?.totalCustomers ?? 0, icon: '👥', href: '/admin/customers' },
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

            {stats?.pendingOrders !== undefined && stats.pendingOrders > 0 && (
                <div className="mb-6 px-4 py-3 bg-warning-light text-warning rounded-[var(--radius-md)] text-sm font-medium flex items-center gap-2">
                    <span>⚠️</span>
                    {stats.pendingOrders} order{stats.pendingOrders !== 1 ? 's' : ''} awaiting confirmation
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
                    {recentOrders.length === 0 ? (
                        <p className="text-sm text-text-tertiary text-center py-6">No orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.slice(0, 5).map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/admin/orders`}
                                    className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-bg-secondary transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xs font-mono text-text-tertiary">#{order.id.slice(0, 6).toUpperCase()}</span>
                                        <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs text-text-tertiary">{formatDate(order.createdAt)}</span>
                                        <span className="text-sm font-semibold text-text-primary">{formatPrice(Number(order.totalAmount))}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </Card>

                {/* ─── Low Stock Alerts ──────────────────────────────────────── */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-text-primary">Low Stock Alerts</h3>
                        <Link href="/admin/inventory" className="text-xs font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
                            Manage inventory →
                        </Link>
                    </div>
                    {lowStock.length === 0 ? (
                        <div className="flex flex-col items-center py-6">
                            <span className="text-3xl mb-2">✅</span>
                            <p className="text-sm text-text-tertiary">All products are well-stocked</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {lowStock.slice(0, 5).map((item) => {
                                const available = item.stock - item.reservedStock;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-bg-secondary"
                                    >
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-text-primary truncate">{item.product.name}</div>
                                            <div className="text-xs text-text-tertiary">{formatPrice(Number(item.product.price))}</div>
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
                    )}
                </Card>
            </div>
        </div>
    );
}
