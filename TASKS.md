# Tasks

## Completed (this session)
*   [x] **Premium Brand Refactor (All 4 CRO Pillars)**:
    *   **Pillar 1: Brand Messaging & Anti-Positioning**: Replaced generic store positioning with artisanal craft identity. Hero rewrite ("Not Another Snack Store."), dark comparison section ("The BLR Standard" contrasting palm-oil mass manufacturing vs. cold-pressed wood-fired methods), updated artisanal vocabulary across badges, header, footer, and announcement bar (₹750 free shipping).
    *   **Pillar 2: Product-Level CRO Architecture**: Weight variants and Direct-from-Kitchen price restored; per-100g unit economics breakdowns; interactive pack size selection with "Best Value" indicator; `EfficacyBadges` for cold-pressed oil, zero trans-fat, and FSSAI standards; expandable clean-label ingredients card; "Peak Crunch" storage tips card; sensory filter coffee/chai pairing notes; and `SpiceLevelIndicator`.
    *   **Pillar 3: AOV Expansion & Cart Architecture**: Built `CartDrawer` with Emil Kowalski motion tokens (`--ease-drawer`, 280ms duration); dynamic AOV free express shipping progress bar (scales toward ₹750 threshold); "Complete The Tasting" 1-click upsell cards; and curated high-ticket bundle vaults on homepage (`CuratedVaults`).
    *   **Pillar 4: Social Proof & Retention**: Physical Presence Authority widget (`PhysicalPresenceWidget`) covering 4 Bangalore tasting points; verified customer reviews with purist credentials; and `CrispnessGuideModal` covering 4-step crunch preservation and monsoon revival tips.
*   [x] **Design-engineering redesign**: Applied emilkowalski/skills rules across globals.css, Header, homepage, Card primitive, products + detail pages. Motion foundation: strong curves, sub-300ms durations, press feedback, gated hovers, symmetric menu transitions, retuned reveals. Live via auto-deploy `ae1d02c`.
*   [x] **Production deploy**: Site live at https://blrsnacks-co.vercel.app. Fixed Vercel 404s caused by Framework Preset "Other" — pinned `"framework": "nextjs"` in `frontend/vercel.json` and redeployed via CLI. Pending: set dashboard Root Directory=`frontend` for Git-based deploys.
*   [x] **Codebase cleanup**: Deleted dead files (shadcn/demo/footer-column/get-started components, Supabase clients + storage lib, unused api modules, no-op middleware, todos page, unused public assets), stripped all commented-out STATIC SITE MODE blocks, removed unused exports/imports/states, uninstalled 7 unused packages. Fixed conditional-useId hook bug in Input.tsx. Verified with `tsc`, `next build` (all routes static) and route smoke tests.
*   [x] **Full static mode**: Frontend runs with zero backend/cloud calls — REST layer disabled, cart persists to localStorage, auth local-only, demo catalogue fallback (`src/lib/mock-products.ts`).
*   [x] **Weight variants UI**: "Classic Banana Chips" demo product with 200g/₹20, 400g/₹40, 500g/₹45; card dropdown + detail-page pill selector with per-100g price and "Best value" badge.
*   [x] **Demo catalogue expanded**: Added 3 new products with weight variants and local images — Benne Butter Murukku (murukku), Bakarwadi (mixtures), Spicy Nendran Chips (banana-chips). Renamed uploaded files to web-safe names; Classic Banana Chips now has gallery thumbnails. Total 4 products.
*   [x] **Demo catalogue expanded (2nd batch)**: Added 11 more products — Masala Moong Dal, Kerala Spicy Mixture, Plain Moong Dal, Fried Peanuts, Ribbon Mixture, Special Mixture, Congress Kadlekai, Masala Peanuts, Kara Boondi (Mixtures); Yellow Masala Murukku, Kodubale (Murukku). All with 200g/400g variants. Total 15 products.

## Pending Tasks
*   [ ] **Pre-existing lint errors** (behavior-affecting refactor, deliberately not done during cleanup): `react-hooks/set-state-in-effect` in fetch-on-mount code (products page ×2, admin/customers, admin/inventory, admin/orders, auth-context, cart-context, useCountUp).
*   [ ] Validate End-to-End order flow from cart creation to order placement (COD).
*   [ ] Complete UI integration for the Admin dashboard (Product & Order management).
*   [ ] Implement image upload and storage logic for Product listings.
*   [ ] Verify the backend Inventory reservation system during checkout.
*   [ ] Create automated seed scripts for initial deployment.
*   [ ] **Backend: ProductVariant schema** — add `ProductVariant` model (weightGrams, price) + cart/order items referencing variantId when the backend is restored.

## High Priority Tasks
*   [ ] **Authentication Verification**: Ensure JWT lifecycle (refresh tokens, HTTP-only cookies) works smoothly between the Next.js frontend and NestJS backend.
*   [ ] **Checkout Flow**: Solidify the Cash on Delivery (COD) checkout process and ensure `OrderStatusHistory` correctly logs state changes.

## Medium Priority Tasks
*   [ ] **Pagination & Search**: Ensure all frontend product and category listings have robust pagination and search querying hooked into the backend.
*   [ ] **User Account Panel**: Allow users to seamlessly view order history and manage saved addresses.
*   [ ] **Mobile Responsiveness**: Audit frontend routes for mobile layout edge-cases.

## Future Improvements
*   [ ] **Analytics**: Integrate basic admin analytics for total sales and active orders.
*   [ ] **Performance optimization**: Ensure lazy-loading of heavy components and optimize Next.js Image usage.
*   [ ] **Testing**: Implement e2e tests (e.g. Playwright) for the critical purchase path.
