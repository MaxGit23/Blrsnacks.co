import type { Product, Category } from './api';

/**
 * Weight/size variant for demo products.
 * Mirrors the future `ProductVariant` Prisma model so the static
 * design maps 1:1 onto the backend schema when it is restored.
 */
export interface ProductVariant {
    id: string;
    /** Display label, e.g. "200g" */
    label: string;
    weightGrams: number;
    price: number;
}

/** A demo product is a normal Product plus optional weight variants. */
export type DemoProduct = Product & { variants: ProductVariant[] };

export const DEMO_PRODUCTS: DemoProduct[] = [
    {
        id: 'demo-product-benne-murukku',
        name: 'Benne Butter Murukku',
        slug: 'benne-butter-murukku',
        description:
            'Traditional Karnataka-style butter murukku — light, crispy spirals made with rice flour, butter, and a hint of cumin. Melts in your mouth with every bite.',
        price: 35,
        images: ['/benne-murukku.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-murukku', name: 'Murukku', slug: 'murukku' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vm-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vm-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-bakarwadi',
        name: 'Bakarwadi',
        slug: 'bakarwadi',
        description:
            'Maharashtrian favourite — crispy gram flour spirals stuffed with a spicy coconut-sesame filling. Sweet, tangy, and fiery all at once.',
        price: 40,
        images: ['/bakarwadi.jpeg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vb-200g', label: '200g', weightGrams: 200, price: 40 },
            { id: 'vb-400g', label: '400g', weightGrams: 400, price: 75 },
        ],
    },
    {
        id: 'demo-product-spicy-banana-chips',
        name: 'Spicy Nendran Chips',
        slug: 'spicy-nendran-chips',
        description:
            'Classic nendran banana chips tossed in a fiery chilli-garlic masala. Same crisp coconut-oil crunch, now with a bold kick.',
        price: 25,
        images: ['/banana-chips-extra.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-chips', name: 'Banana Chips', slug: 'banana-chips' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vs-200g', label: '200g', weightGrams: 200, price: 25 },
            { id: 'vs-400g', label: '400g', weightGrams: 400, price: 48 },
            { id: 'vs-500g', label: '500g', weightGrams: 500, price: 55 },
        ],
    },
    {
        id: 'demo-product-masala-moong-dal',
        name: 'Masala Moong Dal',
        slug: 'masala-moong-dal',
        description:
            'Crunchy split moong dal tossed in aromatic South Indian spices — a protein-packed tea-time classic.',
        price: 35,
        images: ['/masala-moong-dal.webp'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vmm-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vmm-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-kerala-spicy-mixture',
        name: 'Kerala Spicy Mixture',
        slug: 'kerala-spicy-mixture',
        description:
            'A fiery blend of fried lentils, peanuts, curry leaves, and red chilli — the taste of a Malabar evening.',
        price: 40,
        images: ['/kerala-spicy-mixture.webp'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vksm-200g', label: '200g', weightGrams: 200, price: 40 },
            { id: 'vksm-400g', label: '400g', weightGrams: 400, price: 75 },
        ],
    },
    {
        id: 'demo-product-moong-dal',
        name: 'Plain Moong Dal',
        slug: 'plain-moong-dal',
        description:
            'Lightly salted, slow-roasted moong dal — simple, crunchy, and perfect with a cup of filter coffee.',
        price: 30,
        images: ['/moong-dal.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vmd-200g', label: '200g', weightGrams: 200, price: 30 },
            { id: 'vmd-400g', label: '400g', weightGrams: 400, price: 55 },
        ],
    },
    {
        id: 'demo-product-fried-peanuts',
        name: 'Fried Peanuts',
        slug: 'fried-peanuts',
        description:
            'Premium groundnuts fried to golden perfection and seasoned with just enough salt.',
        price: 35,
        images: ['/fried-peanuts.webp'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vfp-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vfp-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-ribbon-mixture',
        name: 'Ribbon Mixture',
        slug: 'ribbon-mixture',
        description:
            'Crispy ribbon-shaped rice flour strands mixed with roasted gram, peanuts, and a hint of asafoetida.',
        price: 40,
        images: ['/ribbion-mixture.jpeg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vrm-200g', label: '200g', weightGrams: 200, price: 40 },
            { id: 'vrm-400g', label: '400g', weightGrams: 400, price: 75 },
        ],
    },
    {
        id: 'demo-product-special-mixture',
        name: 'Special Mixture',
        slug: 'special-mixture',
        description:
            'Our signature blend — boondi, kara sev, peanuts, roasted gram, and curry leaves in perfect balance.',
        price: 45,
        images: ['/special-mixture.webp'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vsm-200g', label: '200g', weightGrams: 200, price: 45 },
            { id: 'vsm-400g', label: '400g', weightGrams: 400, price: 85 },
        ],
    },
    {
        id: 'demo-product-yellow-masala-murukku',
        name: 'Yellow Masala Murukku',
        slug: 'yellow-masala-murukku',
        description:
            'Golden turmeric-kissed murukku with a spicy masala coating — crunchy rings that vanish fast.',
        price: 38,
        images: ['/yellow-masala-murukku.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-murukku', name: 'Murukku', slug: 'murukku' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vymm-200g', label: '200g', weightGrams: 200, price: 38 },
            { id: 'vymm-400g', label: '400g', weightGrams: 400, price: 70 },
        ],
    },
    {
        id: 'demo-product-congress-kadlekai',
        name: 'Congress Kadlekai',
        slug: 'congress-kadlekai',
        description:
            'Classic Bangalore-style spiced peanuts — roasted with chilli powder, curry leaves, and a dash of garlic.',
        price: 35,
        images: ['/congress-kadlekai.webp'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vck-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vck-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-masala-peanuts',
        name: 'Masala Peanuts',
        slug: 'masala-peanuts',
        description:
            'Boldly spiced peanuts coated in a chilli-garlic batter and fried until irresistibly crunchy.',
        price: 38,
        images: ['/masala-peantus.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vmp-200g', label: '200g', weightGrams: 200, price: 38 },
            { id: 'vmp-400g', label: '400g', weightGrams: 400, price: 70 },
        ],
    },
    {
        id: 'demo-product-kodubale',
        name: 'Kodubale',
        slug: 'kodubale',
        description:
            'Traditional Karnataka ring-shaped savoury — rice flour, coconut, and spices shaped by hand and fried crisp.',
        price: 42,
        images: ['/kodubale.jpeg'],
        isPublished: true,
        category: { id: 'demo-cat-murukku', name: 'Murukku', slug: 'murukku' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vk-200g', label: '200g', weightGrams: 200, price: 42 },
            { id: 'vk-400g', label: '400g', weightGrams: 400, price: 78 },
        ],
    },
    {
        id: 'demo-product-kara-boondi',
        name: 'Kara Boondi',
        slug: 'kara-boondi',
        description:
            'Tiny chickpea-flour pearls fried and tossed in red chilli, salt, and curry leaves — the ultimate mixture base.',
        price: 30,
        images: ['/karaboondi.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-24').toISOString(),
        variants: [
            { id: 'vkb-200g', label: '200g', weightGrams: 200, price: 30 },
            { id: 'vkb-400g', label: '400g', weightGrams: 400, price: 55 },
        ],
    },
];

export function findDemoProductBySlug(slug: string): DemoProduct | undefined {
    return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

/** Sidebar category fallback while the backend is offline. */
export const FALLBACK_CATEGORIES: Category[] = [
    { id: 'cat-banana-chips', name: 'Banana Chips', slug: 'banana-chips', parentId: null },
    { id: 'cat-mixtures', name: 'Mixtures', slug: 'mixtures', parentId: null },
    { id: 'cat-murukku', name: 'Murukku', slug: 'murukku', parentId: null },
    { id: 'cat-sweets', name: 'Sweets', slug: 'sweets', parentId: null },
    { id: 'cat-dry-fruits', name: 'Dry Fruits', slug: 'dry-fruits', parentId: null },
    { id: 'cat-beverages', name: 'Beverages', slug: 'beverages', parentId: null },
];
