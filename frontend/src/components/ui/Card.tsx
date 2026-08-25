import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    variant?: 'default' | 'elevated' | 'outline';
}

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
};

const variantClasses = {
    default: 'bg-white border border-slate-200 shadow-sm',
    elevated: 'bg-white shadow-xl border-0',
    outline: 'bg-transparent border border-slate-200',
};

export default function Card({
    children,
    className = '',
    hoverable = false,
    padding = 'md',
    variant = 'default',
}: CardProps) {
    return (
        <div
            className={`
        rounded-xl ${variantClasses[variant]}
        ${hoverable ? 'card-hover cursor-pointer' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}