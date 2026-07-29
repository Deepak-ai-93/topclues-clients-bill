import { getSession } from '../../lib/auth';
import AdminSidebar from './admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // If there's no session or non-admin user, render child page without sidebar (e.g. login page)
  if (!session || session.role !== 'admin') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row text-neutral-900 font-sans">
      <AdminSidebar email={session.email}>
        {children}
      </AdminSidebar>
    </div>
  );
}
