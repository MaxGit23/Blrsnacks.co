import Link from 'next/link';
import Button from './Button';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon = '📦',
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
                {title}
            </h3>
            <p className="text-sm text-text-secondary mb-6 max-w-sm">
                {description}
            </p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <Button variant="primary" size="md">
                        {actionLabel}
                    </Button>
                </Link>
            )}
            {actionLabel && onAction && !actionHref && (
                <Button variant="primary" size="md" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
