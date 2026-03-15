'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api';
import { Button, Badge, Card, Skeleton, Pagination, EmptyState, Input, Select, Textarea, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/format';
import { getImageUrl } from '@/lib/images';

export default function AdminProductsPage() {
    const { addToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', isPublished: true });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await productsApi.getAll({ search: search || undefined, page, limit: 10 });
            setProducts(res.data);
            setTotalPages(res.meta?.totalPages ?? 1);
        } catch {
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        categoriesApi.getAll().then(setCategories).catch(() => { /* noop */ });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const openCreate = () => {
        setEditingProduct(null);
        setForm({ name: '', description: '', price: '', categoryId: '', isPublished: true });
        setFormErrors({});
        setShowModal(true);
    };

    const openEdit = (product: Product) => {
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
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price),
                categoryId: form.categoryId,
                isPublished: form.isPublished,
            };

            if (editingProduct) {
                await productsApi.update(editingProduct.id, payload);
                addToast('Product updated successfully', 'success');
            } else {
                await productsApi.create(payload);
                addToast('Product created successfully', 'success');
            }
            setShowModal(false);
            fetchProducts();
        } catch {
            addToast(`Failed to ${editingProduct ? 'update' : 'create'} product`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        setDeletingId(id);
        try {
            await productsApi.delete(id);
            addToast('Product deleted', 'info');
            fetchProducts();
        } catch {
            addToast('Failed to delete product', 'error');
        } finally {
            setDeletingId(null);
        }
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
                    {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 rounded-[var(--radius-md)]" />)}
                </div>
            ) : products.length === 0 ? (
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
                                {products.map((product) => {
                                    const available = product.inventory ? product.inventory.stock - product.inventory.reservedStock : 0;
                                    return (
                                        <tr key={product.id} className="border-b border-border-light hover:bg-bg-secondary/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden">
                                                        {product.images.length > 0 ? (
                                                            <img src={getImageUrl(product.images[0])} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <img src="/placeholder-product.svg" alt="" className="w-5 h-5 opacity-40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-medium text-text-primary truncate">{product.name}</div>
                                                        <div className="text-xs text-text-tertiary">{formatDate(product.createdAt)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-text-secondary">{product.category?.name ?? '—'}</td>
                                            <td className="py-3 px-4 text-right font-semibold text-text-primary">{formatPrice(Number(product.price))}</td>
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
                        {products.map((product) => {
                            const available = product.inventory ? product.inventory.stock - product.inventory.reservedStock : 0;
                            return (
                                <Card key={product.id} padding="none" className="overflow-hidden">
                                    <div className="flex gap-3 p-4">
                                        <div className="w-14 h-14 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden">
                                            {product.images.length > 0 ? (
                                                <img src={getImageUrl(product.images[0])} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <img src="/placeholder-product.svg" alt="" className="w-6 h-6 opacity-40" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-text-primary truncate">{product.name}</div>
                                            <div className="text-xs text-text-tertiary mt-0.5">{product.category?.name} · {formatPrice(Number(product.price))}</div>
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
                                ...categories.map((c) => ({ value: c.id, label: c.name })),
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
