# Blrsnacks.co — Performance Optimization Guide

## Backend (NestJS + Prisma + MySQL)

### Database Optimization

1. **Indexes are defined** — Prisma schema includes `@@index` on all foreign keys and query-heavy fields
2. **Connection pooling** — Prisma manages a connection pool automatically. For production, tune via `DATABASE_URL`:
   ```
   DATABASE_URL=mysql://user:pass@host:3306/db?connection_limit=20&pool_timeout=30
   ```
3. **Pagination on all list APIs** — enforced via `limit` + `page` params (skill.md rule)
4. **Select only needed fields** — use Prisma `select` or `include` to avoid over-fetching relations

### Caching Strategy (Ready Structure)

The architecture is cache-ready. When scaling, add Redis:

```bash
npm install @nestjs/cache-manager cache-manager cache-manager-redis-yet
```

Cache candidates (by frequency, not volatility):
| Endpoint | TTL | Reason |
|----------|-----|--------|
| `GET /categories` | 1 hour | Rarely changes |
| `GET /products` (listing) | 5 min | Moderate update frequency |
| `GET /products/:slug` | 2 min | Individual product detail |
| `GET /inventory/low-stock` | 1 min | Changes with orders |

### API Response Optimization

1. **Compression** — add `compression` middleware:
   ```bash
   npm install compression @types/compression
   ```
   ```typescript
   // main.ts
   import compression from 'compression';
   app.use(compression());
   ```

2. **Payload trimming** — use `@Exclude()` from `class-transformer` on sensitive fields
3. **Batch queries** — Prisma `Promise.all` for dashboard stats (already done in admin page)

---

## Frontend (Next.js + Tailwind)

### Image Optimization

1. **`getImageUrl()` helper** — resolves backend image paths to full URLs
2. **`loading="lazy"`** — applied on all product images in listing/cart
3. **Responsive srcSet** — `generateSrcSet()` utility available in `lib/images.ts`
4. **Next.js Image component** — for critical hero images, use `next/image`:
   ```tsx
   import Image from 'next/image';
   <Image src={url} alt={name} width={400} height={400} priority />
   ```
5. **Placeholder SVG** — `public/placeholder-product.svg` prevents layout shift

### Bundle Optimization

1. **Server Components by default** — only `'use client'` where interactivity is needed
2. **Dynamic imports** — for heavy modals/components:
   ```tsx
   const AdminChart = dynamic(() => import('@/components/admin/Chart'), { ssr: false });
   ```
3. **Tree shaking** — barrel exports (`index.ts`) allow selective imports
4. **No unnecessary polyfills** — targeting modern browsers via `tsconfig.json`

### Loading Performance

1. **Skeleton loaders** — every page shows `<Skeleton>` components during data fetch
2. **Streaming with Suspense** — `<Suspense>` boundaries on pages using `useSearchParams`
3. **`loading.tsx`** — App Router global loading state
4. **Route prefetching** — Next.js `<Link>` prefetches by default

### CSS Performance

1. **Tailwind v4** — purges unused styles automatically
2. **CSS variables for design tokens** — in `globals.css`, not runtime-computed
3. **No runtime CSS-in-JS** — zero JS overhead for styles

### State Management

1. **React Context** — lightweight, no external library overhead
2. **Debounced search** — `useDebounce(400ms)` prevents excessive API calls
3. **Optimistic updates** — cart context syncs globally (header badge auto-updates)

---

## Infrastructure

### Production Checklist

- [ ] Enable MySQL query cache or use ProxySQL for read replicas
- [ ] Set up CDN (CloudFront / Cloudflare) for static assets
- [ ] Enable Gzip/Brotli compression at reverse proxy level
- [ ] Set `Cache-Control` headers on static assets (images, fonts)
- [ ] Monitor with APM (DataDog, New Relic, or Grafana)
- [ ] Set up log aggregation (ELK stack or cloud logging)

### Monitoring Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/health` | Liveness probe (Docker HEALTHCHECK) |
| Backend logs | Request timing via `LoggingInterceptor` |
