'use client';

import { type ElementType, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut } from 'lucide-react';
import { logoutUserAction } from '@/lib/actions';

export interface DockItem {
  icon: ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface DockFooterProps {
  items: DockItem[];
  variant?: 'landing' | 'admin' | 'client';
}

export default function DockFooter({ items, variant = 'landing' }: DockFooterProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2 sm:pb-3 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-2xl sm:rounded-3xl bg-white/70 backdrop-blur-xl border border-neutral-200/70 shadow-lg shadow-black/5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.isActive !== undefined ? item.isActive : (item.href ? pathname === item.href : false);

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all cursor-pointer ${
                  active
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[8px] sm:text-[10px] font-semibold leading-tight whitespace-nowrap">{item.label}</span>
              </button>
            );
          }

          if (item.href === 'logout') {
            return (
              <form key="logout" action={logoutUserAction}>
                <button
                  type="submit"
                  className="flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all cursor-pointer text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[8px] sm:text-[10px] font-semibold leading-tight whitespace-nowrap">Logout</span>
                </button>
              </form>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href || '#'}
              className={`flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all ${
                active
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[8px] sm:text-[10px] font-semibold leading-tight whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
