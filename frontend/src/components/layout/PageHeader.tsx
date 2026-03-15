interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export default function PageHeader({
    title,
    description,
    children,
}: PageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1.5 text-sm sm:text-base text-text-secondary max-w-2xl">
                        {description}
                    </p>
                )}
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
    );
}
