'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Badge, Card, Pagination, EmptyState, Input, Select, Textarea, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/format';

/* ── Demo data types ───────────────────────────────────────────────────── */
interface DemoProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    isPublished: boolean;
    category: { id: string; name: string; slug: string };
    inventory: { stock: number; reservedStock: number };
    createdAt: string;
}

interface DemoCategory {
    id: string;
    name: string;
    slug: string;
}

/* ── Demo data (remove when backend is connected) ──────────────────────── */
const DEMO_CATEGORIES: DemoCategory[] = [
    { id: 'cat-1', name: 'Banana Chips', slug: 'banana-chips' },
    { id: 'cat-2', name: 'Mixtures', slug: 'mixtures' },
    { id: 'cat-3', name: 'Murukku', slug: 'murukku' },
    { id: 'cat-4', name: 'Sweets', slug: 'sweets' },
    { id: 'cat-5', name: 'Dry Fruits', slug: 'dry-fruits' },
    { id: 'cat-6', name: 'Beverages', slug: 'beverages' },
];

const DEMO_PRODUCTS: DemoProduct[] = [
    { id: 'p1', name: 'Classic Banana Chips (200g)', slug: 'classic-banana-chips', description: 'Thin-sliced Kerala banana chips fried in pure coconut oil', price: 149, images: [], isPublished: true, category: DEMO_CATEGORIES[0], inventory: { stock: 5, reservedStock: 3 }, createdAt: '2026-02-20T10:00:00Z' },
    { id: 'p2', name: 'Spicy Mixture (500g)', slug: 'spicy-mixture', description: 'A fiery blend of sev, boondi, peanuts, and curry leaves', price: 299, images: [], isPublished: true, category: DEMO_CATEGORIES[1], inventory: { stock: 0, reservedStock: 0 }, createdAt: '2026-02-19T10:00:00Z' },
    { id: 'p3', name: 'Butter Murukku (250g)', slug: 'butter-murukku', description: 'Crispy spiral murukku made with rice flour and butter', price: 179, images: [], isPublished: true, category: DEMO_CATEGORIES[2], inventory: { stock: 45, reservedStock: 5 }, createdAt: '2026-02-18T10:00:00Z' },
    { id: 'p4', name: 'Mysore Pak (12 pcs)', slug: 'mysore-pak', description: 'Traditional ghee-rich Mysore Pak made with besan', price: 349, images: [], isPublished: true, category: DEMO_CATEGORIES[3], inventory: { stock: 20, reservedStock: 8 }, createdAt: '2026-02-17T10:00:00Z' },
    { id: 'p5', name: 'Pepper Banana Chips (200g)', slug: 'pepper-banana-chips', description: 'Banana chips seasoned with crushed black pepper', price: 169, images: [], isPublished: true, category: DEMO_CATEGORIES[0], inventory: { stock: 60, reservedStock: 12 }, createdAt: '2026-02-16T10:00:00Z' },
    { id: 'p6', name: 'Cashew Mix (250g)', slug: 'cashew-mix', description: 'Premium cashews roasted with spices and curry leaves', price: 499, images: [], isPublished: true, category: DEMO_CATEGORIES[4], inventory: { stock: 30, reservedStock: 5 }, createdAt: '2026-02-15T10:00:00Z' },
    { id: 'p7', name: 'Jaggery Peanut Bar (6 pcs)', slug: 'jaggery-peanut-bar', description: 'Crunchy peanut chikki with organic jaggery', price: 129, images: [], isPublished: false, category: DEMO_CATEGORIES[3], inventory: { stock: 100, reservedStock: 0 }, createdAt: '2026-02-14T10:00:00Z' },
    { id: 'p8', name: 'Filter Coffee Powder (200g)', slug: 'filter-coffee-powder', description: '80:20 blend of Arabica and Robusta beans', price: 249, images: [], isPublished: true, category: DEMO_CATEGORIES[5], inventory: { stock: 35, reservedStock: 10 }, createdAt: '2026-02-13T10:00:00Z' },
    { id: 'p9', name: 'Salt Banana Chips (500g)', slug: 'salt-banana-chips', description: 'Family pack of lightly salted banana chips', price: 329, images: [], isPublished: true, category: DEMO_CATEGORIES[0], inventory: { stock: 15, reservedStock: 3 }, createdAt: '2026-02-12T10:00:00Z' },
    { id: 'p10', name: 'Ribbon Pakoda (250g)', slug: 'ribbon-pakoda', description: 'Thin crispy ribbon-shaped savory snack', price: 159, images: [], isPublished: true, category: DEMO_CATEGORIES[1], inventory: { stock: 40, reservedStock: 8 }, createdAt: '2026-02-11T10:00:00Z' },
];
/* ────────────────────────────────────────────────────────────────────────── */

export default function AdminProductsPage() {
    const { addToast } = useToast();
    const [products, setProducts] = useState<DemoProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<DemoProduct | null>(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', isPublished: true });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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
        fetchProducts();
    }, [fetchProducts]);

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const paginatedProducts = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const openCreate = () => {
        setEditingProduct(null);
        setForm({ name: '', description: '', price: '', categoryId: '', isPublished: true });
        setFormErrors({});
        setShowModal(true);
    };

    const openEdit = (product: DemoProduct) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            description: product.description,
            price: String(product.price),
            categoryId: product.category?.id ?? '',
            isPublished: product.isPublished,
        });
        setFormErrors({});
        setShowModal(true);
    };

    const validateForm = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Product name is required';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Enter a valid price';
        if (!form.categoryId) errs.categoryId = 'Select a category';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        setSaving(true);
        // Simulate save
        await new Promise(r => setTimeout(r, 800));
        addToast(editingProduct ? 'Product updated successfully (demo)' : 'Product created successfully (demo)', 'success');
        setShowModal(false);
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        setDeletingId(id);
        await new Promise(r => setTimeout(r, 600));
        setProducts(prev => prev.filter(p => p.id !== id));
        addToast('Product deleted (demo)', 'info');
        setDeletingId(null);
    };

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-brand-secondary">Products</h1>
                    <p className="text-sm text-text-secondary mt-1">Manage your snack catalogue</p>
                </div>
                <Button id="create-product-btn" onClick={openCreate}>+ Add Product</Button>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-sm">
                <Input
                    id="admin-product-search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            {/* Product Table */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 rounded-[var(--radius-md)] bg-bg-secondary animate-pulse" />)}
                </div>
            ) : paginatedProducts.length === 0 ? (
                <EmptyState
                    icon="🍌"
                    title="No products found"
                    description={search ? 'No products match your search' : 'Add your first product to get started'}
                    actionLabel="Add Product"
                    onAction={openCreate}
                />
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border-light">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Product</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Category</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Price</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Stock</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.map((product) => {
                                    const available = product.inventory ? product.inventory.stock - product.inventory.reservedStock : 0;
                                    return (
                                        <tr key={product.id} className="border-b border-border-light hover:bg-bg-secondary/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden flex items-center justify-center">
                                                        <img src="/placeholder-product.svg" alt="" className="w-5 h-5 opacity-40" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-medium text-text-primary truncate">{product.name}</div>
                                                        <div className="text-xs text-text-tertiary">{formatDate(product.createdAt)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-text-secondary">{product.category?.name ?? '—'}</td>
                                            <td className="py-3 px-4 text-right font-semibold text-text-primary">{formatPrice(product.price)}</td>
                                            <td className="py-3 px-4 text-center">
                                                <Badge variant={product.isPublished ? 'success' : 'default'}>
                                                    {product.isPublished ? 'Published' : 'Draft'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <Badge variant={available <= 0 ? 'error' : available <= 10 ? 'warning' : 'success'}>
                                                    {available}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>Edit</Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        isLoading={deletingId === product.id}
                                                        onClick={() => handleDelete(product.id)}
                                                        className="!text-error hover:!bg-error-light"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
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
                            const available = product.inventory ? product.inventory.stock - product.inventory.reservedStock : 0;
                            return (
                                <Card key={product.id} padding="none" className="overflow-hidden">
                                    <div className="flex gap-3 p-4">
                                        <div className="w-14 h-14 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden flex items-center justify-center">
                                            <img src="/placeholder-product.svg" alt="" className="w-6 h-6 opacity-40" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-text-primary truncate">{product.name}</div>
                                            <div className="text-xs text-text-tertiary mt-0.5">{product.category?.name} · {formatPrice(product.price)}</div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant={product.isPublished ? 'success' : 'default'}>
                                                    {product.isPublished ? 'Published' : 'Draft'}
                                                </Badge>
                                                <Badge variant={available <= 0 ? 'error' : available <= 10 ? 'warning' : 'success'}>
                                                    Stock: {available}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 shrink-0">
                                            <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>Edit</Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(product.id)}
                                                className="!text-error"
                                            >
                                                Del
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-6">
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                </>
            )}

            {/* ─── Create/Edit Modal ───────────────────────────────────────── */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                size="lg"
            >
                <div className="space-y-4">
                    <Input
                        id="product-name"
                        label="Product Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        error={formErrors.name}
                        placeholder="e.g. Classic Banana Chips"
                    />
                    <Textarea
                        id="product-description"
                        label="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Describe your product..."
                        rows={3}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="product-price"
                            label="Price (₹)"
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            error={formErrors.price}
                            placeholder="0"
                        />
                        <Select
                            id="product-category"
                            label="Category"
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            error={formErrors.categoryId}
                            options={[
                                { value: '', label: 'Select category' },
                                ...DEMO_CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
                            ]}
                        />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isPublished}
                            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                            className="w-4 h-4 rounded border-border-default text-brand-primary focus:ring-brand-primary/30"
                        />
                        <span className="text-sm font-medium text-text-primary">Publish immediately</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                        <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button id="save-product-btn" isLoading={saving} onClick={handleSave}>
                            {editingProduct ? 'Save Changes' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
