'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { logoutUserAction } from '@/lib/actions';

interface ClientSidebarProps {
  clientName: string;
  email: string;
  children: React.ReactNode;
}

export default function ClientSidebar({ clientName, email, children }: ClientSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const sidebarContent = (
    <>
      <div>
        <div className="p-4 md:p-6 border-b border-neutral-100 flex items-center justify-between">
          <Link href="/client" className="flex flex-col items-start gap-2">
            <div className="bg-white p-2 rounded-xl">
              <Image
                src="/Logo(1).png"
                alt="Logo"
                width={120}
                height={120}
                className="w-16 md:w-20"
              />
            </div>
            <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Safe Gateway</p>
          </Link>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-4 md:px-6 py-4 bg-white border-b border-neutral-100 flex items-center gap-2.5">
          <div className="w-6.5 h-6.5 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-bold text-white uppercase font-mono">
            {clientName.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-semibold truncate text-neutral-800">{clientName}</span>
            <span className="block text-[9px] text-neutral-400 font-mono truncate">{email}</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href="/client"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100/60 transition-colors"
          >
            <LayoutDashboard className="w-4.5 h-4.5 text-neutral-400" />
            <span>Dashboard</span>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-neutral-100">
        <form action={logoutUserAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout Client</span>
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
          <div className="bg-white rounded-md p-0.5">
            <Image src="/Logo(1).png" alt="Logo" width={28} height={28} className="rounded" />
          </div>
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
                Gateway: Client Secure
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-neutral-700">Client Isolation Guard Active</span>
              </div>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </>
  );
}
