-- Doctor Hub modules: schema for content comments, package usage, offers,
-- reviews, meetings, notifications, campaigns, social snapshots, documents,
-- lead follow-ups, and extended support tickets.

-- 1) Extend support_tickets with spec fields
ALTER TABLE support_tickets
  ADD COLUMN category TEXT NOT NULL DEFAULT 'Other',
  ADD COLUMN priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ADD COLUMN assigned_to TEXT NOT NULL DEFAULT '',
  ADD COLUMN expected_response TEXT NOT NULL DEFAULT '',
  ADD COLUMN resolved_at TIMESTAMPTZ;

-- 2) Extend leads with spec fields
ALTER TABLE leads
  ADD COLUMN interested_service TEXT NOT NULL DEFAULT '',
  ADD COLUMN location TEXT NOT NULL DEFAULT '',
  ADD COLUMN campaign_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN assigned_staff TEXT NOT NULL DEFAULT '',
  ADD COLUMN next_followup_date DATE;

-- 3) Extend content_calendars with spec fields
ALTER TABLE content_calendars
  ADD COLUMN content_type TEXT NOT NULL DEFAULT 'post',
  ADD COLUMN language TEXT NOT NULL DEFAULT 'English',
  ADD COLUMN approval_deadline DATE,
  ADD COLUMN version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN published_url TEXT NOT NULL DEFAULT '';

-- 4) Content comments (approval threads)
CREATE TABLE content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_calendars(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'client' CHECK (author_role IN ('admin', 'client')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5) Package usage tracker
CREATE TABLE package_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  included INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  in_progress INTEGER NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, service, period)
);

-- 6) Special offers
CREATE TABLE special_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  offer_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_pct INTEGER NOT NULL DEFAULT 0,
  valid_until DATE,
  eligibility TEXT NOT NULL DEFAULT 'All active clients',
  terms TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE offer_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES special_offers(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'enquiry' CHECK (status IN ('enquiry', 'claimed', 'converted')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7) Reviews & feedback
CREATE TABLE reviews_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  publish_consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'published', 'flagged', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8) Meetings
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  meeting_date TIMESTAMPTZ NOT NULL,
  meeting_type TEXT NOT NULL DEFAULT 'Review',
  link TEXT NOT NULL DEFAULT '',
  agenda TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9) Notifications (in-portal)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'general'
    CHECK (type IN ('content', 'invoice', 'package', 'lead', 'report', 'offer', 'support', 'meeting', 'security', 'general')),
  link TEXT NOT NULL DEFAULT '',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10) Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'facebook'
    CHECK (platform IN ('facebook', 'instagram', 'google', 'whatsapp', 'youtube', 'linkedin', 'other')),
  objective TEXT NOT NULL DEFAULT 'awareness'
    CHECK (objective IN ('awareness', 'conversion', 'lead_generation', 'traffic', 'video_views', 'engagement')),
  budget DECIMAL(10,2) NOT NULL DEFAULT 0,
  spend DECIMAL(10,2) NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  cpl DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11) Social media snapshots (manually maintained / periodically imported)
CREATE TABLE social_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL
    CHECK (platform IN ('facebook', 'instagram', 'youtube', 'linkedin', 'google_business', 'x')),
  followers BIGINT NOT NULL DEFAULT 0,
  reach BIGINT NOT NULL DEFAULT 0,
  impressions BIGINT NOT NULL DEFAULT 0,
  engagement DECIMAL(8,2) NOT NULL DEFAULT 0,
  profile_visits INTEGER NOT NULL DEFAULT 0,
  posts_published INTEGER NOT NULL DEFAULT 0,
  best_post TEXT NOT NULL DEFAULT '',
  last_synced TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, platform)
);

-- 12) Document library
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('agreements', 'certificates', 'brand', 'reports', 'billing', 'meetings', 'general')),
  file_url TEXT NOT NULL DEFAULT '',
  file_name TEXT NOT NULL DEFAULT '',
  file_size BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'final' CHECK (status IN ('final', 'draft', 'expired', 'archived')),
  expiry_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13) Lead follow-up notes
CREATE TABLE lead_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  next_followup_date DATE,
  created_by TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
ALTER TABLE content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_followups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_comments_admin_all" ON content_comments FOR ALL USING (public.is_admin());
CREATE POLICY "content_comments_select_own" ON content_comments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM content_calendars c WHERE c.id = content_comments.content_id AND c.client_id = auth.uid()
  ));

CREATE POLICY "package_usage_select_own" ON package_usage FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "package_usage_admin_all" ON package_usage FOR ALL USING (public.is_admin());

CREATE POLICY "special_offers_select_own" ON special_offers FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "special_offers_admin_all" ON special_offers FOR ALL USING (public.is_admin());

CREATE POLICY "offer_claims_select_own" ON offer_claims FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "offer_claims_admin_all" ON offer_claims FOR ALL USING (public.is_admin());

CREATE POLICY "reviews_feedback_select_own" ON reviews_feedback FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "reviews_feedback_admin_all" ON reviews_feedback FOR ALL USING (public.is_admin());

CREATE POLICY "meetings_select_own" ON meetings FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "meetings_admin_all" ON meetings FOR ALL USING (public.is_admin());

CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "notifications_admin_all" ON notifications FOR ALL USING (public.is_admin());

CREATE POLICY "campaigns_select_own" ON campaigns FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "campaigns_admin_all" ON campaigns FOR ALL USING (public.is_admin());

CREATE POLICY "social_snapshots_select_own" ON social_snapshots FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "social_snapshots_admin_all" ON social_snapshots FOR ALL USING (public.is_admin());

CREATE POLICY "documents_select_own" ON documents FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "documents_admin_all" ON documents FOR ALL USING (public.is_admin());

CREATE POLICY "lead_followups_select_own" ON lead_followups
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM leads l WHERE l.id = lead_followups.lead_id AND l.client_id = auth.uid()
  ));
CREATE POLICY "lead_followups_admin_all" ON lead_followups FOR ALL USING (public.is_admin());

-- ---------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------
CREATE INDEX idx_content_comments_content_id ON content_comments(content_id);
CREATE INDEX idx_package_usage_client_id ON package_usage(client_id);
CREATE INDEX idx_special_offers_client_id ON special_offers(client_id);
CREATE INDEX idx_special_offers_status ON special_offers(status);
CREATE INDEX idx_offer_claims_client_id ON offer_claims(client_id);
CREATE INDEX idx_reviews_feedback_client_id ON reviews_feedback(client_id);
CREATE INDEX idx_meetings_client_id ON meetings(client_id);
CREATE INDEX idx_meetings_meeting_date ON meetings(meeting_date);
CREATE INDEX idx_notifications_client_id ON notifications(client_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX idx_social_snapshots_client_id ON social_snapshots(client_id);
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_lead_followups_lead_id ON lead_followups(lead_id);

-- ---------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES
  ('documents',           'documents',           false, now(), now()),
  ('offer-assets',        'offer-assets',        false, now(), now()),
  ('meeting-attachments', 'meeting-attachments', false, now(), now())
ON CONFLICT (id) DO NOTHING;
