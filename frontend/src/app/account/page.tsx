'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ordersApi, type Order } from '@/lib/api';
import { Button, Badge, Card, Skeleton } from '@/components/ui';
import { Container, PageHeader } from '@/components/layout';
import { useAuth } from '@/context/auth-context';
import { formatPrice, formatDate } from '@/lib/format';
import { getImageUrl } from '@/lib/images';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand'> = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPED: 'brand',
    DELIVERED: 'success',
    CANCELLED: 'error',
};

export default function AccountPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [orderStats, setOrderStats] = useState({ total: 0, totalSpent: 0 });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/account');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const loadOrders = async () => {
            try {
                const res = await ordersApi.getMyOrders({ limit: 5 });
                setRecentOrders(res.data);
                setOrderStats({
                    total: res.meta?.total ?? res.data.length,
                    totalSpent: res.data.reduce((sum, o) => sum + Number(o.totalAmount), 0),
                });
            } catch {
                setRecentOrders([]);
            } finally {
                setOrdersLoading(false);
            }
        };
        loadOrders();
    }, [isAuthenticated]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (authLoading) {
        return (
            <Container size="md" className="py-8">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-[var(--radius-lg)]" />)}
                </div>
                <Skeleton className="h-64 rounded-[var(--radius-lg)]" />
            </Container>
        );
    }

    return (
        <Container size="md" className="py-8 animate-fade-in">
            <PageHeader title="My Account" description={`Welcome back, ${user?.email ?? 'there'}!`}>
                <Button id="logout-btn" variant="ghost" size="sm" onClick={handleLogout} className="!text-error">
                    Sign Out
                </Button>
            </PageHeader>

            {/* ─── Account Overview Cards ───────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <Card className="text-center">
                    <div className="text-3xl font-bold text-brand-primary">{orderStats.total}</div>
                    <div className="text-sm text-text-secondary mt-1">Total Orders</div>
                </Card>
                <Card className="text-center">
                    <div className="text-3xl font-bold text-brand-primary">{formatPrice(orderStats.totalSpent)}</div>
                    <div className="text-sm text-text-secondary mt-1">Total Spent</div>
                </Card>
                <Card className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-success-light text-success text-sm font-semibold rounded-[var(--radius-full)]">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        Active
                    </div>
                    <div className="text-sm text-text-secondary mt-2">Account Status</div>
                </Card>
            </div>

            {/* ─── Account Details ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <Card className="lg:col-span-1">
                    <h3 className="text-base font-semibold text-text-primary mb-4">Profile Details</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Email</label>
                            <p className="text-sm text-text-primary mt-0.5">{user?.email}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Role</label>
                            <p className="text-sm text-text-primary mt-0.5 capitalize">{user?.role?.toLowerCase()}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Member Since</label>
                            <p className="text-sm text-text-primary mt-0.5">{user?.createdAt ? formatDate(user.createdAt) : '—'}</p>
                        </div>
                    </div>
                </Card>

                {/* Quick Links */}
                <Card className="lg:col-span-2">
                    <h3 className="text-base font-semibold text-text-primary mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { href: '/orders', icon: '📦', label: 'View All Orders', desc: 'Track and manage your orders' },
                            { href: '/cart', icon: '🛒', label: 'My Cart', desc: 'Continue where you left off' },
                            { href: '/products', icon: '🍌', label: 'Browse Snacks', desc: 'Discover new favourites' },
                            { href: '/categories', icon: '📁', label: 'Categories', desc: 'Shop by snack type' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                id={`quick-${link.href.replace('/', '')}`}
                                className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-border-light hover:border-brand-primary/30 hover:bg-brand-primary-light/50 transition-all group"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                                <div>
                                    <div className="text-sm font-medium text-text-primary group-hover:text-brand-primary transition-colors">{link.label}</div>
                                    <div className="text-xs text-text-tertiary">{link.desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>

            {/* ─── Recent Orders ────────────────────────────────────────────── */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Recent Orders</h3>
                    <Link href="/orders" className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
                        View all →
                    </Link>
                </div>

                {ordersLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-[var(--radius-lg)]" />)}
                    </div>
                ) : recentOrders.length === 0 ? (
                    <Card className="text-center py-10">
                        <span className="text-4xl mb-3 block">📦</span>
                        <p className="text-sm text-text-secondary">No orders yet — your order history will appear here</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <Link key={order.id} href={`/orders/${order.id}`}>
                                <Card hoverable padding="none" className="overflow-hidden">
                                    <div className="flex items-center gap-4 p-4">
                                        {/* First item thumbnail */}
                                        <div className="w-12 h-12 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden">
                                            {order.items[0]?.product.images?.length > 0 ? (
                                                <img
                                                    src={getImageUrl(order.items[0].product.images[0])}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <img src="/placeholder-product.svg" alt="" className="w-6 h-6 opacity-40" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-text-primary">
                                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                </span>
                                                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                                            </div>
                                            <p className="text-xs text-text-tertiary mt-0.5">
                                                {formatDate(order.createdAt)} · #{order.id.slice(0, 8).toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-sm font-bold text-text-primary">{formatPrice(Number(order.totalAmount))}</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
}
