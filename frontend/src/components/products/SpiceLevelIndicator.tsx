import React from 'react';
import type { SpiceLevel } from '@/lib/mock-products';

interface SpiceLevelIndicatorProps {
    level: SpiceLevel;
    className?: string;
    showLabel?: boolean;
}

export function SpiceLevelIndicator({
    level,
    className = '',
    showLabel = true,
}: SpiceLevelIndicatorProps) {
    const config = {
        mild: { count: 1, label: 'Mild Spice', color: 'bg-emerald-500' },
        medium: { count: 2, label: 'Medium Warmth', color: 'bg-amber-500' },
        hot: { count: 3, label: 'Fiery Kick', color: 'bg-rose-500' },
    }[level] || { count: 1, label: 'Mild Spice', color: 'bg-emerald-500' };

    return (
        <div
            className={`inline-flex items-center gap-1.5 text-xs text-text-tertiary ${className}`}
            title={`Spice Profile: ${config.label}`}
            aria-label={`Spice level: ${config.label}`}
        >
            <div className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3].map((step) => (
                    <span
                        key={step}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            step <= config.count ? config.color : 'bg-stone-200'
                        }`}
                    />
                ))}
            </div>
            {showLabel && (
                <span className="font-medium text-[11px] text-stone-600">{config.label}</span>
            )}
        </div>
    );
}
