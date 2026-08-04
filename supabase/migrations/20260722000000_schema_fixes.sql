-- Schema fixes applied after the legacy initial_schema migration.

-- 1) Backfill profiles from the legacy users table where a matching Supabase
--    Auth user exists. Legacy password hashes cannot be migrated to Auth.
INSERT INTO profiles (id, email, name, role, status, created_at)
SELECT au.id, au.email, COALESCE(u.email, ''), u.role, COALESCE(u.status, 'active'), u.created_at
FROM users u
JOIN auth.users au ON au.email = u.email
ON CONFLICT (id) DO NOTHING;

-- 2) Drop the legacy users table (password hashes now live in Supabase Auth).
--    The legacy clients/activity_logs/login_history tables are unused by the
--    app; drop their FK references first so the table can be removed.
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_user_id_fkey;
ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey;
ALTER TABLE login_history DROP CONSTRAINT IF EXISTS login_history_user_id_fkey;
DROP TABLE IF EXISTS users;

-- 3) billing_documents: used by lib/actions.ts but was never created in a
--    migration - a fresh `db reset` previously produced a broken schema.
CREATE TABLE IF NOT EXISTS billing_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  billing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('paid', 'pending', 'overdue', 'partially_paid', 'cancelled', 'refunded')),
  pdf_url TEXT NOT NULL DEFAULT '',
  pdf_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotent column backfill: an existing remote billing_documents table may
-- predate this migration and lack the newer columns.
ALTER TABLE billing_documents ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE billing_documents ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'
  CHECK (payment_status IN ('paid', 'pending', 'overdue', 'partially_paid', 'cancelled', 'refunded'));

ALTER TABLE billing_documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_billing_documents_client_id ON billing_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_billing_documents_payment_status ON billing_documents(payment_status);

-- 4) RLS policies for tables created in the initial_schema migration.
--    Pattern: authenticated users may read their own rows; only admins write.

DROP POLICY IF EXISTS "clients_select_own" ON clients;
CREATE POLICY "clients_select_own" ON clients FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "clients_admin_all" ON clients;
CREATE POLICY "clients_admin_all" ON clients FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "packages_read_authenticated" ON packages;
CREATE POLICY "packages_read_authenticated" ON packages
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "client_package_history_select_own" ON client_package_history;
CREATE POLICY "client_package_history_select_own" ON client_package_history
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM clients c WHERE c.id = client_package_history.client_id AND c.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "client_package_history_admin_all" ON client_package_history;
CREATE POLICY "client_package_history_admin_all" ON client_package_history
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "invoices_select_own" ON invoices;
CREATE POLICY "invoices_select_own" ON invoices FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "invoices_admin_all" ON invoices;
CREATE POLICY "invoices_admin_all" ON invoices FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "upgrade_requests_select_own" ON upgrade_requests;
CREATE POLICY "upgrade_requests_select_own" ON upgrade_requests
  FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "upgrade_requests_admin_all" ON upgrade_requests;
CREATE POLICY "upgrade_requests_admin_all" ON upgrade_requests
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "client_notifications_select_own" ON client_notifications;
CREATE POLICY "client_notifications_select_own" ON client_notifications
  FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "client_notifications_admin_all" ON client_notifications;
CREATE POLICY "client_notifications_admin_all" ON client_notifications
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "support_tickets_select_own" ON support_tickets;
CREATE POLICY "support_tickets_select_own" ON support_tickets
  FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "support_tickets_admin_all" ON support_tickets;
CREATE POLICY "support_tickets_admin_all" ON support_tickets
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "ticket_replies_select_own" ON ticket_replies;
CREATE POLICY "ticket_replies_select_own" ON ticket_replies
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM support_tickets t WHERE t.id = ticket_replies.ticket_id AND t.client_id = auth.uid()
  ));
DROP POLICY IF EXISTS "ticket_replies_admin_all" ON ticket_replies;
CREATE POLICY "ticket_replies_admin_all" ON ticket_replies
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "billing_documents_select_own" ON billing_documents;
CREATE POLICY "billing_documents_select_own" ON billing_documents
  FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "billing_documents_admin_all" ON billing_documents;
CREATE POLICY "billing_documents_admin_all" ON billing_documents
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "activity_logs_admin_all" ON activity_logs;
CREATE POLICY "activity_logs_admin_all" ON activity_logs
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "login_history_admin_all" ON login_history;
CREATE POLICY "login_history_admin_all" ON login_history
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "admin_settings_admin_all" ON admin_settings;
CREATE POLICY "admin_settings_admin_all" ON admin_settings
  FOR ALL USING (public.is_admin());