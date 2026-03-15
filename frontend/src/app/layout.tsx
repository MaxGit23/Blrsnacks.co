import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout';
import { Footer } from '@/components/layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
