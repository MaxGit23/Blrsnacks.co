'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ordersApi, type Order } from '@/lib/api';
import { Button, Badge, Card, Skeleton } from '@/components/ui';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/Toast';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand'> = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPED: 'brand',
    DELIVERED: 'success',
    CANCELLED: 'error',
};

export default function OrdersPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { addToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/orders');
        }
    }, [authLoading, isAuthenticated, router]);

    const fetchOrders = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        try {
            const res = await ordersApi.getMyOrders({
                status: statusFilter || undefined,
                page,
                limit: 10,
            });
            setOrders(res.data);
            setTotalPages(res.meta?.totalPages ?? 1);
        } catch {
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, statusFilter, page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCancel = async (orderId: string) => {
        setCancellingId(orderId);
        try {
            await ordersApi.cancelOrder(orderId);
            addToast('Order cancelled successfully', 'info');
            fetchOrders();
        } catch {
            addToast('Failed to cancel order', 'error');
        } finally {
            setCancellingId(null);
        }
    };

    if (authLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-[var(--radius-lg)]" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* ─── Profile Header ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-brand-secondary">My Orders</h1>
                    <p className="text-text-secondary mt-1">
                        Signed in as <span className="font-medium text-text-primary">{user?.email}</span>
                    </p>
                </div>
                <Link href="/products">
                    <Button variant="outline" size="sm">Continue Shopping</Button>
                </Link>
            </div>

            {/* ─── Status Filters ──────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => { setStatusFilter(status); setPage(1); }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-full)] border transition-all ${statusFilter === status
                                ? 'bg-brand-primary text-white border-brand-primary'
                                : 'bg-white text-text-secondary border-border-default hover:border-brand-primary/30'
                            }`}
                    >
                        {status || 'All'}
                    </button>
                ))}
            </div>

            {/* ─── Orders List ─────────────────────────────────────────────── */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full rounded-[var(--radius-lg)]" />)}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20">
                    <span className="text-5xl mb-4 block">📦</span>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">No orders found</h3>
                    <p className="text-text-secondary mb-6">
                        {statusFilter ? 'Try a different filter' : 'Start shopping to see your orders here'}
                    </p>
                    <Link href="/products">
                        <Button variant="primary">Browse Snacks</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} padding="none" className="overflow-hidden">
                            {/* Order header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bg-secondary border-b border-border-light gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-tertiary font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                                    <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    <span className="font-semibold text-text-primary text-sm">₹{Number(order.totalAmount).toFixed(0)}</span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="p-4">
                                <div className="flex flex-wrap gap-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 bg-bg-secondary rounded-[var(--radius-md)] pr-3">
                                            <div className="w-12 h-12 rounded-l-[var(--radius-md)] bg-bg-tertiary overflow-hidden shrink-0">
                                                {item.product.images?.length > 0 ? (
                                                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-lg opacity-30">📦</div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-text-primary line-clamp-1">{item.product.name}</span>
                                                <span className="text-xs text-text-tertiary">× {item.quantity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-light">
                                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                                        <span>💰 {order.paymentMethod}</span>
                                        <span>•</span>
                                        <span>{order.address?.city}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {order.status === 'PENDING' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                isLoading={cancellingId === order.id}
                                                onClick={() => handleCancel(order.id)}
                                                className="!text-error hover:!bg-error-light"
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm">View Details</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-2 text-sm rounded-[var(--radius-md)] border border-border-default hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Prev
                            </button>
                            <span className="text-sm text-text-secondary">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-2 text-sm rounded-[var(--radius-md)] border border-border-default hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
