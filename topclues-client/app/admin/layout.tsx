import { getSession } from '../../lib/auth';
import { logoutUserAction } from '../../lib/actions';
import Link from 'next/link';
import AdminLoginForm from './login-form';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';

// Next.js layout should be a Server Component for secure session validation
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // If not logged in or not admin, show admin login form
  if (!session || session.role !== 'admin') {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row text-neutral-900 font-sans">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
                T
              </div>
              <div>
                <span className="font-semibold text-sm tracking-tight text-neutral-900">TopClues Admin</span>
                <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Console Mode</p>
              </div>
            </Link>
          </div>

          {/* Quick Identity Section */}
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100/60 flex items-center gap-2.5">
            <div className="w-6.5 h-6.5 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-[10px] font-bold text-neutral-700">
              AD
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-semibold truncate text-neutral-800">{session.email}</span>
              <span className="block text-[9px] text-emerald-600 font-mono tracking-wider font-bold">● SYSTEM ADMIN</span>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="p-4 space-y-1">
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100/60 transition-colors"
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-neutral-400" />
              <span>Dashboard</span>
            </Link>

            <Link 
              href="/admin/clients" 
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100/60 transition-colors"
            >
              <Users className="w-4.5 h-4.5 text-neutral-400" />
              <span>Clients</span>
            </Link>

            <Link 
              href="/admin/billing" 
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100/60 transition-colors"
            >
              <CreditCard className="w-4.5 h-4.5 text-neutral-400" />
              <span>Billing</span>
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
              <span>Logout Admin</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content body */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar (for navigation on small screens, global title/actions) */}
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

        {/* Content canvas */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
