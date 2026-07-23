import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import { logoutUserAction } from '../../lib/actions';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { supabaseAdmin } from '../../lib/supabase';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // If not logged in or not a client, redirect to login page
  if (!session || session.role !== 'client') {
    redirect('/');
  }

  // Fetch client details from database
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('name')
    .eq('id', session.userId)
    .single();

  const clientName = profile?.name || 'Valued Client';

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row text-neutral-900 font-sans">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <Link href="/client" className="flex items-center gap-2">
              <Image
                src="/Logo(1).png"
                alt="Marketing Medicine"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div>
                <span className="font-semibold text-sm tracking-tight text-neutral-900">Marketing Medicine</span>
                <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Safe Gateway</p>
              </div>
            </Link>
          </div>

          {/* Quick Identity Section */}
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100/60 flex items-center gap-2.5">
            <div className="w-6.5 h-6.5 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-bold text-white uppercase font-mono">
              {clientName.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-semibold truncate text-neutral-800">{clientName}</span>
              <span className="block text-[9px] text-neutral-400 font-mono truncate">{session.email}</span>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="p-4 space-y-1">
            <Link 
              href="/client" 
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100/60 transition-colors"
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-neutral-400" />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>

        {/* Sign Out Button in Sidebar Footer */}
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
      </aside>

      {/* Main content body */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
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

        {/* Content canvas */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
