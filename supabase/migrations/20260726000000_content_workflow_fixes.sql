-- Content workflow fixes. Runs AFTER the content_calendars / leads migration.

-- 1) content_calendars: asset columns referenced by lib/actions.ts were missing.
ALTER TABLE content_calendars
  ADD COLUMN asset_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN asset_name TEXT NOT NULL DEFAULT '';

-- 2) Widen CHECK constraints to support the full content approval workflow and
--    platform set from the Doctor Hub specification.
ALTER TABLE content_calendars DROP CONSTRAINT content_calendars_platform_check;
ALTER TABLE content_calendars ADD CONSTRAINT content_calendars_platform_check
  CHECK (platform IN ('social', 'blog', 'email', 'video', 'other',
                      'facebook', 'instagram', 'youtube', 'linkedin', 'google_business', 'x'));

ALTER TABLE content_calendars DROP CONSTRAINT content_calendars_status_check;
ALTER TABLE content_calendars ADD CONSTRAINT content_calendars_status_check
  CHECK (status IN ('draft', 'internal_review', 'pending_approval', 'approved',
                    'changes_requested', 'scheduled', 'published', 'archived'));

ALTER TABLE leads DROP CONSTRAINT leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'appointment_booked', 'follow_up_required',
                    'converted', 'not_interested', 'invalid', 'duplicate'));

ALTER TABLE leads DROP CONSTRAINT leads_source_check;
ALTER TABLE leads ADD CONSTRAINT leads_source_check
  CHECK (source IN ('website', 'referral', 'social', 'email', 'call', 'other',
                    'whatsapp', 'instagram', 'facebook', 'meta_ads', 'google_ads', 'campaign'));

-- 3) RLS policies for tables created in the analytics_reports / content_leads
--    migrations (they had RLS enabled but zero policies).
CREATE POLICY "analytics_reports_select_own" ON analytics_reports
  FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "analytics_reports_admin_all" ON analytics_reports
  FOR ALL USING (public.is_admin());

CREATE POLICY "content_calendars_select_own" ON content_calendars
  FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "content_calendars_admin_all" ON content_calendars
  FOR ALL USING (public.is_admin());

CREATE POLICY "leads_select_own" ON leads FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "leads_admin_all" ON leads FOR ALL USING (public.is_admin());
