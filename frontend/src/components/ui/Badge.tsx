type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-bg-tertiary text-text-secondary',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    error: 'bg-error-light text-error',
    info: 'bg-info-light text-info',
    brand: 'bg-brand-primary-light text-brand-primary',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-full)]
        text-xs font-semibold tracking-wide uppercase
        ${variantClasses[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
