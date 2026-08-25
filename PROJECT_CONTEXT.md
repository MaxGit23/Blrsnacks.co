# Project Context

## Project Overview
Blrsnacks.co is a production-ready grocery/snacks ecommerce platform inspired by regrocery.co. The platform features an integrated frontend and backend architecture designed to handle product browsing, cart management, and order processing with Cash on Delivery (COD).

## Tech Stack
*   **Frontend**: Next.js 14+ (App Router) with TypeScript, React, and Tailwind CSS.
*   **Backend**: NestJS with TypeScript.
*   **Database**: PostgreSQL (managed via Prisma ORM).
*   **Authentication**: Custom JWT authentication and Google OAuth.
*   **Deployment**: Vercel (Frontend) and Docker (Backend).

## Architecture
*   **Backend Structure**: A modular, domain-driven NestJS architecture. The system avoids monolith services by isolating features into dedicated modules (`auth`, `users`, `products`, `categories`, `cart`, `orders`, `inventory`, `admin`, `address`).
*   **Frontend Structure**: Follows Next.js App Router conventions with a centralized API layer, reusable UI components, and mobile-first responsive design principles. Defaults to server components where possible.
*   **API Design**: Strict RESTful API design. All endpoints utilize Data Transfer Objects (DTOs) for robust input validation.

## Folder Structure
```text
/
├── frontend/             # Next.js Application
│   ├── src/app/          # Next.js App Router pages and layouts
│   ├── src/components/   # Reusable UI components
│   ├── src/context/      # React context providers
│   ├── src/hooks/        # Custom React hooks
│   ├── src/lib/          # Shared utilities and API clients
│   └── src/utils/        # Helper functions
├── backend/              # NestJS API Application
│   ├── prisma/           # Prisma schema and migrations
│   ├── src/modules/      # Feature modules (address, admin, auth, cart, etc.)
│   ├── src/common/       # Shared NestJS guards, interceptors, and filters
│   └── src/config/       # Environment configuration loading
└── docker-compose.yml    # Local PostgreSQL database and backend deployment config
```

## Database Design
The Prisma ORM strictly manages database access. Key models include:
*   **User**: Handles customer and admin data with role-based access control (RBAC).
*   **Session**: Refresh token persistence and device tracking.
*   **Address**: User shipping locations.
*   **Category & Product**: Manages the catalog, nested subcategories, and published state.
*   **Inventory**: Tracks product stock and reserved quantities.
*   **Cart & CartItem**: Manages user shopping carts and active sessions.
*   **Order & OrderItem**: Records completed transactions, locked prices, and linked addresses.
*   **OrderStatusHistory**: Audit trail for order status changes.

## Authentication Flow
*   **Flow**: Users authenticate via email/password or Google OAuth. The backend issues a short-lived JWT access token and a long-lived refresh token.
*   **Security**: Passwords are bcrypt-hashed. Refresh tokens are stored in the database (`Session` model) and as HTTP-only cookies to prevent XSS. Role-based guards protect admin routes.

## Business Rules
*   **Payment**: Cash on Delivery (COD) only.
*   **Ordering**: Orders require a linked Address and are tracked via a strictly defined state machine (`PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
*   **Inventory**: Stock is decremented appropriately (and potentially reserved) when orders are placed.
*   **No Mock Data**: The system relies on real database logic. Fake demo code is prohibited.

## Coding Standards
*   TypeScript strict mode enabled across the stack.
*   Naming conventions: `*.service.ts`, `*.dto.ts`, `*.module.ts`. Prisma models are singular.
*   Pagination is required for all list APIs.
*   Never expose secrets on the frontend; validate all inputs on the backend.

## Deployment Information
*   **Frontend**: Hosted on Vercel.
*   **Backend**: Hosted on Vercel — **https://blrsnacksbackend.vercel.app/**
*   **Database**: PostgreSQL (Supabase).
*   **Configuration**: Rely heavily on environment-based configuration via `.env`, validated at backend startup.
