import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DEMO_PRODUCTS, FALLBACK_CATEGORIES } from '@/lib/mock-products';
import { Container, PageHeader } from '@/components/layout';
import { ProductCard } from '@/components/products/ProductCard';

export function generateStaticParams() {
    return FALLBACK_CATEGORIES.map(({ slug }) => ({ slug }));
}

async function getCategory(slug: string) {
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug);
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);
    if (!category) return {};
    return {
        title: `${category.name} — Authentic Bangalore Snacks`,
        description: `Browse our ${category.name.toLowerCase()} collection — handcrafted with authentic South Indian recipes.`,
    };
}

const CATEGORY_ICONS: Record<string, string> = {
    chips: '🥔',
    mixtures: '🌶️',
    murukku: '🌀',
    sweets: '🍬',
};

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = await getCategory(slug);
    if (!category) notFound();

    const products = DEMO_PRODUCTS.filter((p) => p.category.slug === slug);

    return (
        <Container className="py-8 animate-fade-in">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-tertiary">
                <Link href="/categories" className="hover:text-brand-primary transition-colors">
                    Categories
                </Link>
                <span className="mx-2">/</span>
                <span className="text-text-secondary">{category.name}</span>
            </nav>

            <PageHeader
                title={`${CATEGORY_ICONS[slug] ?? '🛒'} ${category.name}`}
                description={`Handcrafted with authentic South Indian recipes — pick your favourites`}
            />

            {products.length === 0 ? (
                <p className="text-center text-text-secondary py-16">
                    Nothing here yet — new batches land soon.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </Container>
    );
}
