# Decisions & Tradeoffs

## D001 — Image storage: GCS over local filesystem
- **Date**: 2026-03
- **Choice**: Google Cloud Storage bucket (`blrsnacks-co-uploads`)
- **Why**: Scalable, CDN-friendly, no disk management on serverless
- **Tradeoff**: Requires GCS credentials in backend env; adds cloud dependency

## D002 — Images stored as JSON array on Product, not separate table
- **Date**: 2026-03
- **Choice**: `Product.images` is a `Json` column storing `string[]`
- **Why**: Simpler queries, no join needed for listing; images are tightly coupled to product
- **Tradeoff**: No per-image metadata (alt text, sort order) — would need migration to a separate `ProductImage` model if needed later

## D003 — Multer memory storage (not disk)
- **Date**: 2026-03
- **Choice**: `memoryStorage()` for file uploads
- **Why**: Serverless-friendly (Vercel, Cloud Run have ephemeral disks), stream directly to GCS
- **Tradeoff**: Large uploads consume server memory; mitigated by 5MB per-file limit

## D004 — 5MB image size limit
- **Date**: 2026-03-17
- **Choice**: 5MB max per image, enforced both client-side (JS) and server-side (multer)
- **Why**: Prevents oversized uploads that slow page loads and eat GCS bandwidth
- **Tradeoff**: Users with hi-res photos must resize externally

## D005 — Soft delete for products
- **Choice**: `deletedAt` timestamp instead of hard delete
- **Why**: Preserves order history references, allows recovery
- **Tradeoff**: Queries need `deletedAt: null` filter everywhere

## D006 — Auto-create inventory on product create (stock=999)
- **Choice**: Default 999 stock on product creation
- **Why**: Simplifies MVP — admin manages stock separately via inventory page
- **Tradeoff**: Inaccurate stock if admin doesn't update; revisit when real inventory tracking needed

## D007 — COD-only payment
- **Choice**: `PaymentMethod` enum has only `COD`
- **Why**: MVP — no payment gateway integration yet
- **Tradeoff**: Limits revenue; needs Razorpay/Stripe integration for online payments

## D008 — Upload-then-save flow for new product images
- **Date**: 2026-03-17
- **Choice**: Create product first → then upload images in a second request
- **Why**: Backend upload endpoint needs a product ID to associate images; simpler than FormData merge with JSON body
- **Tradeoff**: Brief window where product exists without images; acceptable for admin workflow
