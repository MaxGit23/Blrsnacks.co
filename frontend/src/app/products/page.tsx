'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api';
import { DEMO_PRODUCTS, FALLBACK_CATEGORIES } from '@/lib/mock-products';
import { Card, Skeleton, Pagination, EmptyState } from '@/components/ui';
import { Container, PageHeader } from '@/components/layout';
import { ProductCard } from '@/components/products/ProductCard';
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearch = useDebounce(search, 400);

    // Keep local state in sync when the URL query changes (e.g. header search)
    useEffect(() => {
        setSearch(searchParams.get('search') ?? '');
    }, [searchParams]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        let list: Product[] = [];
        let failed = false;
        try {
            const res = await productsApi.getAll({
                search: debouncedSearch || undefined,
                categorySlug: selectedCategory || undefined,
                page,
                limit: 12,
            });
            list = res.data;
        } catch {
            failed = true;
        }

        // Backend offline or nothing stored yet — fall back to demo catalogue
        if (failed || list.length === 0) {
            const q = debouncedSearch.trim().toLowerCase();
            list = DEMO_PRODUCTS.filter((p) => {
                const inCategory = !selectedCategory || p.category.slug === selectedCategory;
                const matchesSearch =
                    !q ||
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q);
                return inCategory && matchesSearch;
            });
        }

        setProducts(list);
        setTotalPages(1);
        setIsLoading(false);
    }, [debouncedSearch, selectedCategory, page]);

    useEffect(() => {
        categoriesApi.getAll()
            .then(setCategories)
            .catch(() => setCategories(FALLBACK_CATEGORIES));
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, selectedCategory]);

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
                                className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-[border-color,box-shadow] duration-200"
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

