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
        id: 'demo-product-tomato-murukku',
        name: 'Tomato Murukku',
        slug: 'tomato-murukku',
        description:
            'Tangy tomato murukku — rice flour spirals infused with ripe tomato and a gentle chilli warmth. Crispy, bright, and hard to share.',
        price: 38,
        images: ['/tomato-murukku.jpeg'],
        isPublished: true,
        category: { id: 'demo-cat-murukku', name: 'Murukku', slug: 'murukku' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vt-200g', label: '200g', weightGrams: 200, price: 38 },
            { id: 'vt-400g', label: '400g', weightGrams: 400, price: 70 },
        ],
    },
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
    {
        id: 'demo-product-salted-potato-chips',
        name: 'Salted Potato Chips',
        slug: 'salted-potato-chips',
        description:
            'Kettle-crisp potato slices fried golden and finished with pure rock salt. Simple, crunchy, and dangerously moreish.',
        price: 30,
        images: ['/salted-potato-chips.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vsp-200g', label: '200g', weightGrams: 200, price: 30 },
            { id: 'vsp-400g', label: '400g', weightGrams: 400, price: 55 },
        ],
    },
    {
        id: 'demo-product-spicy-potato-chips',
        name: 'Spicy Potato Chips',
        slug: 'spicy-potato-chips',
        description:
            'Golden potato chips dusted in a bold chilli masala — the fiery cousin of our classic salted chips.',
        price: 32,
        images: ['/spicy-potato-chips.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vspu-200g', label: '200g', weightGrams: 200, price: 32 },
            { id: 'vspu-400g', label: '400g', weightGrams: 400, price: 60 },
        ],
    },
    {
        id: 'demo-product-pudina-potato-chips',
        name: 'Pudina Potato Chips',
        slug: 'pudina-potato-chips',
        description:
            'Crispy potato chips coated in a cool mint (pudina) masala — fresh herby flavour with a gentle kick.',
        price: 35,
        images: ['/pudina-potato-chips.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vpd-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vpd-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-red-garlic-potato-chips',
        name: 'Red Garlic Potato Chips',
        slug: 'red-garlic-potato-chips',
        description:
            'Thick-cut potato chips tossed in red chilli and roasted garlic — punchy, aromatic, unforgettable.',
        price: 38,
        images: ['/red-garlic-potato-chips.jpeg'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vrg-200g', label: '200g', weightGrams: 200, price: 38 },
            { id: 'vrg-400g', label: '400g', weightGrams: 400, price: 72 },
        ],
    },
    {
        id: 'demo-product-kerala-tapioca-chips',
        name: 'Kerala Tapioca Chips',
        slug: 'kerala-tapioca-chips',
        description:
            'Thin tapioca (kappa) slices fried light and crisp with just rock salt — Kerala’s beloved tea-time chip.',
        price: 35,
        images: ['/tapioca-chips.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vtp-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vtp-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-salted-tapioca-chips',
        name: 'Salted Tapioca Chips',
        slug: 'salted-tapioca-chips',
        description:
            'Crinkle-cut tapioca chips with an even salt crunch in every bite — sturdy, snappy, satisfying.',
        price: 35,
        images: ['/tapioca-chips-scaled-salted.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vts-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vts-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-spicy-tapioca-chips',
        name: 'Spicy Tapioca Chips',
        slug: 'spicy-tapioca-chips',
        description:
            'Crinkle-cut tapioca chips fired up with chilli masala — big crunch with a lingering heat.',
        price: 38,
        images: ['/tapioca-chips-scaled-spicy.webp'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vtsp-200g', label: '200g', weightGrams: 200, price: 38 },
            { id: 'vtsp-400g', label: '400g', weightGrams: 400, price: 72 },
        ],
    },
    {
        id: 'demo-product-wheel-chips-salted',
        name: 'Wheel Chips Salted',
        slug: 'wheel-chips-salted',
        description:
            'Pinwheel-shaped chips fried into delicate, crackly wheels with a light salt finish.',
        price: 30,
        images: ['/wheel-chips-salted.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vws-200g', label: '200g', weightGrams: 200, price: 30 },
            { id: 'vws-400g', label: '400g', weightGrams: 400, price: 55 },
        ],
    },
    {
        id: 'demo-product-wheel-chips-spicy',
        name: 'Wheel Chips Spicy',
        slug: 'wheel-chips-spicy',
        description:
            'Crackly pinwheel chips shaken through spicy masala — the snack bowl’s first thing to vanish.',
        price: 32,
        images: ['/wheel-chips-spicy.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vwsp-200g', label: '200g', weightGrams: 200, price: 32 },
            { id: 'vwsp-400g', label: '400g', weightGrams: 400, price: 60 },
        ],
    },
    {
        id: 'demo-product-onion-ring-chips',
        name: 'Onion Ring Chips',
        slug: 'onion-ring-chips',
        description:
            'Crisp onion-flavoured rings with a savoury, slightly sweet snap — perfect with chai or as a party filler.',
        price: 35,
        images: ['/onion-ring-chips.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-crisps', name: 'Chips', slug: 'chips' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vor-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vor-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-bombay-mixture',
        name: 'Bombay Mixture',
        slug: 'bombay-mixture',
        description:
            'The classic Bombay blend — sev, boondi, peanuts, and lentils balanced sweet, spicy, and tangy.',
        price: 38,
        images: ['/bombay-mixture.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vbm-200g', label: '200g', weightGrams: 200, price: 38 },
            { id: 'vbm-400g', label: '400g', weightGrams: 400, price: 70 },
        ],
    },
    {
        id: 'demo-product-ragi-mixture',
        name: 'Ragi Mixture',
        slug: 'ragi-mixture',
        description:
            'Wholesome ragi (finger millet) crisps roasted with spices — the guilt-free crunchy alternative.',
        price: 36,
        images: ['/ragi-mixture.webp'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vrgm-200g', label: '200g', weightGrams: 200, price: 36 },
            { id: 'vrgm-400g', label: '400g', weightGrams: 400, price: 68 },
        ],
    },
    {
        id: 'demo-product-omapodi-mixture',
        name: 'Omapodi Mixture',
        slug: 'omapodi-mixture',
        description:
            'Fine ajwain omapodi strands tossed with roasted gram and curry leaves — soft heat, deep flavour.',
        price: 32,
        images: ['/omapodi-mixture.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vom-200g', label: '200g', weightGrams: 200, price: 32 },
            { id: 'vom-400g', label: '400g', weightGrams: 400, price: 60 },
        ],
    },
    {
        id: 'demo-product-cornflakes-chivda',
        name: 'Cornflakes Chivda',
        slug: 'cornflakes-chivda',
        description:
            'Toasted cornflakes with peanuts, curry leaves, and a honeyed spice glaze — light, sweet-heat chivda.',
        price: 35,
        images: ['/cornflakes.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vcf-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vcf-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-avalakki-chivda',
        name: 'Avalakki Poha Chivda',
        slug: 'avalakki-chivda',
        description:
            'Roasted flattened rice (avalakki) with peanuts and dry fruits, tempered with curry leaves and chilli.',
        price: 35,
        images: ['/avalakki.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vap-200g', label: '200g', weightGrams: 200, price: 35 },
            { id: 'vap-400g', label: '400g', weightGrams: 400, price: 65 },
        ],
    },
    {
        id: 'demo-product-uppu-kadalai',
        name: 'Uppu Kadalai',
        slug: 'uppu-kadalai',
        description:
            'Salt-fried peanuts done the old Bengaluru way — simple, salty, and impossible to stop at one handful.',
        price: 30,
        images: ['/uppu-kadalai.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vuk-200g', label: '200g', weightGrams: 200, price: 30 },
            { id: 'vuk-400g', label: '400g', weightGrams: 400, price: 55 },
        ],
    },
    {
        id: 'demo-product-salted-green-peas',
        name: 'Salted Green Peas',
        slug: 'salted-green-peas',
        description:
            'Fried green peas with a clean salt hit and gentle pepper warmth — light crunch, big satisfaction.',
        price: 32,
        images: ['/green-peas-salted.jpeg'],
        isPublished: true,
        category: { id: 'demo-cat-mixtures', name: 'Mixtures', slug: 'mixtures' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vgp-200g', label: '200g', weightGrams: 200, price: 32 },
            { id: 'vgp-400g', label: '400g', weightGrams: 400, price: 60 },
        ],
    },
    {
        id: 'demo-product-white-chakli',
        name: 'White Chakli',
        slug: 'white-chakli',
        description:
            'Snowy white chakli spirals made from fine rice flour — featherlight crisp with a buttery finish.',
        price: 36,
        images: ['/white-chakli.webp'],
        isPublished: true,
        category: { id: 'demo-cat-murukku', name: 'Murukku', slug: 'murukku' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vwc-200g', label: '200g', weightGrams: 200, price: 36 },
            { id: 'vwc-400g', label: '400g', weightGrams: 400, price: 68 },
        ],
    },
    {
        id: 'demo-product-coconut-barfi',
        name: 'Coconut Barfi',
        slug: 'coconut-barfi',
        description:
            'Soft coconut fudge squares slow-cooked with sugar and cardamom, cut thick like grandmother made.',
        price: 70,
        images: ['/coconut-barfi.webp'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vcb-250g', label: '250g', weightGrams: 250, price: 70 },
            { id: 'vcb-500g', label: '500g', weightGrams: 500, price: 130 },
        ],
    },
    {
        id: 'demo-product-peanut-chikki',
        name: 'Peanut Chikki',
        slug: 'peanut-chikki',
        description:
            'Jaggery-set peanut brittle with that perfect snap — roasted peanuts held in glossy, caramel jaggery.',
        price: 40,
        images: ['/peanut-chikki.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vpc-200g', label: '200g', weightGrams: 200, price: 40 },
            { id: 'vpc-400g', label: '400g', weightGrams: 400, price: 75 },
        ],
    },
    {
        id: 'demo-product-crushed-peanut-chikki',
        name: 'Crushed Peanut Chikki',
        slug: 'crushed-peanut-chikki',
        description:
            'All the joy of classic chikki in crumbly, share-ready shards — extra peanut in every broken piece.',
        price: 40,
        images: ['/crushed-peanut-chikki.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vcpc-200g', label: '200g', weightGrams: 200, price: 40 },
            { id: 'vcpc-400g', label: '400g', weightGrams: 400, price: 75 },
        ],
    },
    {
        id: 'demo-product-till-ke-laddu',
        name: 'Till Ke Laddu',
        slug: 'till-ke-laddu',
        description:
            'Sesame (till) laddus bound with jaggery — nutty, warming sweetness packed with winter goodness.',
        price: 60,
        images: ['/till-ke-laddu.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vtl-250g', label: '250g', weightGrams: 250, price: 60 },
            { id: 'vtl-500g', label: '500g', weightGrams: 500, price: 110 },
        ],
    },
    {
        id: 'demo-product-khara-cookies',
        name: 'Khara Cookies',
        slug: 'khara-cookies',
        description:
            'Iyengar-style khara (savory) cookies — buttery, salty, faintly spiced shortbread that melts on contact.',
        price: 45,
        images: ['/khara-cookies.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vkc-200g', label: '200g', weightGrams: 200, price: 45 },
            { id: 'vkc-400g', label: '400g', weightGrams: 400, price: 85 },
        ],
    },
    {
        id: 'demo-product-heart-cookies',
        name: 'Heart Cookies',
        slug: 'heart-cookies',
        description:
            'Buttery heart-shaped bakery biscuits with a tender snap — the tea-time classic from Bangalore bakeries.',
        price: 50,
        images: ['/heart-cookies.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vhc-200g', label: '200g', weightGrams: 200, price: 50 },
            { id: 'vhc-400g', label: '400g', weightGrams: 400, price: 95 },
        ],
    },
    {
        id: 'demo-product-rose-cookies',
        name: 'Rose Cookies',
        slug: 'rose-cookies',
        description:
            'Lacy rose-shaped cookies pressed from rice flour batter — shatteringly crisp with vanilla warmth.',
        price: 48,
        images: ['/rose-cookies.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vrc-200g', label: '200g', weightGrams: 200, price: 48 },
            { id: 'vrc-400g', label: '400g', weightGrams: 400, price: 90 },
        ],
    },
    {
        id: 'demo-product-salt-cookies',
        name: 'Salt Cookies',
        slug: 'salt-cookies',
        description:
            'Delicately salted butter cookies — the understated hero of every Bangalore bakery counter.',
        price: 42,
        images: ['/salt-cookies.webp'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vsc-200g', label: '200g', weightGrams: 200, price: 42 },
            { id: 'vsc-400g', label: '400g', weightGrams: 400, price: 80 },
        ],
    },
    {
        id: 'demo-product-cashew-biscuit',
        name: 'Cashew Biscuit',
        slug: 'cashew-biscuit',
        description:
            'Rich shortbread studded with whole cashews — dense, buttery, and baked to a pale gold.',
        price: 55,
        images: ['/cashew-biscuit.jpg'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vcbs-200g', label: '200g', weightGrams: 200, price: 55 },
            { id: 'vcbs-400g', label: '400g', weightGrams: 400, price: 105 },
        ],
    },
    {
        id: 'demo-product-milk-biscuits',
        name: 'Milk Biscuits',
        slug: 'milk-biscuits',
        description:
            'Malty milk biscuits with a soft crumble — nostalgic dunking material for your evening coffee.',
        price: 40,
        images: ['/milk-biscuits.webp'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vmb-200g', label: '200g', weightGrams: 200, price: 40 },
            { id: 'vmb-400g', label: '400g', weightGrams: 400, price: 75 },
        ],
    },
    {
        id: 'demo-product-tea-rusk',
        name: 'Tea Rusk',
        slug: 'tea-rusk',
        description:
            'Twice-baked rusk toast with a caramelised crunch — built specifically for dunking into filter coffee.',
        price: 30,
        images: ['/rusk.jpeg'],
        isPublished: true,
        category: { id: 'demo-cat-sweets', name: 'Sweets', slug: 'sweets' },
        createdAt: new Date('2026-08-25').toISOString(),
        variants: [
            { id: 'vrk-200g', label: '200g', weightGrams: 200, price: 30 },
            { id: 'vrk-400g', label: '400g', weightGrams: 400, price: 55 },
        ],
    },
];

export function findDemoProductBySlug(slug: string): DemoProduct | undefined {
    return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

/** Sidebar category fallback while the backend is offline. */
export const FALLBACK_CATEGORIES: Category[] = [
    { id: 'cat-banana-chips', name: 'Banana Chips', slug: 'banana-chips', parentId: null },
    { id: 'cat-chips', name: 'Chips', slug: 'chips', parentId: null },
    { id: 'cat-mixtures', name: 'Mixtures', slug: 'mixtures', parentId: null },
    { id: 'cat-murukku', name: 'Murukku', slug: 'murukku', parentId: null },
    { id: 'cat-sweets', name: 'Sweets', slug: 'sweets', parentId: null },
    { id: 'cat-dry-fruits', name: 'Dry Fruits', slug: 'dry-fruits', parentId: null },
    { id: 'cat-beverages', name: 'Beverages', slug: 'beverages', parentId: null },
];
