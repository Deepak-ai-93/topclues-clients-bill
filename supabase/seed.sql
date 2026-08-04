-- Seed data for local development (runs after migrations on `supabase db reset`).
-- Credentials:
--   Admin : admin@topclues.in  / Admin@123
--   Doctor: dr.jay@topclues.in / Doctor@123

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------
-- Auth users
-- ---------------------------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-00000000a001',
    'authenticated', 'authenticated',
    'admin@topclues.in',
    crypt('Admin@123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin","name":"System Admin"}',
    now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-00000000c101',
    'authenticated', 'authenticated',
    'dr.jay@topclues.in',
    crypt('Doctor@123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"client","name":"Dr. Jay Makadia"}',
    now(), now()
  )
ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------
INSERT INTO public.profiles (id, email, name, role, status, phone, package_id, clinic_name, specialization, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-00000000a001', 'admin@topclues.in', 'System Admin', 'admin', 'active', '+91 98765 43210', NULL, '', '', now(), now()),
  ('00000000-0000-0000-0000-00000000c101', 'dr.jay@topclues.in', 'Dr. Jay Makadia', 'client', 'active', '+91 98250 11223', '00000000-0000-0000-0000-00000000b001', 'Makadia Ortho & Spine Clinic', 'Orthopedic Surgeon, Spine Specialist', now(), now())
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Packages
-- ---------------------------------------------------------------
INSERT INTO public.packages (id, name, pricing, billing_cycle, included_services, feature_list, optional_add_ons, support_level, description)
VALUES (
  '00000000-0000-0000-0000-00000000b001',
  'Specialist Growth',
  15000.00,
  'monthly',
  '["Static social posts","Carousels","Reels","Blog posts","Meta Ads management","Google Business Profile management","Social scheduling and publishing","Monthly performance reporting"]',
  '["Dedicated account manager","Monthly performance report","Content calendar","Messenger support"]',
  '["Video shoot","Google Ads setup","Website development"]',
  'Priority',
  'Complete digital growth dashboard for specialist clinics.'
) ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Clients (legacy table, informational only)
-- ---------------------------------------------------------------
INSERT INTO public.clients (
  id, company_name, client_name, email, phone_number, business_address,
  gst_number, notes, package_id, package_validity, account_status, created_at
) VALUES (
  '00000000-0000-0000-0000-00000000d001',
  'Makadia Ortho & Spine Clinic',
  'Dr. Jay Makadia',
  'dr.jay@topclues.in',
  '+91 98250 11223',
  '2nd Floor, Sobo Complex, University Road, Ahmedabad, Gujarat 380009',
  '24AABCD1234E1Z5',
  'Orthopedic surgeon, spine specialist.',
  '00000000-0000-0000-0000-00000000b001',
  CURRENT_DATE + INTERVAL '9 months',
  'active',
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.client_package_history (id, client_id, package_id, assigned_at, valid_until, status)
VALUES (
  '00000000-0000-0000-0000-00000000e001',
  '00000000-0000-0000-0000-00000000d001',
  '00000000-0000-0000-0000-00000000b001',
  now(),
  CURRENT_DATE + INTERVAL '9 months',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES
  ('billing-documents',  'billing-documents',  false, now(), now()),
  ('analytics-reports',  'analytics-reports',  false, now(), now()),
  ('content-assets',     'content-assets',     false, now(), now()),
  ('lead-documents',     'lead-documents',     false, now(), now()),
  ('documents',          'documents',          false, now(), now()),
  ('offer-assets',       'offer-assets',       false, now(), now()),
  ('meeting-attachments','meeting-attachments', false, now(), now())
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Billing documents (invoices)
-- ---------------------------------------------------------------
INSERT INTO public.billing_documents (id, client_id, title, billing_date, amount, payment_status, pdf_name, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f101', '00000000-0000-0000-0000-00000000c101', 'Invoice - July 2026 - Specialist Growth', '2026-07-01', 15000.00, 'paid',   'invoice-july-2026.pdf', now() - INTERVAL '30 days'),
  ('00000000-0000-0000-0000-00000000f102', '00000000-0000-0000-0000-00000000c101', 'Invoice - June 2026 - Specialist Growth', '2026-06-01', 15000.00, 'paid',   'invoice-june-2026.pdf', now() - INTERVAL '60 days'),
  ('00000000-0000-0000-0000-00000000f103', '00000000-0000-0000-0000-00000000c101', 'Invoice - August 2026 - Specialist Growth', '2026-08-01', 15000.00, 'pending', 'invoice-aug-2026.pdf', now() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Analytics reports
-- ---------------------------------------------------------------
INSERT INTO public.analytics_reports (id, client_id, title, report_type, report_period, platform, pdf_name, notes, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f201', '00000000-0000-0000-0000-00000000c101', 'July 2026 Performance Report', 'monthly', 'July 2026', 'both', 'report-july-2026.pdf', 'Reach +32% vs June. Best reel: Knee Pain Myths.', now() - INTERVAL '10 days'),
  ('00000000-0000-0000-0000-00000000f202', '00000000-0000-0000-0000-00000000c101', 'June 2026 Performance Report', 'monthly', 'June 2026', 'meta', 'report-june-2026.pdf', NULL, now() - INTERVAL '40 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Content calendar
-- ---------------------------------------------------------------
INSERT INTO public.content_calendars (id, client_id, title, description, platform, publish_date, status, content_type, language, approval_deadline, version, published_url, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f301', '00000000-0000-0000-0000-00000000c101', 'Posture Check Reel', '5 tips for desk-worker posture. Watch till the end.', 'instagram', CURRENT_DATE + INTERVAL '3 days', 'pending_approval', 'reel', 'English', CURRENT_DATE, 1, '', now() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-00000000f302', '00000000-0000-0000-0000-00000000c101', 'Spine Health Carousel', 'Myths and facts about back pain.', 'facebook', CURRENT_DATE + INTERVAL '5 days', 'approved', 'carousel', 'English', CURRENT_DATE - INTERVAL '2 days', 2, '', now() - INTERVAL '4 days'),
  ('00000000-0000-0000-0000-00000000f303', '00000000-0000-0000-0000-00000000c101', 'Knee Pain Blog - Part 2', 'Deep-dive on non-surgical knee options.', 'blog', CURRENT_DATE - INTERVAL '2 days', 'published', 'blog', 'English', CURRENT_DATE - INTERVAL '10 days', 3, 'https://topclues.in/blog/knee-pain-2', now() - INTERVAL '12 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Content comments
-- ---------------------------------------------------------------
INSERT INTO public.content_comments (id, content_id, author_name, author_role, message, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f311', '00000000-0000-0000-0000-00000000f301', 'Dr. Jay Makadia', 'client', 'Great reel! Please use the clinic logo on the intro slide.', now() - INTERVAL '20 hours'),
  ('00000000-0000-0000-0000-00000000f312', '00000000-0000-0000-0000-00000000f301', 'Rina Topclues', 'admin', 'Thanks doctor, uploading revised version shortly.', now() - INTERVAL '18 hours')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------
INSERT INTO public.leads (id, client_id, name, email, phone, source, status, notes, interested_service, location, campaign_name, assigned_staff, next_followup_date, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f401', '00000000-0000-0000-0000-00000000c101', 'Ankita Patel', 'ankita.p@gmail.com', '+91 98790 00111', 'instagram',  'appointment_booked', 'Lower back pain, 3 weeks.', 'Consultation', 'Ahmedabad', 'Instagram - Followers', 'Clinic Staff', CURRENT_DATE + INTERVAL '1 day', now() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-00000000f402', '00000000-0000-0000-0000-00000000c101', 'Ramesh Shah', 'ramesh.shah@yahoo.com', '+91 98250 22001', 'facebook',   'contacted', 'Looking for knee replacement options.', 'Consultation', 'Maninagar', 'Facebook - Local Ads', '', CURRENT_DATE + INTERVAL '4 days', now() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-00000000f403', '00000000-0000-0000-0000-00000000c101', 'Meera Desai', 'meera.d@gmail.com', '+91 95120 77891', 'google_ads', 'converted', 'Appointment booked - verified.', 'Consultation', 'Bopal', 'Google Ads - Ortho', 'Clinic Staff', NULL, now() - INTERVAL '8 days'),
  ('00000000-0000-0000-0000-00000000f404', '00000000-0000-0000-0000-00000000c101', 'Unknown number', '', '+91 81236 55670', 'call', 'new', 'Missed call while clinic closed.', 'Consultation', '', '', '', CURRENT_DATE + INTERVAL '2 days', now() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Lead follow-ups
-- ---------------------------------------------------------------
INSERT INTO public.lead_followups (id, lead_id, note, next_followup_date, created_by, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f411', '00000000-0000-0000-0000-00000000f401', 'Patient confirmed Thursday 11am slot.', CURRENT_DATE + INTERVAL '1 day', 'Clinic Staff', now() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-00000000f412', '00000000-0000-0000-0000-00000000f403', 'Checked in, consultation done.', NULL, 'Dr. Jay Makadia', now() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Package usage
-- ---------------------------------------------------------------
INSERT INTO public.package_usage (id, client_id, service, included, completed, in_progress, period, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f511', '00000000-0000-0000-0000-00000000c101', 'Static posts', 10, 7, 1, '2026-08', now()),
  ('00000000-0000-0000-0000-00000000f512', '00000000-0000-0000-0000-00000000c101', 'Reels', 2, 1, 1, '2026-08', now()),
  ('00000000-0000-0000-0000-00000000f513', '00000000-0000-0000-0000-00000000c101', 'Blog posts', 4, 2, 1, '2026-08', now()),
  ('00000000-0000-0000-0000-00000000f514', '00000000-0000-0000-0000-00000000c101', 'Video shoots', 1, 1, 0, '2026-08', now())
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Special offers
-- ---------------------------------------------------------------
INSERT INTO public.special_offers (id, client_id, title, description, price, offer_price, discount_pct, valid_until, eligibility, terms, status, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f601', '00000000-0000-0000-0000-00000000c101', 'Extra Reel Pack (3 Reels)', 'Three extra Instagram reels with captions and hashtags.', 6000.00, 4500.00, 25, CURRENT_DATE + INTERVAL '30 days', 'All active clients', 'Publishable in current month.', 'active', now()),
  ('00000000-0000-0000-0000-00000000f602', '00000000-0000-0000-0000-00000000c101', 'Website Development Discount', 'Landing page build with lead form integration.', 25000.00, 20000.00, 20, CURRENT_DATE + INTERVAL '45 days', 'Annual contract clients', 'Includes 3 revision rounds.', 'active', now()),
  ('00000000-0000-0000-0000-00000000f603', '00000000-0000-0000-0000-00000000c101', 'Google Ads Setup', 'One-time Google Ads account setup and first campaign.', 12000.00, 10000.00, 17, CURRENT_DATE + INTERVAL '20 days', 'All active clients', 'Excludes monthly ad spend.', 'active', now())
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Reviews & feedback
-- ---------------------------------------------------------------
INSERT INTO public.reviews_feedback (id, client_id, rating, title, message, service, publish_consent, status, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f701', '00000000-0000-0000-0000-00000000c101', 5, 'Consistent content quality', 'Our reels are performing really well and the team replies fast.', 'Content quality', true, 'published', now() - INTERVAL '15 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Meetings
-- ---------------------------------------------------------------
INSERT INTO public.meetings (id, client_id, title, meeting_date, meeting_type, link, agenda, notes, status, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f801', '00000000-0000-0000-0000-00000000c101', 'Monthly Performance Review', now() + INTERVAL '5 days', 'Review', 'https://meet.google.com/topclues-demo', 'July metrics, August content plan, lead follow-up.', '', 'upcoming', now()),
  ('00000000-0000-0000-0000-00000000f802', '00000000-0000-0000-0000-00000000c101', 'Content Planning for Festival Season', now() - INTERVAL '12 days', 'Planning', '', 'Festival campaign calendar.', 'Approved 12 posts for the season.', 'completed', now() - INTERVAL '12 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------
INSERT INTO public.notifications (id, client_id, title, message, type, link, read, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000f901', '00000000-0000-0000-0000-00000000c101', 'Content ready for approval', 'Your reel "Posture Check" is waiting for your approval.', 'content', '/client/content', false, now() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-00000000f902', '00000000-0000-0000-0000-00000000c101', 'Invoice generated', 'August invoice is available to view and download.', 'invoice', '/client/invoices', false, now() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-00000000f903', '00000000-0000-0000-0000-00000000c101', 'New lead received', 'A new patient inquiry arrived from Google Ads.', 'lead', '/client/leads', true, now() - INTERVAL '8 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Campaigns
-- ---------------------------------------------------------------
INSERT INTO public.campaigns (id, client_id, name, platform, objective, budget, spend, leads, cpl, status, start_date, end_date, created_at)
VALUES
  ('00000000-0000-0000-0000-000000010001', '00000000-0000-0000-0000-00000000c101', 'Ortho - Local Reach', 'facebook', 'awareness', 12000.00, 9400.00, 14, 671.00, 'active', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '10 days', now() - INTERVAL '20 days'),
  ('00000000-0000-0000-0000-000000010002', '00000000-0000-0000-0000-00000000c101', 'Knee Pain - Search Ads', 'google', 'conversion', 10000.00, 10000.00, 11, 909.00, 'completed', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '20 days', now() - INTERVAL '45 days'),
  ('00000000-0000-0000-0000-000000010003', '00000000-0000-0000-0000-00000000c101', 'WhatsApp - New Patient Inquiry', 'whatsapp', 'lead_generation', 8000.00, 3100.00, 6, 517.00, 'active', CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE + INTERVAL '18 days', now() - INTERVAL '12 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Social snapshots
-- ---------------------------------------------------------------
INSERT INTO public.social_snapshots (id, client_id, platform, followers, reach, impressions, engagement, profile_visits, posts_published, best_post, last_synced, created_at)
VALUES
  ('00000000-0000-0000-0000-000000011001', '00000000-0000-0000-0000-00000000c101', 'instagram', 12480, 84500, 152000, 4.60, 1920, 12, 'Knee Pain Myths reel', now(), now() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000011002', '00000000-0000-0000-0000-00000000c101', 'facebook', 8930, 61200, 108000, 3.80, 1105, 10, 'Spine Health Carousel', now(), now() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000011003', '00000000-0000-0000-0000-00000000c101', 'youtube', 4210, 28900, 46000, 5.10, 540, 4, '5 Desk Posture Tips', now(), now() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000011004', '00000000-0000-0000-0000-00000000c101', 'google_business', 1760, 24300, 38600, 3.20, 2080, 8, 'Clinic photos updated', now(), now() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Documents
-- ---------------------------------------------------------------
INSERT INTO public.documents (id, client_id, name, category, file_name, file_size, status, expiry_date, created_at)
VALUES
  ('00000000-0000-0000-0000-000000012001', '00000000-0000-0000-0000-00000000c101', 'Digital Marketing Agreement 2026', 'agreements', 'agreement-2026.pdf', 482000, 'final', NULL, now() - INTERVAL '90 days'),
  ('00000000-0000-0000-0000-000000012002', '00000000-0000-0000-0000-00000000c101', 'Medical Registration Certificate', 'certificates', 'registration-cert.pdf', 185000, 'final', '2027-03-31', now() - INTERVAL '200 days'),
  ('00000000-0000-0000-0000-000000012003', '00000000-0000-0000-0000-00000000c101', 'Clinic Brand Guidelines v2', 'brand', 'brand-guidelines-v2.pdf', 1240000, 'final', NULL, now() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Support ticket + replies
-- ---------------------------------------------------------------
INSERT INTO public.support_tickets (id, client_id, company_name, subject, message, category, priority, status, assigned_to, created_at)
VALUES (
  '00000000-0000-0000-0000-000000013001',
  '00000000-0000-0000-0000-00000000c101',
  'Makadia Ortho & Spine Clinic',
  'Poster file for clinic reception',
  'Please share the high-resolution poster file for the upcoming awareness month.',
  'Content change',
  'normal',
  'open',
  'Rina Topclues',
  now() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ticket_replies (id, ticket_id, sender, sender_name, message, created_at)
VALUES
  ('00000000-0000-0000-0000-000000013011', '00000000-0000-0000-0000-000000013001', 'admin', 'Rina Topclues', 'Sure doctor, posting it by end of today.', now() - INTERVAL '20 hours')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Admin settings
-- ---------------------------------------------------------------
INSERT INTO public.admin_settings (id, company_name, email_notifications_enabled, billing_cycle_defaults, announcement)
VALUES (
  '00000000-0000-0000-0000-000000014001',
  'Topclues Solutions',
  true,
  'monthly',
  'Seasonal campaign packages now available.'
) ON CONFLICT (id) DO NOTHING;