'use client';

import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-600/25',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-lg',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50 active:scale-[0.98]',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-600/25',
    success: 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-lg shadow-green-600/25',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-2 gap-1.5 rounded-lg',
    md: 'text-sm px-5 py-2.5 gap-2 rounded-lg',
    lg: 'text-base px-7 py-3.5 gap-2.5 rounded-xl',
};

const iconSizes: Record<ButtonSize, string> = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className = '',
            variant = 'primary',
            size = 'md',
            isLoading = false,
            fullWidth = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            ...props
        },
        ref,
    ) => {
        const iconSizeClass = iconSizes[size];
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          inline-flex items-center justify-center font-semibold
          transition-all duration-200 ease-out
          focus-visible:outline-2 focus-visible:outline-red-600 focus-visible:outline-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
                {...props}
            >
                {isLoading && (
                    <svg
                        className={`animate-spin ${iconSizeClass}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {!isLoading && leftIcon && (
                    <span className={`flex-shrink-0 ${iconSizeClass}`} aria-hidden="true">
                        {leftIcon}
                    </span>
                )}
                {children}
                {!isLoading && rightIcon && (
                    <span className={`flex-shrink-0 ${iconSizeClass}`} aria-hidden="true">
                        {rightIcon}
                    </span>
                )}
            </button>
        );
    },
);

Button.displayName = 'Button';
export default Button;