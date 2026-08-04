'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Package,
  CheckSquare,
  CalendarDays,
  BarChart3,
  FileText,
  UserPlus,
  Radio,
  Share2,
  Tag,
  Star,
  FolderOpen,
  HelpCircle,
  Video,
  Bell,
  Settings,
  Menu,
  X
} from 'lucide-react';
import DockFooter from '@/components/DockFooter';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClientSidebarProps {
  clientName: string;
  email: string;
  children: React.ReactNode;
}

const navLinks = [
  { href: '/client', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/client/profile', label: 'My Profile', icon: User },
  { href: '/client/package', label: 'My Package', icon: Package },
  { href: '/client/content', label: 'Content Approval', icon: CheckSquare },
  { href: '/client/calendar', label: 'Content Calendar', icon: CalendarDays },
  { href: '/client/reports', label: 'Monthly Reports', icon: BarChart3 },
  { href: '/client/invoices', label: 'Invoices', icon: FileText },
  { href: '/client/leads', label: 'Leads', icon: UserPlus },
  { href: '/client/campaigns', label: 'Campaigns', icon: Radio },
  { href: '/client/social', label: 'Social Media', icon: Share2 },
  { href: '/client/offers', label: 'Special Offers', icon: Tag },
  { href: '/client/reviews', label: 'Reviews & Feedback', icon: Star },
  { href: '/client/documents', label: 'Documents', icon: FolderOpen },
  { href: '/client/support', label: 'Support', icon: HelpCircle },
  { href: '/client/meetings', label: 'Meetings', icon: Video },
  { href: '/client/notifications', label: 'Notifications', icon: Bell },
  { href: '/client/settings', label: 'Settings', icon: Settings },
];

export default function ClientSidebar({ clientName, email, children }: ClientSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 md:p-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
        <Link href="/client" className="flex flex-col items-start gap-1.5">
          <div className="bg-white p-1 rounded-xl">
            <Image
              src="/Logo(1).png"
              alt="Logo"
              width={300}
              height={300}
              className="w-28 md:w-40 h-auto"
            />
          </div>
          <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Doctor Hub</p>
        </Link>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-4 md:px-6 py-3 bg-neutral-50/50 border-b border-neutral-100 flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white uppercase font-mono shrink-0">
          {clientName.substring(0, 2).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <span className="block text-xs font-semibold truncate text-neutral-800">{clientName}</span>
          <span className="block text-[9px] text-neutral-400 font-mono truncate">{email}</span>
        </div>
      </div>

      <nav className="p-3 space-y-0.5 overflow-y-auto flex-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white rounded-lg'
                  : 'text-neutral-600 hover:bg-neutral-100 rounded-lg'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <aside className="relative w-72 max-w-[85vw] bg-white flex flex-col justify-between overflow-y-auto h-full">
                {sidebarContent}
              </aside>
            </div>
          )}
        </>
      ) : (
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0 h-screen sticky top-0">
          {sidebarContent}
        </aside>
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        {isMobile && (
          <div className="sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-700 p-1 rounded-md hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5 text-neutral-600" />
              <span>Menu</span>
            </button>
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-500">Doctor Hub</span>
          </div>
        )}
        <div className="flex-1 overflow-auto pb-20 sm:pb-24">{children}</div>
      </main>

      <DockFooter
        variant="client"
        items={[
          { href: '/client', icon: LayoutDashboard, label: 'Dashboard' },
          { href: '/client/content', icon: CheckSquare, label: 'Content' },
          { href: '/client/leads', icon: UserPlus, label: 'Leads' },
          { href: '/client/support', icon: HelpCircle, label: 'Support' },
          { href: '/client/notifications', icon: Bell, label: 'Notifications' },
        ]}
      />
    </>
  );
}
