CREATE TABLE analytics_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'monthly' CHECK (report_type IN ('monthly', 'quarterly', 'custom')),
  report_period TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'meta' CHECK (platform IN ('meta', 'google', 'both', 'other')),
  pdf_url TEXT NOT NULL DEFAULT '',
  pdf_name TEXT NOT NULL DEFAULT '',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_analytics_reports_client_id ON analytics_reports(client_id);
CREATE INDEX idx_analytics_reports_platform ON analytics_reports(platform);
CREATE INDEX idx_analytics_reports_report_period ON analytics_reports(report_period);
