# Project Engineering Rules

## Core Stack (must never change)
Frontend: Next.js + TypeScript + Tailwind  
Backend: NestJS + Prisma + MySQL  
Auth: JWT + Google OAuth + RBAC  
Deployment: Vercel (frontend) + Docker backend  

## Architecture Principles
- Modular NestJS architecture only (no monolith services)
- Use DTO validation for all inputs
- Use Prisma for all DB access (no raw SQL unless necessary)
- Separate controller / service / repository logic
- All APIs must be typed and validated
- Use env config validation at startup

## Frontend Rules
- Use App Router only
- Server components by default, client components only when needed
- Central API layer (no fetch scattered everywhere)
- Reusable UI components
- Accessible HTML structure
- Mobile-first responsive design

## Naming Conventions
- Services: *.service.ts
- DTOs: *.dto.ts
- Modules: feature.module.ts
- Prisma models singular, DB tables plural

## Security Rules
- Hash passwords with bcrypt
- Never expose secrets in frontend
- Validate all inputs
- Role guards for admin routes
- Sanitize file uploads

## Performance Rules
- Pagination on all list APIs
- Lazy-load heavy frontend components
- Optimize images
- Use caching layer ready structure

## Output Rules for AI
- Do not change stack
- Do not simplify architecture
- Do not skip validation or logging
- Do not generate placeholder pseudo-code
- All code must be production-ready
