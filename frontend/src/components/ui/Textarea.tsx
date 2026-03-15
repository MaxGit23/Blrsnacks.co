'use client';

import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', label, error, helperText, id, ...props }, ref) => {
        const textareaId = id ?? label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-text-primary mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={4}
                    className={`
            w-full px-3.5 py-2.5 rounded-[var(--radius-md)]
            border bg-white text-text-primary placeholder:text-text-tertiary
            transition-all duration-[var(--transition-fast)] resize-y
            focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary
            ${error
                            ? 'border-error focus:ring-error/30 focus:border-error'
                            : 'border-border-default hover:border-border-dark'
                        }
            disabled:bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-60
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-error">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-text-tertiary">{helperText}</p>
                )}
            </div>
        );
    },
);

Textarea.displayName = 'Textarea';
export default Textarea;
