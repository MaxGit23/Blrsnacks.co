'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categoriesApi, type Category } from '@/lib/api';
import { Card, Skeleton } from '@/components/ui';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        categoriesApi.getAll()
            .then(setCategories)
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-secondary">Categories</h1>
                <p className="mt-2 text-text-secondary">Browse our snack collection by category</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-40 rounded-[var(--radius-lg)]" />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20">
                    <span className="text-5xl mb-4 block">📂</span>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">No categories yet</h3>
                    <p className="text-text-secondary">Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/products?category=${category.slug}`}>
                            <Card hoverable className="h-full group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                                            {category.name}
                                        </h3>
                                        {category._count && (
                                            <p className="text-sm text-text-tertiary mt-1">{category._count.products} products</p>
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
        </div>
    );
}
