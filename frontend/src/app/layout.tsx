import type { Metadata } from 'next';
import { Karla } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout';
import { Footer } from '@/components/layout';

const karla = Karla({
  variable: '--font-karla',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'BLR Snacks — Authentic Bangalore Snacks Delivered Fresh',
    template: '%s | BLR Snacks',
  },
  description:
    'Authentic Bangalore snacks delivered fresh to your door. Explore chips, mixtures, sweets, and more from BLR Snacks.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blrsnacks.co'),
  openGraph: {
    siteName: 'BLR Snacks',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${karla.variable} antialiased flex flex-col min-h-screen`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        <Providers>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
