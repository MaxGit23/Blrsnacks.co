import Link from 'next/link';

const footerLinks = {
  shop: [
    { href: '/products', label: 'All Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/categories/chips', label: 'Banana Chips' },
    { href: '/categories/mixtures', label: 'Mixtures' },
    { href: '/categories/sweets', label: 'Sweets' },
  ],
  account: [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Sign Up' },
    { href: '/orders', label: 'My Orders' },
    { href: '/account', label: 'Account Settings' },
  ],
  support: [
    { label: 'help@blrsnacks.co', href: 'mailto:help@blrsnacks.co' },
    { label: '+91 98765 43210', href: 'tel:+919876543210' },
  ],
};

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/blrsnacks' },
  { label: 'Facebook', href: 'https://facebook.com/blrsnacks' },
  { label: 'Twitter', href: 'https://twitter.com/blrsnacks' },
];

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold mb-4 cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                            </div>
                            <span className="font-display tracking-wide">BLR Snacks</span>
                        </Link>
                        <p className="text-stone-400 leading-relaxed mb-6 max-w-sm font-body">
                            Authentic Bangalore snacks delivered fresh to your door. 
                            Quality flavours, traditional recipes, modern convenience.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center bg-stone-800 rounded-full text-stone-400 hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer"
                                    aria-label={social.label}
                                >
                                    {social.label === 'Instagram' && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    )}
                                    {social.label === 'Facebook' && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.471h3.047V9.362c0-3.012 1.792-4.675 4.533-4.675 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.248h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    )}
                                    {social.label === 'Twitter' && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                        </svg>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/80">Shop</h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-stone-400 hover:text-red-400 transition-colors cursor-pointer">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/80">Account</h3>
                        <ul className="space-y-3">
                            {footerLinks.account.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-stone-400 hover:text-red-400 transition-colors cursor-pointer">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/80">Contact</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="text-sm text-stone-400 hover:text-red-400 transition-colors cursor-pointer">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-800 mt-12 pt-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-stone-500">
                            © {new Date().getFullYear()} BLR Snacks. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-sm text-stone-500 hover:text-red-400 transition-colors cursor-pointer">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-sm text-stone-500 hover:text-red-400 transition-colors cursor-pointer">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}