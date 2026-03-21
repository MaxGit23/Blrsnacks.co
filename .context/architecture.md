# Architecture — BLR Snacks

## Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | Next.js 16 (App Router, Turbopack), Tailwind v4  |
| Backend     | NestJS (TypeScript), Prisma ORM                  |
| Database    | MySQL (Google Cloud SQL — `blrsnacks-db`)         |
| Storage     | Google Cloud Storage (`blrsnacks-co-uploads`)     |
| Auth        | JWT (access + refresh), cookie-based sessions     |
| Deployment  | Vercel (frontend), Google Cloud (backend target)  |
| Font        | Mabry Pro (custom), Geist fallback                |

## Monorepo Layout

```
Blrsnacks.co/
├── frontend/           # Next.js 16 app
│   └── src/
│       ├── app/        # App Router pages
│       │   ├── admin/  # Admin dashboard (products, orders, inventory, customers)
│       │   ├── cart/   # Shopping cart
│       │   ├── products/  # Product listing + [slug] detail
│       │   ├── orders/ # Customer order history
│       │   ├── account/
│       │   ├── login/ & register/
│       │   └── categories/
│       ├── components/ # Shared UI kit (Button, Modal, Card, Badge, etc.)
│       └── lib/        # API client, formatters, image helpers
│           └── api/    # Per-module API wrappers (products, cart, orders, etc.)
├── backend/            # NestJS API
│   ├── api/index.ts    # Vercel serverless entry point
│   ├── prisma/schema.prisma
│   └── src/modules/    # Feature modules
│       ├── products/   # CRUD + image upload (GCS)
│       ├── categories/ # Nested categories
│       ├── cart/       # Session + user carts
│       ├── orders/     # Order lifecycle + status history
│       ├── inventory/  # Stock tracking
│       ├── auth/       # JWT auth (email + Google)
│       ├── users/      # User management
│       ├── address/    # Delivery addresses
│       └── admin/      # Admin-specific endpoints
└── docker-compose.yml  # Local dev (MySQL, etc.)
```

## Database Models (Prisma)

User → Address[], Order[], Cart[], Session[]
Category → Product[] (self-referencing parent/children)
Product → Inventory, CartItem[], OrderItem[], images(Json)
Cart → CartItem[]
Order → OrderItem[], OrderStatusHistory[], Address

## API Prefix

All backend routes: `/api/v1/*`
CORS origin: `FRONTEND_URL` env (default `http://localhost:3000`)

## Auth Flow

- JWT access token (short-lived) + refresh token (Session model)
- Cookie-based (`credentials: 'include'`)
- Guards: `JwtAuthGuard`, `RolesGuard` (ADMIN/CUSTOMER)
- Session tracking via `x-session-id` header for guest carts

## Image Pipeline

- Upload: `POST /products/:id/images` → multer (memory, 5MB, jpg/png/webp/avif) → GCS bucket
- Storage: `blrsnacks-co-uploads/products/{uuid}.{ext}`
- DB: Product.images = Json array of URLs
- Display: `getImageUrl()` helper resolves relative/absolute paths
