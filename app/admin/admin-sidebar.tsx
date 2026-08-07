'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Calendar,
  UserPlus,
  Menu,
  X,
  Tag,
  Star,
  Video,
  FileText,
  Bell,
  HelpCircle
} from 'lucide-react';
import DockFooter from '@/components/DockFooter';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminSidebarProps {
  email: string;
  children: React.ReactNode;
}

export default function AdminSidebar({ email, children }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/billing', label: 'Invoices', icon: CreditCard },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { href: '/admin/content', label: 'Content', icon: Calendar },
    { href: '/admin/leads', label: 'Leads', icon: UserPlus },
    { href: '/admin/offers', label: 'Offers', icon: Tag },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/meetings', label: 'Meetings', icon: Video },
    { href: '/admin/documents', label: 'Documents', icon: FileText },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/tickets', label: 'Tickets', icon: HelpCircle },
  ];

  const sidebarContent = (
    <>
      <div>
        <div className="p-4 md:p-6 border-b border-neutral-100 flex items-center justify-between">
          <Link href="/admin" className="flex flex-col items-start gap-2">
            <div className="bg-white p-2 rounded-xl">
              <Image
                src="/Logo(1).png"
                alt="Logo"
                width={300}
                height={300}
                className="w-28 md:w-40 h-auto"
              />
            </div>
            <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Console Mode</p>
          </Link>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-4 md:px-6 py-4 bg-white border-b border-neutral-100 flex items-center gap-2.5">
          <div className="w-6.5 h-6.5 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-[10px] font-bold text-neutral-700">
            AD
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-semibold truncate text-neutral-800">{email}</span>
            <span className="block text-[9px] text-accent-600 font-mono tracking-wider font-bold">● SYSTEM ADMIN</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-neutral-600 hover:text-primary hover:bg-neutral-100/60'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
                )}
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-primary-600' : 'text-neutral-400'}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

    </>
  );

  return (
    <>
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
        <div className="flex-1 overflow-auto pb-20 sm:pb-24">{children}</div>
      </main>

      <DockFooter
        variant="admin"
        items={[
          { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { href: '/admin/clients', icon: Users, label: 'Clients' },
          { href: '/admin/billing', icon: CreditCard, label: 'Invoices' },
          { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
          { href: '/admin/content', icon: Calendar, label: 'Content' },
          { href: '/admin/leads', icon: UserPlus, label: 'Leads' },
          { href: '/admin/tickets', icon: HelpCircle, label: 'Tickets' },
          { href: 'logout', icon: Users, label: 'Logout' },
        ]}
      />
    </>
  );
}
