'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ordersApi, type Order } from '@/lib/api';
import { Button, Badge, Card, Skeleton, Pagination, EmptyState, Modal, Select, Textarea } from '@/components/ui';
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

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
    return (
        <Suspense>
            <OrdersContent />
        </Suspense>
    );
}

function OrdersContent() {
    const searchParams = useSearchParams();
    const { addToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Status update modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await ordersApi.getAll({
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
    }, [statusFilter, page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const openStatusUpdate = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setStatusNotes('');
        setShowStatusModal(true);
    };

    const handleStatusUpdate = async () => {
        if (!selectedOrder || !newStatus) return;
        setUpdatingStatus(true);
        try {
            await ordersApi.updateStatus(selectedOrder.id, newStatus, statusNotes || undefined);
            addToast(`Order #${selectedOrder.id.slice(0, 6).toUpperCase()} updated to ${newStatus}`, 'success');
            setShowStatusModal(false);
            fetchOrders();
        } catch {
            addToast('Failed to update order status', 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-brand-secondary">Orders</h1>
                <p className="text-sm text-text-secondary mt-1">Review and manage customer orders</p>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[{ value: '', label: 'All Orders' }, ...STATUS_OPTIONS].map(({ value, label }) => (
                    <button
                        key={value}
                        id={`admin-filter-${value || 'all'}`}
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

            {/* Orders */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-24 rounded-[var(--radius-lg)]" />)}
                </div>
            ) : orders.length === 0 ? (
                <EmptyState
                    icon="🧾"
                    title="No orders found"
                    description={statusFilter ? 'No orders match this filter' : 'Orders will appear here once customers start placing them'}
                />
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Order</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Customer</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Items</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Amount</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Date</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-border-light hover:bg-bg-secondary/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="text-xs font-mono text-text-primary font-medium">#{order.id.slice(0, 8).toUpperCase()}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm text-text-primary">{order.user?.email ?? '—'}</div>
                                            <div className="text-xs text-text-tertiary">{order.address?.city}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex -space-x-2">
                                                {order.items.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="w-8 h-8 rounded-full border-2 border-white bg-bg-secondary overflow-hidden">
                                                        {item.product.images?.length > 0 ? (
                                                            <img src={getImageUrl(item.product.images[0])} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px]">📦</div>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-bg-tertiary flex items-center justify-center text-[10px] font-medium text-text-tertiary">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right font-semibold text-text-primary">{formatPrice(Number(order.totalAmount))}</td>
                                        <td className="py-3 px-4 text-center">
                                            <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                                        </td>
                                        <td className="py-3 px-4 text-xs text-text-tertiary">{formatDate(order.createdAt)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => openStatusUpdate(order)}>
                                                Update
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {orders.map((order) => (
                            <Card key={order.id} padding="none" className="overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-text-primary font-medium">#{order.id.slice(0, 6).toUpperCase()}</span>
                                            <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                                        </div>
                                        <span className="text-sm font-bold text-text-primary">{formatPrice(Number(order.totalAmount))}</span>
                                    </div>
                                    <div className="text-xs text-text-tertiary mb-3">
                                        {order.user?.email} · {formatDate(order.createdAt)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-1">
                                            {order.items.slice(0, 4).map((item) => (
                                                <div key={item.id} className="w-7 h-7 rounded-full border-2 border-white bg-bg-secondary overflow-hidden">
                                                    {item.product.images?.length > 0 ? (
                                                        <img src={getImageUrl(item.product.images[0])} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px]">📦</div>
                                                    )}
                                                </div>
                                            ))}
                                            {order.items.length > 4 && (
                                                <span className="text-[10px] text-text-tertiary ml-1">+{order.items.length - 4}</span>
                                            )}
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => openStatusUpdate(order)}>
                                            Update Status
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                </>
            )}

            {/* ─── Status Update Modal ─────────────────────────────────────── */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Update Order Status"
                size="sm"
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="p-3 bg-bg-secondary rounded-[var(--radius-md)]">
                            <div className="text-xs text-text-tertiary">Order</div>
                            <div className="text-sm font-mono font-semibold text-text-primary">
                                #{selectedOrder.id.slice(0, 8).toUpperCase()}
                            </div>
                            <div className="text-xs text-text-tertiary mt-1">
                                {selectedOrder.user?.email} · {formatPrice(Number(selectedOrder.totalAmount))}
                            </div>
                        </div>

                        {/* Status timeline */}
                        {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                            <div className="border border-border-light rounded-[var(--radius-md)] p-3">
                                <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Status History</div>
                                <div className="space-y-2">
                                    {selectedOrder.statusHistory.slice(-3).map((h) => (
                                        <div key={h.id} className="flex items-center gap-2 text-xs">
                                            <Badge variant={statusVariant[h.status]}>{h.status}</Badge>
                                            <span className="text-text-tertiary">{formatDate(h.createdAt)}</span>
                                            {h.notes && <span className="text-text-secondary">— {h.notes}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Select
                            id="order-new-status"
                            label="New Status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            options={STATUS_OPTIONS}
                        />

                        <Textarea
                            id="status-notes"
                            label="Notes (optional)"
                            value={statusNotes}
                            onChange={(e) => setStatusNotes(e.target.value)}
                            placeholder="Add a note about this status change..."
                            rows={2}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="ghost" onClick={() => setShowStatusModal(false)}>Cancel</Button>
                            <Button id="save-status-btn" isLoading={updatingStatus} onClick={handleStatusUpdate}>
                                Update Status
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
