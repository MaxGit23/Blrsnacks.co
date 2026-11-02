import type { Metadata } from 'next';

const SITE_NAME = 'BLR Snacks';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blrsnacks.co';
const DEFAULT_DESCRIPTION = 'Cold-pressed, wood-fired, hand-shaped. Artisanal South Indian snacks crafted fresh daily in Bangalore. Zero preservatives, zero compromise.';

interface SeoOptions {
    title: string;
    description?: string;
    path?: string;
    image?: string;
    noIndex?: boolean;
}

export function generateSeoMetadata(options: SeoOptions): Metadata {
    const title = `${options.title} | ${SITE_NAME}`;
    const description = options.description ?? DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${options.path ?? ''}`;
    const image = options.image ?? `${SITE_URL}/og-image.jpg`;

    return {
        title,
        description,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_NAME,
            images: [{ url: image, width: 1200, height: 630, alt: title }],
            type: 'website',
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
        robots: options.noIndex
            ? { index: false, follow: false }
            : { index: true, follow: true },
    };
}

export function generateProductSeo(product: {
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
}): Metadata {
    return {
        ...generateSeoMetadata({
            title: product.name,
            description: product.description.slice(0, 160),
            path: `/products/${product.slug}`,
            image: product.images[0],
        }),
        other: {
            /* PRICE HIDDEN
            'product:price:amount': String(product.price),
            'product:price:currency': 'INR',
            */
        },
    };
}

export function generateCategorySeo(category: {
    name: string;
    slug: string;
}): Metadata {
    return generateSeoMetadata({
        title: `${category.name} — Small-Batch Craft Snacks`,
        description: `Explore artisanal ${category.name.toLowerCase()} from Bangalore — cold-pressed, hand-shaped, zero preservatives. Crafted fresh daily.`,
        path: `/categories/${category.slug}`,
    });
}
