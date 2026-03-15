'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge, Card, Pagination, EmptyState, Input } from '@/components/ui';
import { formatDate } from '@/lib/format';

/* ── Demo data (remove when backend is connected) ──────────────────────── */
interface DemoUser {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    _count: { orders: number };
}

const DEMO_USERS: DemoUser[] = [
    { id: 'u-a1b2c3d4', email: 'priya.sharma@gmail.com', role: 'CUSTOMER', createdAt: '2026-02-15T10:00:00Z', _count: { orders: 8 } },
    { id: 'u-e5f6g7h8', email: 'rahul.k@outlook.com', role: 'CUSTOMER', createdAt: '2026-02-14T09:00:00Z', _count: { orders: 3 } },
    { id: 'u-i9j0k1l2', email: 'meena.r@yahoo.com', role: 'CUSTOMER', createdAt: '2026-02-12T14:00:00Z', _count: { orders: 12 } },
    { id: 'u-m3n4o5p6', email: 'karthik.n@gmail.com', role: 'CUSTOMER', createdAt: '2026-02-10T11:00:00Z', _count: { orders: 5 } },
    { id: 'u-q7r8s9t0', email: 'deepa.v@gmail.com', role: 'CUSTOMER', createdAt: '2026-02-08T16:00:00Z', _count: { orders: 2 } },
    { id: 'u-u1v2w3x4', email: 'admin@blrsnacks.co', role: 'ADMIN', createdAt: '2026-01-01T08:00:00Z', _count: { orders: 0 } },
    { id: 'u-y5z6a7b8', email: 'suresh.m@email.com', role: 'CUSTOMER', createdAt: '2026-02-20T13:00:00Z', _count: { orders: 1 } },
    { id: 'u-c9d0e1f2', email: 'anita.g@hotmail.com', role: 'CUSTOMER', createdAt: '2026-02-22T10:30:00Z', _count: { orders: 6 } },
    { id: 'u-g3h4i5j6', email: 'vijay.p@gmail.com', role: 'CUSTOMER', createdAt: '2026-02-18T15:00:00Z', _count: { orders: 4 } },
    { id: 'u-k7l8m9n0', email: 'lakshmi.s@yahoo.com', role: 'CUSTOMER', createdAt: '2026-02-25T09:45:00Z', _count: { orders: 0 } },
    { id: 'u-o1p2q3r4', email: 'ramesh.t@gmail.com', role: 'CUSTOMER', createdAt: '2026-02-05T12:00:00Z', _count: { orders: 9 } },
    { id: 'u-s5t6u7v8', email: 'kavya.d@outlook.com', role: 'CUSTOMER', createdAt: '2026-02-24T17:00:00Z', _count: { orders: 1 } },
];
/* ────────────────────────────────────────────────────────────────────────── */

export default function AdminCustomersPage() {
    const [users, setUsers] = useState<DemoUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const fetchUsers = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            let filtered = [...DEMO_USERS];
            if (search) {
                filtered = filtered.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));
            }
            setUsers(filtered);
            setIsLoading(false);
        }, 400);
    }, [search]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const totalCount = users.length;

    const roleVariant: Record<string, 'brand' | 'default'> = {
        ADMIN: 'brand',
        CUSTOMER: 'default',
    };

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-brand-secondary">Customers</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {totalCount > 0 ? `${totalCount} registered user${totalCount !== 1 ? 's' : ''}` : 'Manage your customer base'}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-sm">
                <Input
                    id="customer-search"
                    placeholder="Search by email..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            {/* Users */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 rounded-[var(--radius-md)] bg-bg-secondary animate-pulse" />)}
                </div>
            ) : paginatedUsers.length === 0 ? (
                <EmptyState
                    icon="👥"
                    title="No customers found"
                    description={search ? 'No users match your search' : 'Customers will appear here once they register'}
                />
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">User</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Role</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Orders</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-border-light hover:bg-bg-secondary/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 shrink-0 rounded-full bg-brand-primary-light flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-brand-primary">
                                                        {user.email.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium text-text-primary truncate">{user.email}</div>
                                                    <div className="text-xs text-text-tertiary font-mono">{user.id.slice(0, 10)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <Badge variant={roleVariant[user.role] ?? 'default'}>{user.role}</Badge>
                                        </td>
                                        <td className="py-3 px-4 text-center font-medium text-text-primary">
                                            {user._count?.orders ?? '—'}
                                        </td>
                                        <td className="py-3 px-4 text-text-tertiary text-xs">{formatDate(user.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {paginatedUsers.map((user) => (
                            <Card key={user.id} padding="none">
                                <div className="flex items-center gap-3 p-4">
                                    <div className="w-10 h-10 shrink-0 rounded-full bg-brand-primary-light flex items-center justify-center">
                                        <span className="text-sm font-bold text-brand-primary">
                                            {user.email.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-text-primary truncate">{user.email}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={roleVariant[user.role] ?? 'default'}>{user.role}</Badge>
                                            <span className="text-xs text-text-tertiary">{formatDate(user.createdAt)}</span>
                                        </div>
                                    </div>
                                    {user._count?.orders !== undefined && (
                                        <div className="shrink-0 text-center">
                                            <div className="text-lg font-bold text-text-primary">{user._count.orders}</div>
                                            <div className="text-[10px] text-text-tertiary">orders</div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                </>
            )}
        </div>
    );
}
