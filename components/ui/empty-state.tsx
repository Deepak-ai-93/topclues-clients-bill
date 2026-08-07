import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'py-12 text-center border border-dashed border-neutral-300 rounded-2xl bg-neutral-50/40',
        className
      )}
    >
      <div className="w-11 h-11 mx-auto mb-3 rounded-xl border border-neutral-200 bg-white flex items-center justify-center">
        <Icon className="w-5 h-5 text-neutral-400" />
      </div>
      <p className="text-sm font-semibold text-neutral-700">{title}</p>
      {description && <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
