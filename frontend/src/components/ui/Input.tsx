'use client';

import { type InputHTMLAttributes, forwardRef, type ReactNode, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    variant?: 'default' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, helperText, startIcon, endIcon, variant = 'default', id, ...props }, ref) => {
        const inputId = id ?? useId();

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-semibold text-slate-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {startIcon && (
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true">
                            {startIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`
            w-full px-4 py-3 rounded-xl text-slate-900 placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
            ${variant === 'filled' ? 'bg-slate-50 border-0 hover:bg-slate-100' : 'bg-white border border-slate-200 hover:border-slate-300'}
            ${startIcon ? 'pl-11' : ''}
            ${endIcon ? 'pr-11' : ''}
            ${error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-200'
            }
            disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60
            ${className}
          `}
                        aria-invalid={error ? 'true' : undefined}
                        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                        {...props}
                    />
                    {endIcon && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true">
                            {endIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-slate-500">{helperText}</p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';
export default Input;