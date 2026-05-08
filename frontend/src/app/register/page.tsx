'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/Toast';
import type { ApiError } from '@/lib/api-client';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const { addToast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!email) errs.email = 'Email address is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 8) errs.password = 'Must be at least 8 characters';
        if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setErrors({});
        try {
            await register(email, password);
            addToast('Account created — welcome to BLR Snacks! 🎉', 'success');
            router.push('/');
        } catch (err) {
            const apiError = err as ApiError;
            setErrors({ general: apiError.message ?? 'Could not create your account. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 animate-fade-in">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 mb-4 shadow-lg">
                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-stone-900 font-display">Join BLR Snacks</h1>
                    <p className="text-stone-500 mt-2 font-body">Create your account and start ordering fresh snacks today</p>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-stone-200 rounded-2xl shadow-lg p-8">
                    {errors.general && (
                        <div className="mb-6 px-4 py-3 bg-error-light text-error text-sm rounded-[var(--radius-md)]" role="alert">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            id="register-email"
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            autoComplete="email"
                        />
                        <Input
                            id="register-password"
                            label="Password"
                            type="password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            autoComplete="new-password"
                        />
                        <Input
                            id="register-confirm"
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={errors.confirmPassword}
                            autoComplete="new-password"
                        />

                        <Button id="register-submit" type="submit" fullWidth size="lg" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border-light" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-stone-400">or continue with</span>
                        </div>
                    </div>

                    <button
                        id="google-register-btn"
                        type="button"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-red-300 transition-all duration-200 cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-text-secondary mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
