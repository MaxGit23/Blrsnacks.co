const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

/**
 * Resolves a product image path to a full URL.
 * Backend may return relative paths, full URLs, or null.
 */
export function getImageUrl(path: string | undefined | null): string {
    if (!path) return '/placeholder-product.svg';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // Strip /api/v1 suffix from base and append the image path
    const origin = API_BASE.replace(/\/api\/v[0-9]+$/, '');
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Generates responsive srcSet for Next.js <Image> or standard <img>.
 */
export function getImageSrcSet(
    path: string | undefined | null,
    widths: number[] = [320, 640, 960, 1280],
): string {
    const url = getImageUrl(path);
    if (url.startsWith('/')) return ''; // local fallback, no srcset needed
    return widths.map((w) => `${url}?w=${w} ${w}w`).join(', ');
}
