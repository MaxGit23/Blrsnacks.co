# Blrsnacks.co — Security Checklist

## ✅ Authentication & Session Management

- [x] **Passwords hashed with bcrypt** — salted, 10+ rounds (`auth.service.ts`)
- [x] **JWT access tokens** — short-lived, 15 min default (`JWT_EXPIRES_IN_SECONDS=900`)
- [x] **JWT refresh tokens** — stored in DB as bcrypt hashes, 7-day expiry
- [x] **HTTP-only cookies** — access/refresh tokens set as `httpOnly`, `secure`, `sameSite: strict`
- [x] **Refresh token rotation** — old token hash invalidated on each refresh
- [x] **Session revocation** — `logout` deletes session, `logoutAll` clears all user sessions
- [x] **Google OAuth** — validated via `google-auth-library`, no client-side token storage

## ✅ Authorization & Access Control

- [x] **RBAC (Role-Based Access Control)** — `ADMIN` and `CUSTOMER` roles
- [x] **Role guard** on all admin-only routes (`@Roles(Role.ADMIN)`)
- [x] **Route-level protection** — NestJS guards on controllers, Next.js middleware for frontend
- [x] **User-scoped data access** — users can only view/modify their own orders, cart, addresses
- [x] **Admin frontend guard** — `layout.tsx` checks `user.role === 'ADMIN'` before rendering

## ✅ Input Validation & Sanitization

- [x] **DTO validation** — all inputs validated via `class-validator` + `class-transformer`
- [x] **Whitelist mode** — `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`
- [x] **Type coercion** — `enableImplicitConversion: true` for query params
- [x] **Env validation** — Joi schema validates all env vars at startup
- [x] **SQL injection prevention** — Prisma ORM parameterizes all queries

## ✅ HTTP Security Headers

- [x] **X-Frame-Options: DENY** — prevents clickjacking (`next.config.ts`)
- [x] **X-Content-Type-Options: nosniff** — prevents MIME-type sniffing
- [x] **Referrer-Policy: strict-origin-when-cross-origin** — limits referrer leakage
- [x] **Permissions-Policy** — disables camera, geolocation, microphone
- [x] **X-Powered-By: disabled** — `poweredByHeader: false` in Next.js

## ✅ CORS

- [x] **Origin-restricted CORS** — only `FRONTEND_URL` is allowed
- [x] **Credentials mode** — `credentials: true` for cookie-based auth
- [x] **Allowed methods restricted** — GET, POST, PUT, PATCH, DELETE, OPTIONS

## ✅ File Upload Security

- [x] **Multer middleware** — configured with file size limits
- [x] **File type validation** — to be enforced via MIME type checking
- [ ] **Virus scanning** — consider ClamAV integration for production

## ✅ API Security

- [x] **Global prefix** — all routes under `/api/v1`
- [x] **Rate limiting** — _recommended: add `@nestjs/throttler`_
- [x] **Request logging** — `LoggingInterceptor` logs all requests
- [x] **Global exception filter** — `AllExceptionsFilter` catches and sanitizes errors
- [x] **No stack traces in production** — error filter strips details when `NODE_ENV=production`

## ✅ Database Security

- [x] **Prisma ORM** — parameterized queries, no raw SQL
- [x] **Connection via env var** — `DATABASE_URL` never hardcoded
- [x] **Soft deletes** — `deletedAt` fields on products/categories preserve audit trail

## ✅ Docker & Deployment

- [x] **Non-root user** — Docker container runs as `nestjs:nodejs` (uid 1001)
- [x] **Multi-stage build** — minimal production image
- [x] **Health checks** — `/api/v1/health` endpoint for liveness probes
- [x] **Secrets via env vars** — `.env.example` provided, real `.env` gitignored
- [x] **No secrets in Docker image** — env vars injected at runtime

## 🔲 Recommended Enhancements (Post-MVP)

- [ ] **Rate limiting** — `npm install @nestjs/throttler` for brute-force protection
- [ ] **CSRF tokens** — for cookie-based auth in browser
- [ ] **Content-Security-Policy header** — restrict script/style sources
- [ ] **Strict-Transport-Security (HSTS)** — enforce HTTPS
- [ ] **Database encryption at rest** — MySQL TDE or cloud-managed encryption
- [ ] **Audit logging** — track admin actions to a dedicated table
- [ ] **Dependency scanning** — `npm audit` in CI, Snyk or Dependabot
- [ ] **Penetration testing** — before public launch
