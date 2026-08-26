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
*   Restore the paused Supabase project to bring the backend back online; then re-introduce the API layer and design the real `ProductVariant` Prisma model matching the demo shape (`{ label, weightGrams, price }`).
