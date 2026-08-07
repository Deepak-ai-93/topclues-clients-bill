import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wide rounded-full border whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-primary-50 text-primary-700 border-primary-200',
        accent: 'bg-accent-50 text-accent-700 border-accent-200',
        neutral: 'bg-neutral-50 text-neutral-600 border-neutral-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        rose: 'bg-rose-50 text-rose-700 border-rose-200',
        solid: 'bg-primary text-white border-primary',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-blink" aria-hidden="true" />}
      {children}
    </span>
  );
}

export { badgeVariants };
