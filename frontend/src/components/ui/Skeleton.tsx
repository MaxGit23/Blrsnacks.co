interface SkeletonProps {
    className?: string;
    variant?: 'shimmer' | 'pulse';
}

export default function Skeleton({ className = '', variant = 'shimmer' }: SkeletonProps) {
    return (
        <div
            className={`rounded-[var(--radius-md)] bg-bg-tertiary ${variant === 'pulse' ? 'animate-pulse' : 'animate-shimmer'} ${className}`}
            aria-hidden="true"
        />
    );
}
