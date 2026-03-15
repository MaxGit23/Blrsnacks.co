'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api';
import { Card, Skeleton, Badge } from '@/components/ui';

export default function ProductsPage() {
    return (
        <Suspense>
            <ProductsContent />
        </Suspense>
    );
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') ?? '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '');
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await productsApi.getAll({
                search: search || undefined,
                categorySlug: selectedCategory || undefined,
                sortBy: sortBy as 'price' | 'name' | 'createdAt',
                sortOrder,
                page,
                limit: 12,
            });
            setProducts(res.data);
            setTotalPages(res.meta?.totalPages ?? 1);
        } catch {
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [search, selectedCategory, sortBy, sortOrder, page]);

    useEffect(() => {
        categoriesApi.getAll().then(setCategories).catch(() => { });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* ─── Page Header ──────────────────────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-secondary">Our Snacks</h1>
                <p className="mt-2 text-text-secondary">Authentic, fresh, and made with love in Bangalore</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* ─── Sidebar Filters ────────────────────────────────────────────── */}
                <aside className="lg:w-64 shrink-0">
                    <div className="sticky top-20 space-y-6">
                        {/* Search */}
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search snacks..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                        </form>

                        {/* Categories */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Categories</h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => { setSelectedCategory(''); setPage(1); }}
                                    className={`w-full text-left px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors ${!selectedCategory ? 'bg-brand-primary-light text-brand-primary font-medium' : 'text-text-secondary hover:bg-bg-tertiary'
                                        }`}
                                >
                                    All Products
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                                        className={`w-full text-left px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-brand-primary-light text-brand-primary font-medium' : 'text-text-secondary hover:bg-bg-tertiary'
                                            }`}
                                    >
                                        {cat.name}
                                        {cat._count && (
                                            <span className="ml-2 text-xs text-text-tertiary">({cat._count.products})</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Sort By</h3>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [by, order] = e.target.value.split('-');
                                    setSortBy(by);
                                    setSortOrder(order as 'asc' | 'desc');
                                    setPage(1);
                                }}
                                className="w-full px-3 py-2 border border-border-default rounded-[var(--radius-md)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                            >
                                <option value="createdAt-desc">Newest First</option>
                                <option value="createdAt-asc">Oldest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* ─── Product Grid ───────────────────────────────────────────────── */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-[var(--radius-lg)] overflow-hidden border border-border-light">
                                    <Skeleton className="h-48 w-full" />
                                    <div className="p-4 space-y-3">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="text-5xl mb-4 block">🔍</span>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">No snacks found</h3>
                            <p className="text-text-secondary mb-6">Try adjusting your search or filter criteria</p>
                            <button
                                onClick={() => { setSearch(''); setSelectedCategory(''); setPage(1); }}
                                className="px-4 py-2 text-sm font-medium text-brand-primary border border-brand-primary rounded-[var(--radius-md)] hover:bg-brand-primary-light transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-10">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-2 text-sm rounded-[var(--radius-md)] border border-border-default hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        ← Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-9 h-9 text-sm rounded-[var(--radius-md)] transition-colors ${p === page ? 'bg-brand-primary text-white' : 'border border-border-default hover:bg-bg-tertiary'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-3 py-2 text-sm rounded-[var(--radius-md)] border border-border-default hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const inStock = product.inventory && product.inventory.stock - product.inventory.reservedStock > 0;

    return (
        <Link href={`/products/${product.slug}`}>
            <Card hoverable padding="none" className="overflow-hidden group">
                {/* Image */}
                <div className="relative h-48 bg-bg-secondary flex items-center justify-center overflow-hidden">
                    {product.images.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <span className="text-5xl opacity-40">📦</span>
                    )}
                    {!inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Badge variant="error">Out of Stock</Badge>
                        </div>
                    )}
                </div>
                {/* Info */}
                <div className="p-4">
                    <div className="text-xs text-text-tertiary uppercase tracking-wide mb-1">{product.category?.name}</div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">{product.name}</h3>
                    <p className="mt-1 text-xs text-text-secondary line-clamp-2">{product.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-brand-primary">₹{Number(product.price).toFixed(0)}</span>
                        {inStock && (
                            <span className="text-xs text-success font-medium">In Stock</span>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
