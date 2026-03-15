import Skeleton from '@/components/ui/Skeleton';

export default function RootLoading() {
    return (
        <div className="min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero skeleton */}
            <Skeleton className="w-full h-64 mb-8" />

            {/* Content grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="w-full h-48" />
                        <Skeleton className="w-3/4 h-4" />
                        <Skeleton className="w-1/2 h-4" />
                    </div>
                ))}
            </div>
        </div>
    );
}
