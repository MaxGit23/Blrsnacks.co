export default function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`rounded-[var(--radius-md)] animate-shimmer ${className}`}
            aria-hidden="true"
        />
    );
}
