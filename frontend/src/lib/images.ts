const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

/**
 * Resolves a product image path to a full URL.
 * Backend may return relative paths, full URLs, or null.
 */
export function getImageUrl(path: string | undefined | null): string {
    if (!path) return '/placeholder-product.svg';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // Backend-served uploads live under /uploads/ on the API origin
    if (path.startsWith('/uploads/')) {
        const origin = API_BASE.replace(/\/api\/v[0-9]+$/, '');
        return `${origin}${path}`;
    }
    // Anything else is a static asset bundled in /public (e.g. /banana-chips.jpg)
    return path;
}
