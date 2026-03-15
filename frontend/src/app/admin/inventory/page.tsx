'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Badge, Card, Pagination, EmptyState, Input, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/format';

/* ── Demo data (remove when backend is connected) ──────────────────────── */
interface DemoProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    inventory: { stock: number; reservedStock: number };
}

const DEMO_PRODUCTS: DemoProduct[] = [
    { id: 'p1', name: 'Classic Banana Chips (200g)', price: 149, images: [], inventory: { stock: 5, reservedStock: 3 } },
    { id: 'p2', name: 'Spicy Mixture (500g)', price: 299, images: [], inventory: { stock: 0, reservedStock: 0 } },
    { id: 'p3', name: 'Butter Murukku (250g)', price: 179, images: [], inventory: { stock: 45, reservedStock: 5 } },
    { id: 'p4', name: 'Mysore Pak (12 pcs)', price: 349, images: [], inventory: { stock: 20, reservedStock: 8 } },
    { id: 'p5', name: 'Pepper Banana Chips (200g)', price: 169, images: [], inventory: { stock: 60, reservedStock: 12 } },
    { id: 'p6', name: 'Cashew Mix (250g)', price: 499, images: [], inventory: { stock: 30, reservedStock: 5 } },
    { id: 'p7', name: 'Jaggery Peanut Bar (6 pcs)', price: 129, images: [], inventory: { stock: 100, reservedStock: 0 } },
    { id: 'p8', name: 'Filter Coffee Powder (200g)', price: 249, images: [], inventory: { stock: 35, reservedStock: 10 } },
    { id: 'p9', name: 'Salt Banana Chips (500g)', price: 329, images: [], inventory: { stock: 15, reservedStock: 3 } },
    { id: 'p10', name: 'Ribbon Pakoda (250g)', price: 159, images: [], inventory: { stock: 40, reservedStock: 8 } },
];

const DEMO_LOW_STOCK = DEMO_PRODUCTS.filter(p => (p.inventory.stock - p.inventory.reservedStock) <= 15)
    .map((p, i) => ({
        id: `inv-${i}`,
        productId: p.id,
        stock: p.inventory.stock,
        reservedStock: p.inventory.reservedStock,
        product: { name: p.name, price: p.price, images: [] as string[] },
    }));
/* ────────────────────────────────────────────────────────────────────────── */

export default function AdminInventoryPage() {
    const { addToast } = useToast();
    const [products, setProducts] = useState<DemoProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 15;
    const [viewMode, setViewMode] = useState<'all' | 'low'>('all');

    // Update modal
    const [showUpdate, setShowUpdate] = useState(false);
    const [updatingProduct, setUpdatingProduct] = useState<DemoProduct | null>(null);
    const [newStock, setNewStock] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchProducts = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            let filtered = [...DEMO_PRODUCTS];
            if (search) {
                filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
            }
            setProducts(filtered);
            setIsLoading(false);
        }, 400);
    }, [search]);

    useEffect(() => {
        if (viewMode === 'all') {
            fetchProducts();
        } else {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 400);
        }
    }, [viewMode, fetchProducts]);

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const paginatedProducts = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const openUpdate = (product: DemoProduct) => {
        setUpdatingProduct(product);
        setNewStock(String(product.inventory?.stock ?? 0));
        setShowUpdate(true);
    };

    const handleUpdateStock = async () => {
        if (!updatingProduct || !newStock || isNaN(Number(newStock))) return;
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        addToast(`Stock updated for ${updatingProduct.name} (demo)`, 'success');
        setShowUpdate(false);
        setSaving(false);
    };

    const getStockLevel = (product: DemoProduct) => {
        if (!product.inventory) return { available: 0, total: 0, reserved: 0 };
        return {
            available: product.inventory.stock - product.inventory.reservedStock,
            total: product.inventory.stock,
            reserved: product.inventory.reservedStock,
        };
    };

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-brand-secondary">Inventory</h1>
                    <p className="text-sm text-text-secondary mt-1">Track stock levels and manage inventory</p>
                </div>
            </div>

            {/* View Toggle + Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="flex rounded-[var(--radius-md)] border border-border-default overflow-hidden">
                    <button
                        id="view-all"
                        onClick={() => setViewMode('all')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'all' ? 'bg-brand-primary text-white' : 'bg-white text-text-secondary hover:bg-bg-tertiary'}`}
                    >
                        All Products
                    </button>
                    <button
                        id="view-low"
                        onClick={() => setViewMode('low')}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-l border-border-default ${viewMode === 'low' ? 'bg-brand-primary text-white' : 'bg-white text-text-secondary hover:bg-bg-tertiary'}`}
                    >
                        ⚠️ Low Stock
                    </button>
                </div>
                {viewMode === 'all' && (
                    <div className="w-full sm:w-auto sm:max-w-xs">
                        <Input
                            id="inventory-search"
                            placeholder="Search by product name..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 rounded-[var(--radius-md)] bg-bg-secondary animate-pulse" />)}
                </div>
            ) : viewMode === 'low' ? (
                /* Low stock view */
                DEMO_LOW_STOCK.length === 0 ? (
                    <EmptyState
                        icon="✅"
                        title="All products well-stocked"
                        description="No products are below the low-stock threshold (15 units)"
                    />
                ) : (
                    <div className="space-y-3">
                        {DEMO_LOW_STOCK.map((item) => {
                            const available = item.stock - item.reservedStock;
                            return (
                                <Card key={item.id} padding="none" className="overflow-hidden">
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="w-12 h-12 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden flex items-center justify-center">
                                            <img src="/placeholder-product.svg" alt="" className="w-6 h-6 opacity-40" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-text-primary truncate">{item.product.name}</div>
                                            <div className="text-xs text-text-tertiary">{formatPrice(item.product.price)}</div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <div className="text-xs text-text-tertiary">Available</div>
                                                <Badge variant={available <= 0 ? 'error' : 'warning'}>{available}</Badge>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-text-tertiary">Reserved</div>
                                                <span className="text-sm font-medium text-text-primary">{item.reservedStock}</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const found = DEMO_PRODUCTS.find(p => p.id === item.productId);
                                                    if (found) openUpdate(found);
                                                }}
                                            >
                                                Restock
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )
            ) : (
                /* All products view */
                paginatedProducts.length === 0 ? (
                    <EmptyState
                        icon="📦"
                        title="No products found"
                        description={search ? 'Try a different search term' : 'Add products first to manage inventory'}
                    />
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border-light">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Product</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Price</th>
                                        <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Total Stock</th>
                                        <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Reserved</th>
                                        <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Available</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map((product) => {
                                        const { available, total, reserved } = getStockLevel(product);
                                        return (
                                            <tr key={product.id} className="border-b border-border-light hover:bg-bg-secondary/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 shrink-0 rounded-[var(--radius-sm)] bg-bg-secondary overflow-hidden flex items-center justify-center">
                                                            <img src="/placeholder-product.svg" alt="" className="w-4 h-4 opacity-40" />
                                                        </div>
                                                        <span className="font-medium text-text-primary truncate">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-right text-text-secondary">{formatPrice(product.price)}</td>
                                                <td className="py-3 px-4 text-center font-medium">{total}</td>
                                                <td className="py-3 px-4 text-center text-text-tertiary">{reserved}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <Badge variant={available <= 0 ? 'error' : available <= 10 ? 'warning' : 'success'}>
                                                        {available}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => openUpdate(product)}>
                                                        Update
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                            {paginatedProducts.map((product) => {
                                const { available, total, reserved } = getStockLevel(product);
                                return (
                                    <Card key={product.id} padding="none">
                                        <div className="flex items-center gap-3 p-4">
                                            <div className="w-12 h-12 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden flex items-center justify-center">
                                                <img src="/placeholder-product.svg" alt="" className="w-6 h-6 opacity-40" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-text-primary truncate">{product.name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-text-tertiary">Stock: {total}</span>
                                                    <span className="text-xs text-text-tertiary">Reserved: {reserved}</span>
                                                    <Badge variant={available <= 0 ? 'error' : available <= 10 ? 'warning' : 'success'}>
                                                        Avail: {available}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => openUpdate(product)}>
                                                Update
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="mt-6">
                            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    </>
                )
            )}

            {/* ─── Update Stock Modal ──────────────────────────────────────── */}
            <Modal
                isOpen={showUpdate}
                onClose={() => setShowUpdate(false)}
                title="Update Stock Level"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-text-secondary">
                        Updating stock for <span className="font-semibold text-text-primary">{updatingProduct?.name}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-bg-secondary rounded-[var(--radius-md)]">
                            <div className="text-xs text-text-tertiary">Current Stock</div>
                            <div className="font-semibold text-text-primary">{updatingProduct?.inventory?.stock ?? 0}</div>
                        </div>
                        <div className="p-3 bg-bg-secondary rounded-[var(--radius-md)]">
                            <div className="text-xs text-text-tertiary">Reserved</div>
                            <div className="font-semibold text-text-primary">{updatingProduct?.inventory?.reservedStock ?? 0}</div>
                        </div>
                    </div>
                    <Input
                        id="new-stock-input"
                        label="New Total Stock"
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="Enter new stock level"
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setShowUpdate(false)}>Cancel</Button>
                        <Button id="save-stock-btn" isLoading={saving} onClick={handleUpdateStock}>
                            Update Stock
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
