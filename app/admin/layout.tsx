import { getSession } from '../../lib/auth';
import AdminLoginForm from './login-form';
import AdminSidebar from './admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row text-neutral-900 font-sans">
      <AdminSidebar email={session.email}>
        {children}
      </AdminSidebar>
    </div>
  );
}
