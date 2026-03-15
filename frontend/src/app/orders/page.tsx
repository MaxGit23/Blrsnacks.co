'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ordersApi, type Order } from '@/lib/api';
import { Button, Badge, Card, Skeleton, Pagination, EmptyState } from '@/components/ui';
import { Container, PageHeader } from '@/components/layout';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/format';
import { getImageUrl } from '@/lib/images';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand'> = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPED: 'brand',
    DELIVERED: 'success',
    CANCELLED: 'error',
};

const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
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
            addToast('Could not cancel this order', 'error');
        } finally {
            setCancellingId(null);
        }
    };

    if (authLoading) {
        return (
            <Container size="md" className="py-8">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-[var(--radius-lg)]" />)}
                </div>
            </Container>
        );
    }

    return (
        <Container size="md" className="py-8 animate-fade-in">
            <PageHeader title="My Orders" description={`Signed in as ${user?.email ?? ''}`}>
                <Link href="/products">
                    <Button variant="outline" size="sm">Continue Shopping</Button>
                </Link>
            </PageHeader>

            {/* ─── Status Filters ──────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { value: '', label: 'All Orders' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'CONFIRMED', label: 'Confirmed' },
                    { value: 'SHIPPED', label: 'Shipped' },
                    { value: 'DELIVERED', label: 'Delivered' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                ].map(({ value, label }) => (
                    <button
                        key={value}
                        id={`filter-${value || 'all'}`}
                        onClick={() => { setStatusFilter(value); setPage(1); }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-full)] border transition-all ${statusFilter === value
                                ? 'bg-brand-primary text-white border-brand-primary'
                                : 'bg-white text-text-secondary border-border-default hover:border-brand-primary/30'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ─── Orders List ─────────────────────────────────────────────── */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full rounded-[var(--radius-lg)]" />)}
                </div>
            ) : orders.length === 0 ? (
                <EmptyState
                    icon="📦"
                    title="No orders found"
                    description={statusFilter ? 'No orders match this filter — try a different one' : 'You haven\'t placed any orders yet. Browse our snacks collection to get started!'}
                    actionLabel="Browse Snacks"
                    actionHref="/products"
                />
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} padding="none" className="overflow-hidden">
                            {/* Order header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bg-secondary border-b border-border-light gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-tertiary font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                                    <Badge variant={statusVariant[order.status]}>{statusLabels[order.status] ?? order.status}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                                    <span>{formatDate(order.createdAt)}</span>
                                    <span className="font-semibold text-text-primary text-sm">{formatPrice(Number(order.totalAmount))}</span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="p-4">
                                <div className="flex flex-wrap gap-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 bg-bg-secondary rounded-[var(--radius-md)] pr-3">
                                            <div className="w-12 h-12 rounded-l-[var(--radius-md)] bg-bg-tertiary overflow-hidden shrink-0">
                                                {item.product.images?.length > 0 ? (
                                                    <img src={getImageUrl(item.product.images[0])} alt={item.product.name} className="w-full h-full object-cover" loading="lazy" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <img src="/placeholder-product.svg" alt="" className="w-6 h-6 opacity-40" />
                                                    </div>
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

                    <div className="mt-8">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            )}
        </Container>
    );
}
