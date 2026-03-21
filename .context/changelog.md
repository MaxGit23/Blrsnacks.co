# Changelog

## 2026-03-17 — Admin Image Management

### Backend
- **Added** `PUT /products/:id/images` — replace full images array (reorder/bulk update)
- **Added** `DELETE /products/:id/images` — remove single image by URL
- **Added** `ProductsService.addImages()` — append new URLs to existing array
- **Added** `ProductsService.removeImage()` — filter out a specific URL
- **Changed** `POST /products/:id/images` now appends (was replacing)
- **Changed** `updateImages()` now includes category + inventory in response

### Frontend
- **Added** Image management section in admin product create/edit modal
  - Upload button with file picker (multi-select)
  - 5MB client-side validation with toast error messages
  - File type validation (JPEG, PNG, WebP, AVIF)
  - Existing images grid with hover-to-delete overlay
  - "Primary" badge on first image
  - Staged pending images with "New" badge and size indicator
  - Empty state with click-to-upload placeholder
  - Upload progress indicator
- **Changed** `ApiClient.delete()` now accepts optional body (for `DELETE /images`)
- **Added** `productsApi.updateImages()` and `productsApi.deleteImage()`

### Build Status
- ✅ Frontend: `next build` passes
- ✅ Backend: `tsc --noEmit` passes
