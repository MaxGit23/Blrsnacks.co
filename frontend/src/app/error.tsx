'use client';

import Button from '@/components/ui/Button';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="animate-fade-in-up">
                <div className="text-6xl mb-6">😵</div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                    Something went wrong
                </h1>
                <p className="text-text-secondary mb-8 max-w-md">
                    {error.message || 'An unexpected error occurred. Please try again.'}
                </p>
                <Button onClick={reset} variant="primary" size="lg">
                    Try again
                </Button>
            </div>
        </div>
    );
}
