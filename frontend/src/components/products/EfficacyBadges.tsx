import React from 'react';

interface EfficacyBadgesProps {
    certifications?: string[];
    className?: string;
    variant?: 'compact' | 'full';
}

export function EfficacyBadges({
    certifications = [],
    className = '',
    variant = 'full',
}: EfficacyBadgesProps) {
    if (!certifications || certifications.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {certifications.map((cert) => {
                return (
                    <div
                        key={cert}
                        className={`inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-stone-50/80 text-stone-700 font-medium ${
                            variant === 'compact'
                                ? 'px-2 py-0.5 text-[10px]'
                                : 'px-3 py-1 text-xs shadow-xs'
                        }`}
                    >
                        <svg
                            className={`text-emerald-600 shrink-0 ${variant === 'compact' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>{cert}</span>
                    </div>
                );
            })}
        </div>
    );
}
