import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* ─── Image Optimization ─────────────────────────────────────────────────── */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.blrsnacks.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  /* ─── Security Headers ───────────────────────────────────────────────────── */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },

  /* ─── Redirects (e.g. trailing slash normalization) ──────────────────────── */
  trailingSlash: false,

  /* ─── Environment validation at build time ───────────────────────────────── */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  /* ─── Compiler optimizations ─────────────────────────────────────────────── */
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
