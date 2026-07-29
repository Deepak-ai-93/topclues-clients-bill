# Topclues Doctor Hub - Technical Documentation & Architecture

## 1. Project Overview & Scope

**Topclues Doctor Hub** is a specialized client portal for doctors, specialists, and clinic teams who partner with **Topclues Solutions** for digital marketing, brand management, patient lead generation, and content creation.

### Key Goals:
- Provide real-time transparency for marketing performance & patient inquiries.
- Centralize content review and 1-click approvals for graphics, reels, and posts.
- Give doctors access to monthly PDF reports, invoices, and service packages.
- Provide a structured ticketing interface with assigned agency account managers.

---

## 2. Information & Role Architecture

The portal serves four user roles:
1. **Doctor (Client Owner)**: Full access to clinic profile, lead tracking, content approvals, billing records, and support.
2. **Clinic Staff**: Delegated access for lead follow-ups and content feedback.
3. **Agency Account Manager**: Responsible for managing client content, uploading reports/invoices, responding to support tickets.
4. **Super Admin**: System-wide configuration, client creation, role management, and global audit logs.

---

## 3. Core Functional Modules

```text
Topclues Doctor Hub
├── Public Landing Page (app/page.tsx)
├── Client Authentication (app/login/page.tsx, app/client/login/page.tsx)
├── Agency Authentication (app/admin/login/page.tsx)
├── Doctor Client Portal (app/client/*)
│   ├── Dashboard Overview
│   ├── Lead Management & Tracking
│   ├── Content Approval & Calendar
│   ├── Monthly Performance Reports
│   ├── Invoices & Service Packages
│   └── Support & Team Contact
└── Agency Admin Portal (app/admin/*)
    ├── Client Accounts Directory
    ├── Lead Master Database
    ├── Content Approval Publisher
    ├── Billing & Invoice Manager
    └── Ticket Support Center
```

---

## 4. Supabase Database Schema Integration

The system uses **Supabase PostgreSQL** for data persistence with Row Level Security (RLS).

### Core Database Tables:

#### 1. `profiles`
- `id` (uuid, primary key, references auth.users)
- `email` (text)
- `name` (text)
- `role` (enum: 'admin', 'client')
- `created_at` (timestamp)

#### 2. `clients`
- `id` (uuid, primary key)
- `doctor_name` (text)
- `clinic_name` (text)
- `specialty` (text)
- `phone` (text)
- `status` (text: 'active', 'inactive')
- `package_name` (text)
- `created_at` (timestamp)

#### 3. `leads`
- `id` (uuid, primary key)
- `client_id` (uuid, references clients.id)
- `patient_name` (text)
- `phone` (text)
- `source` (text: 'Google Ads', 'Meta Ads', 'Organic')
- `status` (text: 'New', 'Contacted', 'Booked', 'Cancelled')
- `created_at` (timestamp)

#### 4. `content_approvals`
- `id` (uuid, primary key)
- `client_id` (uuid, references clients.id)
- `title` (text)
- `media_url` (text)
- `type` (text: 'Graphic', 'Reel', 'Carousel')
- `status` (text: 'Pending', 'Approved', 'Changes Requested')
- `feedback` (text)
- `created_at` (timestamp)

#### 5. `reports`
- `id` (uuid, primary key)
- `client_id` (uuid, references clients.id)
- `month_year` (text)
- `pdf_url` (text)
- `summary` (text)
- `created_at` (timestamp)

#### 6. `invoices`
- `id` (uuid, primary key)
- `client_id` (uuid, references clients.id)
- `invoice_number` (text)
- `amount` (numeric)
- `status` (text: 'Paid', 'Pending', 'Overdue')
- `pdf_url` (text)
- `issued_at` (timestamp)

---

## 5. Offline / Decoupled Fallback Logic

To ensure smooth testing without requiring active API keys or live database credentials upfront:
- All server actions in `lib/actions.ts` include try-catch fallback handling.
- When Supabase credentials are missing or inactive, mock data sets provide seamless fallback UI states for rapid iteration.
