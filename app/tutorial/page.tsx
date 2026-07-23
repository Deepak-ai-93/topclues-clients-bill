'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  UserPlus,
  LogIn,
  LayoutDashboard,
  Users,
  CreditCard,
  UploadCloud,
  Download,
  FileText,
  Key,
  CheckCircle,
  ShieldCheck,
  BookOpen,
  BarChart3
} from 'lucide-react';

const steps = [
  {
    id: 'admin-setup',
    role: 'admin',
    title: 'Initial Admin Setup',
    subtitle: 'First-time system initialization',
    steps: [
      { label: 'Open the app URL in your browser', detail: 'You\'ll see the login screen with a dark-themed left panel and a login form on the right.' },
      { label: 'If no admin exists, the "Initialize System" form appears automatically', detail: 'Enter your admin email (e.g., admin@company.com) and choose a strong password.' },
      { label: 'Click "Initialize Portal"', detail: 'The system creates your admin account and automatically redirects you to the Admin Dashboard.' },
    ]
  },
  {
    id: 'admin-login',
    role: 'admin',
    title: 'Admin Login',
    subtitle: 'Signing in as an administrator',
    steps: [
      { label: 'Navigate to the login page', detail: 'Visit the app URL. If already logged in, click "Logout Admin" from the sidebar first.' },
      { label: 'Enter your admin email and password', detail: 'Use the credentials created during initial setup.' },
      { label: 'Click "Verify and Authenticate"', detail: 'You\'ll be redirected to the Admin Dashboard.' },
    ]
  },
  {
    id: 'admin-dashboard',
    role: 'admin',
    title: 'Admin Dashboard Overview',
    subtitle: 'Monitoring clients and documents',
    steps: [
      { label: 'View key metrics', detail: 'The dashboard shows "Registered Clients" count and "Billing Vault" total document count at a glance.' },
      { label: 'Check recent uploads', detail: 'The "Recent Billing Uploads" table shows the latest PDFs uploaded, including billing title, client name, and date.' },
      { label: 'Quick action buttons', detail: 'Use "Add Client" to register new clients or "Upload PDF" to add a billing document directly.' },
    ]
  },
  {
    id: 'admin-clients',
    role: 'admin',
    title: 'Managing Clients',
    subtitle: 'Provision, edit, and manage client accounts',
    steps: [
      { label: 'Navigate to Clients', detail: 'Click "Clients" in the left sidebar to open the Clients Console.' },
      { label: 'Add a new client', detail: 'Click the "Add Client" button. Fill in the client name and email. An optional password can be set; otherwise one is auto-generated. Click "Add Client" to create the account.' },
      { label: 'Copy temporary credentials', detail: 'After creation, a success panel shows the client\'s email and auto-generated password. Share these securely with the client.' },
      { label: 'Edit a client profile', detail: 'Click the pencil icon next to any client to update their display name.' },
      { label: 'Reset a client password', detail: 'Click the key icon to regenerate a password. A new temporary password is shown in an alert.' },
      { label: 'Delete a client', detail: 'Click the trash icon and confirm. This permanently removes the client, their profile, and all associated billing documents.' },
      { label: 'Search clients', detail: 'Use the search bar to filter clients by name or email.' },
    ]
  },
  {
    id: 'admin-billing',
    role: 'admin',
    title: 'Uploading Billing PDFs',
    subtitle: 'Publishing invoices for clients',
    steps: [
      { label: 'Navigate to Billing', detail: 'Click "Billing" in the left sidebar to open the Billing Console.' },
      { label: 'Click "Upload Billing PDF"', detail: 'A modal form opens.' },
      { label: 'Select a client', detail: 'Choose the partner client from the dropdown list.' },
      { label: 'Enter billing details', detail: 'Fill in the document title (e.g., "July 2026 Invoice") and select the billing date.' },
      { label: 'Select the PDF file', detail: 'Click the upload area and choose the PDF file from your computer.' },
      { label: 'Click "Upload Document"', detail: 'The PDF is uploaded to secure storage and linked to the client\'s account.' },
      { label: 'View all documents', detail: 'The billing table shows every document with client name, title, date, and download/delete actions.' },
      { label: 'Download or delete', detail: 'Use the download icon to preview a PDF or the trash icon to remove it permanently.' },
    ]
  },
  {
    id: 'admin-reports',
    role: 'admin',
    title: 'Sharing Analytics Reports',
    subtitle: 'Uploading Meta & Google Ads performance reports',
    steps: [
      { label: 'Navigate to Reports', detail: 'Click "Reports" in the left sidebar to open the Analytics Reports console.' },
      { label: 'Click "Upload Report"', detail: 'A modal form opens with fields for the report details.' },
      { label: 'Select the client and platform', detail: 'Choose the target client, then select the platform (Meta Ads, Google Ads, or both).' },
      { label: 'Enter report details', detail: 'Fill in the report title, select the report period using the month picker, and optionally add notes with key highlights or KPIs.' },
      { label: 'Select the PDF file', detail: 'Click the upload area and choose the analytics report PDF from your computer.' },
      { label: 'Click "Upload Report"', detail: 'The report is uploaded to secure storage and becomes accessible to the client.' },
      { label: 'Filter by platform', detail: 'Use the platform filter dropdown to view reports from specific ad platforms.' },
      { label: 'Download or delete', detail: 'Use the download icon to preview a report or the trash icon to remove it.' },
    ]
  },
  {
    id: 'admin-logout',
    role: 'admin',
    title: 'Admin Logout',
    subtitle: 'Ending your admin session',
    steps: [
      { label: 'Click "Logout Admin"', detail: 'Located at the bottom of the left sidebar. You\'ll be redirected to the login page.' },
    ]
  },
  {
    id: 'client-login',
    role: 'client',
    title: 'Client Login',
    subtitle: 'Signing in as a client',
    steps: [
      { label: 'Get your credentials from your administrator', detail: 'Your admin will provide your login email and a temporary password.' },
      { label: 'Open the app URL in your browser', detail: 'You\'ll see the main login page.' },
      { label: 'Enter your email and temporary password', detail: 'Use the credentials shared by your administrator.' },
      { label: 'Click "Verify and Authenticate"', detail: 'You\'ll be redirected to your secure Client Dashboard.' },
    ]
  },
  {
    id: 'client-dashboard',
    role: 'client',
    title: 'Client Dashboard Overview',
    subtitle: 'Browsing billing documents and analytics reports',
    steps: [
      { label: 'View your profile', detail: 'The top bar shows your name and email for confirmation.' },
      { label: 'Switch between tabs', detail: 'Use the tab bar to toggle between "Analytics Reports" and "Billing Documents".' },
      { label: 'Browse analytics reports', detail: 'The Analytics Reports tab shows monthly performance reports from Meta Ads, Google Ads, or both, published by your administrator.' },
      { label: 'Check report details', detail: 'Each report entry shows the title, period, platform badge (color-coded), and any summary notes.' },
      { label: 'Browse billing documents', detail: 'The Billing Documents tab lists all invoices your administrator has uploaded for you.' },
    ]
  },
  {
    id: 'client-download-report',
    role: 'client',
    title: 'Downloading Analytics Reports',
    subtitle: 'Accessing your monthly performance PDFs',
    steps: [
      { label: 'Go to the Analytics Reports tab', detail: 'If not already selected, click "Analytics Reports" in the tab bar.' },
      { label: 'Find the report you need', detail: 'Locate it by title, period, or platform badge.' },
      { label: 'Click the "Download" button', detail: 'The report PDF opens in a new browser tab.' },
      { label: 'Save or print', detail: 'Use your browser\'s save or print function to keep a copy.' },
    ]
  },
  {
    id: 'client-download',
    role: 'client',
    title: 'Downloading a Billing PDF',
    subtitle: 'Accessing your invoices',
    steps: [
      { label: 'Find the document you need', detail: 'Locate it in the billing documents table on your dashboard.' },
      { label: 'Click the "Download" button', detail: 'The PDF opens in a new browser tab for viewing or printing.' },
      { label: 'Save or print', detail: 'Use your browser\'s save or print function to keep a copy for your records.' },
    ]
  },
  {
    id: 'client-logout',
    role: 'client',
    title: 'Client Logout',
    subtitle: 'Ending your client session',
    steps: [
      { label: 'Click "Logout Client"', detail: 'Located at the bottom of the left sidebar. You\'ll be redirected to the login page.' },
    ]
  },
];

const roles = [
  { id: 'admin', label: 'Admin Guide', icon: ShieldCheck, color: 'bg-neutral-950 text-white' },
  { id: 'client', label: 'Client Guide', icon: Users, color: 'bg-neutral-800 text-white' },
];

export default function TutorialPage() {
  const [activeRole, setActiveRole] = useState<'admin' | 'client'>('admin');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const filteredSteps = steps.filter(s => s.role === activeRole);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
              T
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-neutral-900">TopClues Tutorial</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
            How to Use the Portal
          </h1>
          <p className="text-sm text-neutral-500 max-w-2xl">
            A step-by-step walkthrough for both administrators and clients. Select your role below to get started.
          </p>
        </div>

        {/* Role selector */}
        <div className="flex gap-3 mb-10">
          {roles.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveRole(id as 'admin' | 'client')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeRole === id
                  ? color + ' shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {filteredSteps.map((section, sectionIdx) => (
            <div key={section.id} className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Section header */}
              <div className="p-5 border-b border-neutral-100">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase font-mono">
                    Step {sectionIdx + 1}
                  </span>
                  {section.role === 'admin' ? (
                    <span className="text-[9px] font-bold bg-neutral-900 text-white px-1.5 py-0.5 rounded font-mono uppercase">Admin</span>
                  ) : (
                    <span className="text-[9px] font-bold bg-neutral-700 text-white px-1.5 py-0.5 rounded font-mono uppercase">Client</span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-neutral-900 mt-1">{section.title}</h2>
                <p className="text-xs text-neutral-500">{section.subtitle}</p>
              </div>

              {/* Steps list */}
              <div className="divide-y divide-neutral-100">
                {section.steps.map((step, stepIdx) => {
                  const stepKey = `${section.id}-${stepIdx}`;
                  const isExpanded = expandedStep === stepKey;

                  return (
                    <div key={stepKey}>
                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : stepKey)}
                        className="w-full flex items-start gap-3 p-4 text-left hover:bg-neutral-50/50 transition-colors cursor-pointer"
                      >
                        <span className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-500 shrink-0 mt-0.5">
                          {stepIdx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-neutral-900">{step.label}</span>
                          {isExpanded && (
                            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{step.detail}</p>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 mt-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-neutral-200 text-center">
          <p className="text-xs text-neutral-400">
            Need help? Contact your system administrator.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors mt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
