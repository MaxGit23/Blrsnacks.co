import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-bg-inverse text-text-inverse mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 text-lg font-bold mb-3">
                            <span className="text-xl">🍌</span>
                            <span>BLR Snacks</span>
                        </Link>
                        <p className="text-sm text-text-inverse/60 leading-relaxed">
                            Authentic Bangalore snacks delivered fresh to your door. Quality flavours, always.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-text-inverse/80">Shop</h3>
                        <ul className="space-y-2.5">
                            <li><Link href="/products" className="text-sm text-text-inverse/60 hover:text-brand-accent transition-colors">All Products</Link></li>
                            <li><Link href="/categories" className="text-sm text-text-inverse/60 hover:text-brand-accent transition-colors">Categories</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-text-inverse/80">Account</h3>
                        <ul className="space-y-2.5">
                            <li><Link href="/login" className="text-sm text-text-inverse/60 hover:text-brand-accent transition-colors">Login</Link></li>
                            <li><Link href="/register" className="text-sm text-text-inverse/60 hover:text-brand-accent transition-colors">Sign Up</Link></li>
                            <li><Link href="/orders" className="text-sm text-text-inverse/60 hover:text-brand-accent transition-colors">My Orders</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-text-inverse/80">Support</h3>
                        <ul className="space-y-2.5">
                            <li><span className="text-sm text-text-inverse/60">help@blrsnacks.co</span></li>
                            <li><span className="text-sm text-text-inverse/60">Bangalore, India</span></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-10 pt-6 text-center">
                    <p className="text-xs text-text-inverse/40">
                        © {new Date().getFullYear()} BLR Snacks. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
