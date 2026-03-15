'use client';

import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', label, error, options, placeholder, id, ...props }, ref) => {
        const selectId = id ?? label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-text-primary mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={`
            w-full px-3.5 py-2.5 rounded-[var(--radius-md)]
            border bg-white text-text-primary
            transition-all duration-[var(--transition-fast)]
            focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary
            ${error
                            ? 'border-error focus:ring-error/30 focus:border-error'
                            : 'border-border-default hover:border-border-dark'
                        }
            disabled:bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-60
            appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20fill%3D'none'%20viewBox%3D'0%200%2024%2024'%20stroke-width%3D'2'%20stroke%3D'%236b7280'%3E%3Cpath%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%20d%3D'M19.5%208.25l-7.5%207.5-7.5-7.5'%2F%3E%3C%2Fsvg%3E")]
            bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10
            ${className}
          `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1.5 text-sm text-error">{error}</p>
                )}
            </div>
        );
    },
);

Select.displayName = 'Select';
export default Select;
