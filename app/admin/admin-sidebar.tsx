'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Calendar,
  UserPlus,
  LogOut,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { logoutUserAction } from '@/lib/actions';

interface AdminSidebarProps {
  email: string;
  children: React.ReactNode;
}

export default function AdminSidebar({ email, children }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/billing', label: 'Invoices', icon: CreditCard },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { href: '/admin/content', label: 'Content', icon: Calendar },
    { href: '/admin/leads', label: 'Leads', icon: UserPlus },
  ];

  const sidebarContent = (
    <>
      <div>
        <div className="p-4 md:p-6 border-b border-neutral-100 flex items-center justify-between">
          <Link href="/admin" className="flex flex-col items-start gap-2">
            <Image
              src="/Logo(1).png"
              alt="Logo"
              width={120}
              height={120}
              className="rounded-xl w-20 md:w-28"
            />
            <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Console Mode</p>
          </Link>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-4 md:px-6 py-4 bg-neutral-50 border-b border-neutral-100/60 flex items-center gap-2.5">
          <div className="w-6.5 h-6.5 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-[10px] font-bold text-neutral-700">
            AD
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-semibold truncate text-neutral-800">{email}</span>
            <span className="block text-[9px] text-emerald-600 font-mono tracking-wider font-bold">● SYSTEM ADMIN</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100/60 transition-colors"
            >
              <Icon className="w-4.5 h-4.5 text-neutral-400" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-neutral-100">
        <form action={logoutUserAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout Admin</span>
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {isMobile && (
        <header className="h-14 bg-white border-b border-neutral-200 px-4 flex items-center justify-between shrink-0 print:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-neutral-400 hover:text-neutral-600">
            <Menu className="w-5 h-5" />
          </button>
          <Image src="/Logo(1).png" alt="Logo" width={28} height={28} className="rounded-md" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
        </header>
      )}

      {isMobile ? (
        <>
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <aside className="relative w-72 max-w-[85vw] bg-white flex flex-col justify-between overflow-y-auto">
                {sidebarContent}
              </aside>
            </div>
          )}
        </>
      ) : (
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0">
          {sidebarContent}
        </aside>
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        {!isMobile && (
          <header className="h-14 bg-white border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 print:hidden">
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-mono uppercase tracking-widest bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                Role: Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-neutral-700">Audit Protocol Online</span>
              </div>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </>
  );
}
