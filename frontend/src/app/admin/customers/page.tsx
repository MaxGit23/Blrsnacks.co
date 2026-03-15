'use client';

import { useState, useEffect, useCallback } from 'react';
import { usersApi, type AdminUser } from '@/lib/api';
import { Badge, Card, Skeleton, Pagination, EmptyState, Input } from '@/components/ui';
import { formatDate } from '@/lib/format';

export default function AdminCustomersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await usersApi.getAll({ search: search || undefined, page, limit: 20 });
            // Handle both paginated and non-paginated responses
            if (Array.isArray(res)) {
                setUsers(res as unknown as AdminUser[]);
                setTotalPages(1);
                setTotalCount(res.length);
            } else {
                setUsers(res.data ?? []);
                setTotalPages(res.meta?.totalPages ?? 1);
                setTotalCount(res.meta?.total ?? res.data?.length ?? 0);
            }
        } catch {
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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
                    {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 rounded-[var(--radius-md)]" />)}
                </div>
            ) : users.length === 0 ? (
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
                                {users.map((user) => (
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
                                                    <div className="text-xs text-text-tertiary font-mono">{user.id.slice(0, 8)}</div>
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
                        {users.map((user) => (
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
