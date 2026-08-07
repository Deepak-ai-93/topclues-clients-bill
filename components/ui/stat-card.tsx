import * as React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: LucideIcon;
  href?: string;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  trend,
  trendPositive = true,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-neutral-200 rounded-2xl p-5 shadow-card hover:shadow-raised hover:border-neutral-300 transition-all flex flex-col justify-between group',
        className
      )}
    >
      <div className="flex justify-between items-start gap-3">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider leading-snug">
          {label}
        </span>
        <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100 group-hover:bg-primary-50 group-hover:border-primary-200 transition-all shrink-0">
          <Icon className="w-4 h-4 text-neutral-500 group-hover:text-primary-600 transition-colors" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">{value}</div>
          {hint && <p className="text-[10px] text-neutral-500 mt-1 uppercase font-mono">{hint}</p>}
        </div>
        <div className="flex flex-col items-end gap-1">
          {trend && (
            <span
              className={cn(
                'text-[11px] font-mono font-bold',
                trendPositive ? 'text-accent-600' : 'text-rose-600'
              )}
            >
              {trend}
            </span>
          )}
          {href && (
            <Link
              href={href}
              className="text-[11px] font-semibold text-neutral-700 hover:text-primary flex items-center gap-1 transition-colors"
            >
              View <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
