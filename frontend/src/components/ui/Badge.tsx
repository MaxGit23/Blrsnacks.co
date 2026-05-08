import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand';

interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    brand: 'bg-red-100 text-red-700',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-full
        text-xs font-semibold tracking-wide
        ${variantClasses[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}