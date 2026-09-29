# Current State

## What is Completed
*   **Database Schema**: A comprehensive, production-grade Prisma schema is defined, including Users, Orders, Products, Cart, Categories, and Inventory.
*   **Backend Modularity**: NestJS modules are structured for the core domains: `address`, `admin`, `auth`, `cart`, `categories`, `inventory`, `orders`, `products`, and `users`.
*   **Frontend Framework**: Next.js 14 App Router is set up with initial routing structures for `account`, `admin`, `cart`, `categories`, `login`, `orders`, `products`, and `register`.
*   **Project Documentation**: AI context systems (`PROJECT_CONTEXT.md`, `CURRENT_STATE.md`, `TASKS.md`, `AGENTS.md`) are established to optimize AI agent performance and prevent redundant code scanning.

## What is Currently in Progress
*   Integration of frontend UI components with the respective backend REST APIs.
*   Fleshing out comprehensive e-commerce flows (from Cart to Order confirmation).
*   Admin dashboard implementations for category and product management.

## Known Issues
*   Extensive end-to-end integration testing may be required to verify that Cart-to-Order conversion works seamlessly with the Cash on Delivery (COD) business rule.
*   Need to ensure Inventory reservation logic correctly ties in with the Order lifecycle.

## Recent Changes
*   **PREMIUM BRAND REFACTOR — COMPLETE (All 4 CRO Pillars & Phases 1-6)**:
    *   **Pillar 1: Brand Messaging & Anti-Positioning (Phase 1)**:
        *   Hero rewrite: "Not Another Snack Store." + "Small-batch South Indian craft."
        *   Anti-positioning section ("The BLR Standard"): Direct contrast of mass-market factory practices (Palm oil, chemical preservatives, stale batches) vs. the BLR Standard (Cold-pressed groundnut oil, wood-fired batches, natural spice colours).
        *   Artisanal trust badges, announcement bar with ₹750 free express shipping threshold, and outlet route `/batch-specials`.
    *   **Pillar 2: Product-Level CRO Architecture (Phase 2)**:
        *   Enriched `DemoProduct` with `artisanTags`, `ingredients`, `shelfLife`, `certifications`, `pairingTip`, `storageTip`, and `spiceLevel`.
        *   Added `SpiceLevelIndicator` and `EfficacyBadges` components (`Zero Trans-Fat`, `100% Cold-Pressed Oil`, `No Artificial Colours`, `FSSAI Certified`).
        *   PDP overhauled with Direct-from-Kitchen price, unit economics (`₹X.XX / 100g`), pack size selector (`200g`, `400g`, `500g`) with "Best Value" highlight, clean-label ingredients accordion, "Peak Crunch" storage card, and sensory coffee/tea pairing notes.
        *   Product cards updated with starting price, weight pill selection, and 1-click "Add to Tasting Vault".
    *   **Pillar 3: AOV Expansion & Cart Architecture (Phase 3 & 4)**:
        *   Built `CartDrawer` with Emil Kowalski cubic bezier motion curve (`--ease-drawer`, 280ms duration, symmetric enter/exit).
        *   Dynamic AOV free express shipping progress bar scaling up to ₹750 threshold.
        *   "Complete The Tasting" 1-click upsell recommendations embedded directly in the drawer.
        *   High-ticket curated tasting vaults (`CuratedVaults` on homepage): "The Bangalore Heritage Box" (₹699, save 15%), "Evening Kaapi & Chai Vault" (₹499, save 12%), and "Grand Festive Connoisseur Trunk" (₹999, save 18%).
    *   **Pillar 4: Social Proof & Retention (Phase 5 & 6)**:
        *   Physical Presence Authority widget (`PhysicalPresenceWidget`): 4 authentic Bangalore tasting locations (Indiranagar, Lavelle Road, Koramangala, Malleshwaram).
        *   Verifiable customer reviews with badges: "Verified Bangalore Resident", "Filter Coffee Purist", "3rd-Gen Food Purist".
        *   `CrispnessGuideModal`: 4-step craft care instructions on preserving crunch and the 2-minute monsoon crispness revival.
        *   All animations follow design engineering guidelines; zero `transition: all`, press feedback on active states, hover effects gated behind fine pointers. Webpack build compiles 22/22 routes in 2.4s.

## Next Recommended Steps
*   **Production Deployment to Vercel**: Deploy the completed 4-pillar refactor to production with `vercel --prod` from `frontend/`.
*   **Restore Supabase Backend**: When the cloud project is restored, wire the `ProductVariant` schema into Prisma and database migrations.
*   **Checkout & COD Validation**: Hook up order confirmation with the new multi-pack variant order items.
*   **LAWS OF UX APPLIED** (`f419b01`): Detail pages gained a related-products section (Peak-End/Goal-Gradient) and delivery info now sits in one bounded card (Common Region). Header search matches word-by-word in any order (Postel's Law). Announcement bar is one message on all breakpoints (Hick's/Cognitive Load). Nav reordered strongest-first/last (Serial Position). Footer links + pagination got bigger hit targets (Fitts's Law). Dead `/terms` footer link removed (Jakob's Law/trust).
*   **CATALOGUE AT 44 PRODUCTS**: Added 29 more products (`dd95ad3`) — new **Chips** category (10: potato/tapioca/wheel/onion-ring), 7 mixtures, White Chakli (murukku), 11 sweets/bakery items (barfi, chikkis, laddu, cookies/biscuits, rusk). Renamed uploads to web-safe names; fixed `avalakki.jpg` mislabeled webp-as-jpg; compressed oversized images. Homepage category strip still shows the original 6 featured cards; full list incl. Chips lives on /categories sidebar. Banana Chips category was merged into Chips (`8ab9c30`).
*   **DESIGN SYSTEM REDESIGN (emilkowalski/skills)**: Installed Emil Kowalski design-engineering skills to `.agents/skills/` and applied them site-wide — strong custom easing tokens (`--ease-out/in-out/drawer`), global press feedback (`scale(0.97)`, 160ms), hover lifts/zooms gated behind `(hover:hover) and (pointer:fine)`, all `transition-all` replaced with named properties, mobile menu rewritten as mounted panel with symmetric enter/exit transitions, scroll reveal retuned (500ms/16px/40ms stagger), removed decorative loops (badge shine, animated gradient, ungated icon scales), negative tracking on display headings. Verified tsc + build clean; live on production.
*   **PRODUCTION DEPLOYED**: Frontend live at https://blrsnacks-co.vercel.app (Vercel project `blrsnacks-co`, CLI-deployed from `frontend/`). Root cause of earlier 404s: Vercel Framework Preset was "Other" so no serverless functions were wired; fixed via `frontend/vercel.json` pinning `"framework": "nextjs"` (commit `28d3e88`). NOTE: dashboard project still shows Framework=Other + Root Directory=`.` — set Root Directory to `frontend` in the dashboard for future Git-based deploys.
*   **CODEBASE CLEANUP (production pass)**:
    *   Deleted dead files: `components/ui/{shadcn-button,get-started-button,demo,footer-column}.tsx`, `lib/utils.ts`, `lib/supabase-storage.ts`, `lib/api/{users,inventory}.ts`, `src/middleware.ts` (no-op), `src/utils/` (Supabase clients), `src/app/todos/` (Supabase demo page), unused public SVGs (next/vercel/globe/window/file), stale `.vercel/output`.
    *   Stripped all `STATIC SITE MODE` commented-out blocks from api-client, auth/cart contexts, Header, product pages — implementations are now clean.
    *   Removed unused exports: `format.ts` (formatDateTime/truncate/slugify/pluralize), `images.ts` (getImageSrcSet), homepage dead `stats` const + Button/Image imports.
    *   Uninstalled 7 unused packages: @supabase/ssr, @supabase/supabase-js, lucide-react, @radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge.
    *   Fixed: conditional `useId()` hook violation in `ui/Input.tsx`; eslint now ignores `.vercel/**`.
    *   Verified: `tsc --noEmit` clean, `next build` succeeds (14/15 routes static), all routes + demo image serve 200.
    *   Known pre-existing lint errors (NOT touched — refactoring would change behavior): `react-hooks/set-state-in-effect` in fetch-on-mount patterns (products page, admin pages, both contexts, useCountUp); `no-img-element` warnings throughout.
*   **FULL STATIC MODE**: Frontend runs with zero backend/cloud calls. REST layer throws `ApiClientDisabledError`; cart persists to localStorage; auth is local-only; pages fall back to demo catalogue (`src/lib/mock-products.ts`) with "Demo preview" banner.
*   **Weight variants**: Demo product "Classic Banana Chips" (image: local `/banana-chips.jpg`) has variants 200g=₹20, 400g=₹40, 500g=₹45. Cards render a weight dropdown; detail page renders pill buttons with per-100g price + "Best value" badge. No add-to-cart CTAs anywhere (browse-only site).
*   **DEMO CATALOGUE EXPANDED**: Added 3 new static products with local images — **Benne Butter Murukku** (200g/₹35, 400g/₹65), **Bakarwadi** (200g/₹40, 400g/₹75), **Spicy Nendran Chips** (200g/₹25, 400g/₹48, 500g/₹55). Renamed uploaded images to web-safe filenames (`benne-murukku.jpg`, `bakarwadi.jpeg`, `banana-chips-extra.jpg`). Classic Banana Chips now has a second gallery image (`banana-chips-extra.jpg`) showing as thumbnails on its detail page. Total: 4 products across 3 categories.
*   **DEMO CATALOGUE EXPANDED (2nd batch)**: Added 11 more static products with local images — **Masala Moong Dal**, **Kerala Spicy Mixture**, **Plain Moong Dal**, **Fried Peanuts**, **Ribbon Mixture**, **Special Mixture** (Mixtures); **Yellow Masala Murukku**, **Kodubale** (Murukku); **Congress Kadlekai**, **Masala Peanuts**, **Kara Boondi** (Mixtures). All with 200g/400g weight variants and web-safe filenames. Total: 15 products across 3 categories (Banana Chips, Mixtures, Murukku).
*   Backend currently NOT runnable — Supabase project `bqxnllqfjcukvfpcocfh` appears paused/deleted ("tenant not found"). Backend source left intact for future restore. Frontend runs standalone on port 3002.

## Next Recommended Steps
*   **Premium Refactor Phase 2**: Enrich `DemoProduct` type with `artisanTags`, `ingredients`, `shelfLife`, `certifications`, `pairingTip`, `storageTip`, `spiceLevel`. Un-comment weight selector + price on ProductCard and PDP. Add efficacy badges and storage/pairing cards.
*   **Premium Refactor Phase 3**: Build slide-out CartDrawer with AOV progress bar (₹750 threshold). Re-enable add-to-cart flow.
*   **Premium Refactor Phase 4**: Create curated bundles ("Bangalore Tasting Vault") and bundle cards on homepage/PDP.
*   **Premium Refactor Phase 5**: Social proof system — EfficacyBadge component, StockistFinder widget, FreshnessGuarantee card.
*   **Premium Refactor Phase 6**: Post-purchase onboarding — WelcomeModal, PairingGuideModal, re-order/referral preview.
*   Restore the paused Supabase project to bring the backend back online; then re-introduce the API layer and design the real `ProductVariant` Prisma model matching the demo shape (`{ label, weightGrams, price }`).
