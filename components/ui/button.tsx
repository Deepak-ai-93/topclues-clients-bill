'use client';

import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-700 border border-primary shadow-primary',
        secondary: 'bg-white text-neutral-900 hover:bg-neutral-100 border border-primary',
        outline: 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-300 hover:border-primary',
        ghost: 'bg-transparent text-primary-700 hover:bg-primary-50 border border-transparent',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600',
      },
      size: {
        sm: 'text-xs px-3 py-1.5 rounded-md',
        md: 'text-sm px-4 py-2 rounded-lg',
        lg: 'text-base px-6 py-3 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  external?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, external, type, ...props }, ref) => {
    if (href) {
      return (
        <Link
          href={href}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          className={cn(buttonVariants({ variant, size }), className)}
        >
          {props.children}
        </Link>
      );
    }
    return (
      <button
        ref={ref}
        type={type || 'button'}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
