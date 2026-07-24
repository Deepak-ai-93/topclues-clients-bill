import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import { supabaseAdmin } from '../../lib/supabase';
import ClientSidebar from './client-sidebar';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== 'client') {
    redirect('/client/login');
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('name')
    .eq('id', session.userId)
    .single();

  const clientName = profile?.name || 'Valued Client';

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row text-neutral-900 font-sans">
      <ClientSidebar clientName={clientName} email={session.email}>
        {children}
      </ClientSidebar>
    </div>
  );
}
