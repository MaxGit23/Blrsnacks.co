'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categoriesApi, type Category } from '@/lib/api';
import { Card, Skeleton, EmptyState } from '@/components/ui';
import { Container, PageHeader } from '@/components/layout';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        categoriesApi.getAll()
            .then(setCategories)
            .catch(() => { /* noop */ })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <Container className="py-8 animate-fade-in">
            <PageHeader
                title="Browse by Category"
                description="Find exactly what you're craving — explore our snack categories"
            />

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-40 rounded-[var(--radius-lg)]" />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <EmptyState
                    icon="📂"
                    title="No categories yet"
                    description="We're still setting things up — check back soon for our full snack collection!"
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/products?category=${category.slug}`} id={`cat-card-${category.slug}`}>
                            <Card hoverable className="h-full group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                                            {category.name}
                                        </h3>
                                        {category._count && (
                                            <p className="text-sm text-text-tertiary mt-1">
                                                {category._count.products} product{category._count.products !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                    <div className="p-2 rounded-[var(--radius-md)] bg-brand-primary-light text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </div>
                                </div>
                                {category.children && category.children.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {category.children.map((child) => (
                                            <span
                                                key={child.id}
                                                className="px-2.5 py-1 text-xs bg-bg-tertiary text-text-secondary rounded-[var(--radius-full)]"
                                            >
                                                {child.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </Container>
    );
}
