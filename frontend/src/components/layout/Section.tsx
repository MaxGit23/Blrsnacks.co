interface SectionProps {
    children: React.ReactNode;
    className?: string;
    background?: 'primary' | 'secondary' | 'tertiary' | 'inverse';
    padding?: 'sm' | 'md' | 'lg' | 'xl';
}

const bgClasses = {
    primary: 'bg-bg-primary',
    secondary: 'bg-bg-secondary',
    tertiary: 'bg-bg-tertiary',
    inverse: 'bg-bg-inverse text-text-inverse',
};

const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
};

export default function Section({
    children,
    className = '',
    background = 'primary',
    padding = 'lg',
}: SectionProps) {
    return (
        <section
            className={`
        ${bgClasses[background]}
        ${paddingClasses[padding]}
        ${className}
      `}
        >
            {children}
        </section>
    );
}
