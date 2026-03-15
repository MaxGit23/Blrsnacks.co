'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button, Badge, Card, Pagination, EmptyState, Modal, Select, Textarea } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/format';

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

/* ── Demo data (remove when backend is connected) ──────────────────────── */
const DEMO_ORDERS = [
    { id: 'ord-a1b2c3d4e5f6', status: 'PENDING' as const, totalAmount: 549, createdAt: '2026-02-26T10:30:00Z', user: { id: 'u1', email: 'priya.sharma@gmail.com' }, address: { street: '12 MG Road', city: 'Bangalore', state: 'Karnataka', zip: '560001', country: 'IN' }, items: [{ id: 'oi1', productId: 'p1', quantity: 2, priceAtPurchase: 149, product: { id: 'p1', name: 'Classic Banana Chips', slug: 'classic-banana-chips', images: [] } }, { id: 'oi2', productId: 'p3', quantity: 1, priceAtPurchase: 179, product: { id: 'p3', name: 'Butter Murukku', slug: 'butter-murukku', images: [] } }], statusHistory: [{ id: 'sh1', status: 'PENDING', notes: null, createdBy: null, createdAt: '2026-02-26T10:30:00Z' }] },
    { id: 'ord-e5f6g7h8i9j0', status: 'CONFIRMED' as const, totalAmount: 1299, createdAt: '2026-02-26T09:15:00Z', user: { id: 'u2', email: 'rahul.k@outlook.com' }, address: { street: '45 Koramangala', city: 'Bangalore', state: 'Karnataka', zip: '560034', country: 'IN' }, items: [{ id: 'oi3', productId: 'p6', quantity: 2, priceAtPurchase: 499, product: { id: 'p6', name: 'Cashew Mix', slug: 'cashew-mix', images: [] } }, { id: 'oi4', productId: 'p4', quantity: 1, priceAtPurchase: 349, product: { id: 'p4', name: 'Mysore Pak', slug: 'mysore-pak', images: [] } }], statusHistory: [{ id: 'sh2', status: 'PENDING', notes: null, createdBy: null, createdAt: '2026-02-26T09:00:00Z' }, { id: 'sh3', status: 'CONFIRMED', notes: 'Payment verified', createdBy: 'admin', createdAt: '2026-02-26T09:15:00Z' }] },
    { id: 'ord-k1l2m3n4o5p6', status: 'SHIPPED' as const, totalAmount: 780, createdAt: '2026-02-25T18:45:00Z', user: { id: 'u3', email: 'meena.r@yahoo.com' }, address: { street: '78 Indiranagar', city: 'Bangalore', state: 'Karnataka', zip: '560038', country: 'IN' }, items: [{ id: 'oi5', productId: 'p5', quantity: 3, priceAtPurchase: 169, product: { id: 'p5', name: 'Pepper Banana Chips', slug: 'pepper-banana-chips', images: [] } }, { id: 'oi6', productId: 'p8', quantity: 1, priceAtPurchase: 249, product: { id: 'p8', name: 'Filter Coffee', slug: 'filter-coffee', images: [] } }], statusHistory: [{ id: 'sh4', status: 'PENDING', notes: null, createdBy: null, createdAt: '2026-02-25T18:00:00Z' }, { id: 'sh5', status: 'CONFIRMED', notes: null, createdBy: 'admin', createdAt: '2026-02-25T18:30:00Z' }, { id: 'sh6', status: 'SHIPPED', notes: 'Tracking: BLR2026X45', createdBy: 'admin', createdAt: '2026-02-25T18:45:00Z' }] },
    { id: 'ord-q7r8s9t0u1v2', status: 'DELIVERED' as const, totalAmount: 2150, createdAt: '2026-02-25T14:00:00Z', user: { id: 'u4', email: 'karthik.n@gmail.com' }, address: { street: '22 HSR Layout', city: 'Bangalore', state: 'Karnataka', zip: '560102', country: 'IN' }, items: [{ id: 'oi7', productId: 'p9', quantity: 4, priceAtPurchase: 329, product: { id: 'p9', name: 'Salt Banana Chips', slug: 'salt-banana-chips', images: [] } }, { id: 'oi8', productId: 'p4', quantity: 2, priceAtPurchase: 349, product: { id: 'p4', name: 'Mysore Pak', slug: 'mysore-pak', images: [] } }], statusHistory: [{ id: 'sh7', status: 'DELIVERED', notes: 'Signed by customer', createdBy: 'delivery', createdAt: '2026-02-25T14:00:00Z' }] },
    { id: 'ord-w3x4y5z6a7b8', status: 'PENDING' as const, totalAmount: 430, createdAt: '2026-02-25T12:30:00Z', user: { id: 'u5', email: 'deepa.v@gmail.com' }, address: { street: '56 Jayanagar', city: 'Bangalore', state: 'Karnataka', zip: '560041', country: 'IN' }, items: [{ id: 'oi9', productId: 'p10', quantity: 2, priceAtPurchase: 159, product: { id: 'p10', name: 'Ribbon Pakoda', slug: 'ribbon-pakoda', images: [] } }, { id: 'oi10', productId: 'p7', quantity: 1, priceAtPurchase: 129, product: { id: 'p7', name: 'Jaggery Peanut Bar', slug: 'jaggery-peanut-bar', images: [] } }], statusHistory: [{ id: 'sh8', status: 'PENDING', notes: null, createdBy: null, createdAt: '2026-02-25T12:30:00Z' }] },
    { id: 'ord-c9d0e1f2g3h4', status: 'CANCELLED' as const, totalAmount: 598, createdAt: '2026-02-24T16:20:00Z', user: { id: 'u6', email: 'suresh.m@email.com' }, address: { street: '90 Whitefield', city: 'Bangalore', state: 'Karnataka', zip: '560066', country: 'IN' }, items: [{ id: 'oi11', productId: 'p2', quantity: 2, priceAtPurchase: 299, product: { id: 'p2', name: 'Spicy Mixture', slug: 'spicy-mixture', images: [] } }], statusHistory: [{ id: 'sh9', status: 'PENDING', notes: null, createdBy: null, createdAt: '2026-02-24T16:00:00Z' }, { id: 'sh10', status: 'CANCELLED', notes: 'Customer requested cancellation', createdBy: 'admin', createdAt: '2026-02-24T16:20:00Z' }] },
];
/* ────────────────────────────────────────────────────────────────────────── */

export default function AdminOrdersPage() {
    return (
        <Suspense>
            <OrdersContent />
        </Suspense>
    );
}

function OrdersContent() {
    const { addToast } = useToast();
    const [orders, setOrders] = useState(DEMO_ORDERS);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Status update modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<typeof DEMO_ORDERS[0] | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            let filtered = [...DEMO_ORDERS];
            if (statusFilter) {
                filtered = filtered.filter(o => o.status === statusFilter);
            }
            setOrders(filtered);
            setIsLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [statusFilter]);

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const paginatedOrders = orders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const openStatusUpdate = (order: typeof DEMO_ORDERS[0]) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setStatusNotes('');
        setShowStatusModal(true);
    };

    const handleStatusUpdate = async () => {
        if (!selectedOrder || !newStatus) return;
        setUpdatingStatus(true);
        await new Promise(r => setTimeout(r, 800));
        addToast(`Order #${selectedOrder.id.slice(4, 10).toUpperCase()} updated to ${newStatus} (demo)`, 'success');
        setShowStatusModal(false);
        setUpdatingStatus(false);
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
                    {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-24 rounded-[var(--radius-lg)] bg-bg-secondary animate-pulse" />)}
                </div>
            ) : paginatedOrders.length === 0 ? (
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
                                {paginatedOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-border-light hover:bg-bg-secondary/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="text-xs font-mono text-text-primary font-medium">#{order.id.slice(4, 12).toUpperCase()}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm text-text-primary">{order.user?.email ?? '—'}</div>
                                            <div className="text-xs text-text-tertiary">{order.address?.city}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex -space-x-2">
                                                {order.items.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="w-8 h-8 rounded-full border-2 border-white bg-bg-secondary overflow-hidden flex items-center justify-center text-[10px]">
                                                        📦
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-bg-tertiary flex items-center justify-center text-[10px] font-medium text-text-tertiary">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right font-semibold text-text-primary">{formatPrice(order.totalAmount)}</td>
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
                        {paginatedOrders.map((order) => (
                            <Card key={order.id} padding="none" className="overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-text-primary font-medium">#{order.id.slice(4, 10).toUpperCase()}</span>
                                            <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                                        </div>
                                        <span className="text-sm font-bold text-text-primary">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                    <div className="text-xs text-text-tertiary mb-3">
                                        {order.user?.email} · {formatDate(order.createdAt)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-1">
                                            {order.items.slice(0, 4).map((item) => (
                                                <div key={item.id} className="w-7 h-7 rounded-full border-2 border-white bg-bg-secondary overflow-hidden flex items-center justify-center text-[10px]">
                                                    📦
                                                </div>
                                            ))}
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
                                #{selectedOrder.id.slice(4, 12).toUpperCase()}
                            </div>
                            <div className="text-xs text-text-tertiary mt-1">
                                {selectedOrder.user?.email} · {formatPrice(selectedOrder.totalAmount)}
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
