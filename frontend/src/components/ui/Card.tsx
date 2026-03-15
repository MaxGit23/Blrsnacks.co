interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
};

export default function Card({
    children,
    className = '',
    hoverable = false,
    padding = 'md',
}: CardProps) {
    return (
        <div
            className={`
        bg-white rounded-[var(--radius-lg)] border border-border-light
        shadow-[var(--shadow-sm)]
        ${hoverable ? 'transition-all duration-[var(--transition-base)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
