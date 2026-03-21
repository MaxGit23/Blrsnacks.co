'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Badge, Card, Pagination, EmptyState, Input, Select, Textarea, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, formatDate } from '@/lib/format';
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

interface PendingImage {
    file: File;
    preview: string;
}

export default function AdminProductsPage() {
    const { addToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', categoryId: '', isPublished: true });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Image state
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [deletingImageUrl, setDeletingImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await productsApi.getAllAdmin({
                search: search || undefined,
                page,
                limit: ITEMS_PER_PAGE
            });
            setProducts(res.data || []);
            setTotalPages(res.meta?.totalPages || 1);
        } catch (error) {
            console.error('Failed to load products', error);
            addToast('Failed to load products', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [search, page, addToast]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const openCreate = () => {
        setEditingProduct(null);
        setForm({ name: '', slug: '', description: '', price: '', categoryId: '', isPublished: true });
        setFormErrors({});
        setExistingImages([]);
        setPendingImages([]);
        setShowModal(true);
    };

    const openEdit = (product: Product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: String(product.price),
            categoryId: product.category?.id ?? '',
            isPublished: product.isPublished ?? true,
        });
        setFormErrors({});
        setExistingImages(product.images || []);
        setPendingImages([]);
        setShowModal(true);
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const validateForm = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Product name is required';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Enter a valid price';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ─── Image Handlers ──────────────────────────────────────────────────────────

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newPending: PendingImage[] = [];
        const errors: string[] = [];

        Array.from(files).forEach((file) => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(`"${file.name}" — only JPEG, PNG, WebP, AVIF allowed`);
                return;
            }
            if (file.size > MAX_IMAGE_SIZE) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                errors.push(`"${file.name}" is ${sizeMB}MB — max 5MB allowed`);
                return;
            }
            newPending.push({
                file,
                preview: URL.createObjectURL(file),
            });
        });

        if (errors.length > 0) {
            errors.forEach((err) => addToast(err, 'error'));
        }

        if (newPending.length > 0) {
            setPendingImages((prev) => [...prev, ...newPending]);
        }

        // Reset the input so re-selecting the same file triggers onChange
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePendingImage = (index: number) => {
        setPendingImages((prev) => {
            const copy = [...prev];
            URL.revokeObjectURL(copy[index].preview);
            copy.splice(index, 1);
            return copy;
        });
    };

    const uploadPendingImages = async (productId: string) => {
        if (pendingImages.length === 0) return;
        setUploadingImages(true);
        try {
            const formData = new FormData();
            pendingImages.forEach((p) => formData.append('images', p.file));
            const updated = await productsApi.uploadImages(productId, formData);
            setExistingImages(updated.images || []);
            // Clean up blob URLs
            pendingImages.forEach((p) => URL.revokeObjectURL(p.preview));
            setPendingImages([]);
            addToast(`${pendingImages.length} image(s) uploaded`, 'success');
        } catch (error) {
            console.error('Image upload error', error);
            addToast('Failed to upload images', 'error');
        } finally {
            setUploadingImages(false);
        }
    };

    const deleteExistingImage = async (imageUrl: string) => {
        if (!editingProduct) return;
        setDeletingImageUrl(imageUrl);
        try {
            const updated = await productsApi.deleteImage(editingProduct.id, imageUrl);
            setExistingImages(updated.images || []);
            addToast('Image removed', 'success');
            fetchProducts(); // Refresh product list to reflect updated images
        } catch (error) {
            console.error('Delete image error', error);
            addToast('Failed to remove image', 'error');
        } finally {
            setDeletingImageUrl(null);
        }
    };

    // ─── Save Handler ────────────────────────────────────────────────────────────

    const handleSave = async () => {
        if (!validateForm()) return;
        setSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                slug: form.slug || generateSlug(form.name.trim()),
                description: form.description.trim(),
                price: Number(form.price),
                categoryId: form.categoryId || undefined,
                isPublished: form.isPublished
            };

            let savedProduct: Product;
            if (editingProduct) {
                savedProduct = await productsApi.update(editingProduct.id, payload) as Product;
                addToast('Product updated successfully', 'success');
            } else {
                savedProduct = await productsApi.create(payload as Record<string, unknown>) as Product;
                addToast('Product created successfully', 'success');
            }

            // Upload any pending images after save
            if (pendingImages.length > 0 && savedProduct?.id) {
                await uploadPendingImages(savedProduct.id);
            }

            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Save error', error);
            addToast(error instanceof Error ? error.message : 'Failed to save product', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        setDeletingId(id);
        
        try {
            await productsApi.delete(id);
            addToast('Product deleted successfully', 'success');
            if (products.length === 1 && page > 1) {
                setPage(p => p - 1);
            } else {
                fetchProducts();
            }
        } catch (error) {
            console.error('Delete error', error);
            addToast(error instanceof Error ? error.message : 'Failed to delete product', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const totalImageCount = existingImages.length + pendingImages.length;

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
                                                    <div className="w-10 h-10 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden flex items-center justify-center">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <img src="/placeholder-product.svg" alt="" className="w-5 h-5 opacity-40" />
                                                        )}
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
                        {products.map((product) => {
                            const available = product.inventory ? product.inventory.stock - product.inventory.reservedStock : 0;
                            return (
                                <Card key={product.id} padding="none" className="overflow-hidden">
                                    <div className="flex gap-3 p-4">
                                        <div className="w-14 h-14 shrink-0 rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden flex items-center justify-center">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src="/placeholder-product.svg" alt="" className="w-6 h-6 opacity-40" />
                                            )}
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
                                ...categories.map((c) => ({ value: c.id, label: c.name })),
                            ]}
                        />
                    </div>
                    {editingProduct && (
                        <Input
                            id="product-slug"
                            label="Slug URL (optional)"
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            placeholder="Leave empty to auto-generate from name"
                        />
                    )}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isPublished}
                            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                            className="w-4 h-4 rounded border-border-default text-brand-primary focus:ring-brand-primary/30"
                        />
                        <span className="text-sm font-medium text-text-primary">{editingProduct ? 'Publish product' : 'Publish immediately'}</span>
                    </label>

                    {/* ─── Image Management Section ──────────────────────────── */}
                    <div className="pt-4 border-t border-border-light">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary">Product Images</h3>
                                <p className="text-xs text-text-tertiary mt-0.5">
                                    JPEG, PNG, WebP, AVIF · Max 5MB each · {totalImageCount} image{totalImageCount !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <button
                                type="button"
                                id="add-image-btn"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold 
                                    rounded-[var(--radius-md)] border border-dashed border-brand-primary 
                                    text-brand-primary hover:bg-brand-primary-light 
                                    transition-colors duration-[var(--transition-fast)]"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                Add Images
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs font-medium text-text-secondary mb-2">Current Images</p>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {existingImages.map((url, i) => (
                                        <div
                                            key={url}
                                            className="group relative aspect-square rounded-[var(--radius-md)] overflow-hidden 
                                                bg-bg-secondary border border-border-light hover:border-brand-primary 
                                                transition-all duration-[var(--transition-fast)]"
                                        >
                                            <img
                                                src={url}
                                                alt={`Product image ${i + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Primary badge */}
                                            {i === 0 && (
                                                <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-bold uppercase 
                                                    bg-brand-primary text-white rounded-[var(--radius-sm)] shadow-sm">
                                                    Primary
                                                </span>
                                            )}
                                            {/* Delete overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 
                                                transition-colors duration-[var(--transition-fast)] flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExistingImage(url)}
                                                    disabled={deletingImageUrl === url}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 
                                                        bg-white/90 hover:bg-error hover:text-white rounded-full
                                                        shadow-md transition-all duration-[var(--transition-fast)]
                                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Remove image"
                                                >
                                                    {deletingImageUrl === url ? (
                                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            <line x1="10" y1="11" x2="10" y2="17" />
                                                            <line x1="14" y1="11" x2="14" y2="17" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pending Images (staged for upload) */}
                        {pendingImages.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs font-medium text-text-secondary mb-2">
                                    Staged for Upload
                                    <span className="ml-1 text-text-tertiary">({pendingImages.length} file{pendingImages.length !== 1 ? 's' : ''})</span>
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {pendingImages.map((pi, i) => (
                                        <div
                                            key={pi.preview}
                                            className="group relative aspect-square rounded-[var(--radius-md)] overflow-hidden 
                                                bg-bg-secondary border-2 border-dashed border-brand-accent 
                                                transition-all duration-[var(--transition-fast)]"
                                        >
                                            <img
                                                src={pi.preview}
                                                alt={`Pending image ${i + 1}`}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            {/* File size badge */}
                                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] font-medium 
                                                bg-black/60 text-white rounded-[var(--radius-sm)]">
                                                {(pi.file.size / (1024 * 1024)).toFixed(1)}MB
                                            </span>
                                            {/* "New" indicator */}
                                            <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-bold uppercase 
                                                bg-brand-accent text-white rounded-[var(--radius-sm)] shadow-sm">
                                                New
                                            </span>
                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={() => removePendingImage(i)}
                                                className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-error hover:text-white 
                                                    rounded-full shadow-sm transition-all duration-[var(--transition-fast)]
                                                    opacity-0 group-hover:opacity-100"
                                                title="Remove"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty state for images */}
                        {existingImages.length === 0 && pendingImages.length === 0 && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-8 border-2 border-dashed border-border-default hover:border-brand-primary 
                                    rounded-[var(--radius-lg)] flex flex-col items-center justify-center gap-2 
                                    text-text-tertiary hover:text-brand-primary transition-all duration-[var(--transition-base)]
                                    cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-bg-secondary group-hover:bg-brand-primary-light 
                                    flex items-center justify-center transition-colors duration-[var(--transition-base)]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Click to add product images</p>
                                    <p className="text-xs mt-0.5">JPEG, PNG, WebP, AVIF · Max 5MB each</p>
                                </div>
                            </button>
                        )}

                        {/* Upload progress indicator */}
                        {uploadingImages && (
                            <div className="flex items-center gap-2 px-3 py-2 mt-2 bg-info-light rounded-[var(--radius-md)] text-info text-xs font-medium">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
                                </svg>
                                Uploading images…
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                        <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button id="save-product-btn" isLoading={saving || uploadingImages} onClick={handleSave}>
                            {editingProduct ? 'Save Changes' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
