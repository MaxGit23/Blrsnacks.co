'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api';
import { Card, Skeleton, Badge, Pagination, EmptyState } from '@/components/ui';
import { Container, PageHeader } from '@/components/layout';
import { formatPrice } from '@/lib/format';
import { getImageUrl } from '@/lib/images';
import { useDebounce } from '@/hooks';

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

    const debouncedSearch = useDebounce(search, 400);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await productsApi.getAll({
                search: debouncedSearch || undefined,
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
    }, [debouncedSearch, selectedCategory, sortBy, sortOrder, page]);

    useEffect(() => {
        categoriesApi.getAll().then(setCategories).catch(() => { /* noop */ });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, selectedCategory, sortBy, sortOrder]);

    return (
        <Container className="py-8 animate-fade-in">
            <PageHeader
                title="Our Snacks Collection"
                description="Handcrafted with authentic South Indian recipes — pick your favourites"
            />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* ─── Sidebar Filters ────────────────────────────────────────────── */}
                <aside className="lg:w-64 shrink-0">
                    <div className="sticky top-20 space-y-6">
                        {/* Search */}
                        <div className="relative">
                            <input
                                id="product-search"
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

                        {/* Categories */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Categories</h3>
                            <div className="space-y-1">
                                <button
                                    id="filter-all"
                                    onClick={() => setSelectedCategory('')}
                                    className={`w-full text-left px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors ${!selectedCategory ? 'bg-brand-primary-light text-brand-primary font-medium' : 'text-text-secondary hover:bg-bg-tertiary'}`}
                                >
                                    All Products
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        id={`filter-${cat.slug}`}
                                        onClick={() => setSelectedCategory(cat.slug)}
                                        className={`w-full text-left px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-brand-primary-light text-brand-primary font-medium' : 'text-text-secondary hover:bg-bg-tertiary'}`}
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
                                id="product-sort"
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [by, order] = e.target.value.split('-');
                                    setSortBy(by);
                                    setSortOrder(order as 'asc' | 'desc');
                                }}
                                className="w-full px-3 py-2 border border-border-default rounded-[var(--radius-md)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none"
                            >
                                <option value="createdAt-desc">Newest First</option>
                                <option value="createdAt-asc">Oldest First</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                                <option value="name-asc">Name: A → Z</option>
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
                        <EmptyState
                            icon="🔍"
                            title="No snacks match your search"
                            description="Try different keywords or adjust your category filter"
                            actionLabel="Clear All Filters"
                            onAction={() => { setSearch(''); setSelectedCategory(''); }}
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            <div className="mt-10">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
}

function ProductCard({ product }: { product: Product }) {
    const inStock = product.inventory && product.inventory.stock - product.inventory.reservedStock > 0;

    return (
        <Link href={`/products/${product.slug}`} id={`product-${product.slug}`}>
            <Card hoverable padding="none" className="overflow-hidden group">
                {/* Image */}
                <div className="relative h-48 bg-bg-secondary flex items-center justify-center overflow-hidden">
                    {product.images.length > 0 ? (
                        <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                    ) : (
                        <img
                            src="/placeholder-product.svg"
                            alt={product.name}
                            className="w-24 h-24 opacity-50"
                        />
                    )}
                    {!inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Badge variant="error">Sold Out</Badge>
                        </div>
                    )}
                </div>
                {/* Info */}
                <div className="p-4">
                    <div className="text-xs text-text-tertiary uppercase tracking-wide mb-1">{product.category?.name}</div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-text-secondary line-clamp-2">{product.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-brand-primary">{formatPrice(Number(product.price))}</span>
                        {inStock && (
                            <span className="text-xs text-success font-medium">In Stock</span>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
