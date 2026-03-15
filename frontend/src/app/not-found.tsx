import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="animate-fade-in-up">
                <div className="text-7xl font-bold text-brand-primary mb-4">404</div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                    Page Not Found
                </h1>
                <p className="text-text-secondary mb-8 max-w-md">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link href="/">
                    <Button variant="primary" size="lg">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
