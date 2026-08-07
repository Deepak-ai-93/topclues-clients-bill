'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getServerSession,
  getClientDashboardData,
  downloadBillingDocument,
  getClientReports,
  downloadReport,
  getClientContent,
  getClientLeads,
  getClientPackageData
} from '../../lib/actions';
import type { SessionData } from '../../lib/auth';
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  BarChart3,
  UserPlus,
  Lock,
  Package,
  CheckSquare,
  ArrowRight,
  Star,
  HelpCircle,
  Tag,
  Activity,
  Users
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import StatCard from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/ui/empty-state';

interface BillingDocument {
  id: string;
  title: string;
  billing_date: string;
  pdf_name: string;
  created_at: string;
}

interface AnalyticsReport {
  id: string;
  title: string;
  report_type: string;
  report_period: string;
  platform: string;
  pdf_name: string;
  notes: string | null;
  created_at: string;
}

interface ContentEntry {
  id: string;
  title: string;
  description: string;
  platform: string;
  publish_date: string;
  status: string;
  asset_name: string;
  created_at: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  notes: string;
  created_at: string;
}

export default function ClientDashboardPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [clientProfile, setClientProfile] = useState<{ name: string; email: string } | null>(null);
  const [documents, setDocuments] = useState<BillingDocument[]>([]);
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [contentEntries, setContentEntries] = useState<ContentEntry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [packageName, setPackageName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadClientData() {
      try {
        const userSession = await getServerSession();
        setSession(userSession);

        if (!userSession) {
          setLoading(false);
          return;
        }

        const [data, reportsData, contentData, leadsData, pkgData] = await Promise.all([
          getClientDashboardData(),
          getClientReports(),
          getClientContent(),
          getClientLeads(),
          getClientPackageData()
        ]);
        setClientProfile(data.clientProfile);
        setDocuments(data.documents as BillingDocument[]);
        setReports(reportsData.reports as AnalyticsReport[]);
        setContentEntries(contentData.entries as ContentEntry[]);
        setLeads(leadsData.leads as Lead[]);
        const pkg = (pkgData as { package?: { name?: string } | null } | null)?.package;
        setPackageName(pkg?.name || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadClientData();
  }, []);

  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const handleDownloadDoc = async (docId: string) => {
    try {
      const res = await downloadBillingDocument(docId);
      if (res.success && res.url) {
        window.open(res.url, '_blank');
      } else {
        triggerToast(res.error || 'Failed to prepare download link.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const res = await downloadReport(reportId);
      if (res.success && res.url) {
        window.open(res.url, '_blank');
      } else {
        triggerToast(res.error || 'Failed to download report.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  // Real 6-month lead trend from live lead data
  const leadChartData = useMemo(() => {
    const months: { key: string; label: string; leads: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        leads: 0,
      });
    }
    leads.forEach((l) => {
      if (!l.created_at) return;
      const d = new Date(l.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (bucket) bucket.leads += 1;
    });
    return months;
  }, [leads]);

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase">Loading Doctor Hub Portal...</p>
        </div>
      </div>
    );
  }

  if (!clientProfile || !session) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-3">
        <Lock className="w-8 h-8 text-rose-600 mx-auto" />
        <p className="text-sm text-neutral-900 font-semibold">Failed to load client profile.</p>
        <p className="text-xs text-neutral-400">Please make sure you are logged in to an authorized client account.</p>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedDoctorName = clientProfile.name.toLowerCase().startsWith('dr.')
    ? clientProfile.name
    : `Dr. ${clientProfile.name}`;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const leadsThisMonthCount = leads.filter((l) => {
    if (!l.created_at) return false;
    const d = new Date(l.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length || leads.length;

  const pendingApprovalsCount = contentEntries.filter((c) => c.status === 'draft' || c.status === 'pending_approval').length;

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;
  const contactedLeadsCount = leads.filter((l) => l.status === 'contacted').length;
  const convertedLeadsCount = leads.filter((l) => l.status === 'converted' || l.status === 'qualified').length;

  const quickActions = [
    { label: 'View Report', href: '/client/reports', icon: BarChart3 },
    { label: 'Download Invoice', href: '/client/invoices', icon: FileText },
    { label: 'Approve Content', href: '/client/content', icon: CheckSquare },
    { label: 'Update Lead', href: '/client/leads', icon: UserPlus },
    { label: 'Submit Review', href: '/client/reviews', icon: Star },
    { label: 'Contact Manager', href: '/client/support', icon: HelpCircle },
    { label: 'View Offers', href: '/client/offers', icon: Tag },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-primary text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border border-primary-800">
          <CheckCircle className="w-4 h-4 text-accent-300" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-rose-950 text-white border border-rose-900 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Welcome Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-primary text-white border border-primary shadow-primary p-6 sm:p-7">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/40 via-transparent to-accent-500/25 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-primary-200 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-blink" aria-hidden="true" />
              Topclues Doctor Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2">
              Welcome back, {formattedDoctorName}
            </h1>
            <p className="text-xs sm:text-sm text-primary-100 mt-1 font-mono">
              {clientProfile.name} Clinic &bull; {currentDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-primary-50 border border-white/20">
              Account Status: Active
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Package"
          value={packageName || 'Active Package'}
          hint={packageName ? 'Current plan' : undefined}
          icon={Package}
          href="/client/package"
        />
        <StatCard
          label="Leads This Month"
          value={leadsThisMonthCount}
          hint="Patient inquiries"
          icon={Users}
          href="/client/leads"
          trend={leadsThisMonthCount > 0 ? `+${leadsThisMonthCount}` : undefined}
        />
        <StatCard
          label="Pending Approvals"
          value={pendingApprovalsCount}
          hint="Content items"
          icon={CheckSquare}
          href="/client/content"
          trendPositive={pendingApprovalsCount === 0}
          trend={pendingApprovalsCount === 0 ? 'All clear' : `${pendingApprovalsCount} to review`}
        />
        <StatCard
          label="Conversion Rate"
          value={leads.length ? `${Math.round((convertedLeadsCount / leads.length) * 100)}%` : '0%'}
          hint="Leads → appointments"
          icon={Activity}
          href="/client/leads"
        />
      </div>

      {/* Section 3: Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">Quick Actions</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-4 lg:grid-cols-7">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="border border-neutral-200 px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all shrink-0 bg-white shadow-card"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section 4: Two Column (Real BarChart & Lead Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live lead chart */}
        <div className="border border-neutral-200 p-5 rounded-2xl bg-white shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Lead Generation Trend</h3>
              <p className="text-xs font-mono text-neutral-500">Patient leads — last 6 months</p>
            </div>
            <Badge variant="primary" dot>Live data</Badge>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef3fa" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 12, fontFamily: 'monospace' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#356cb0', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: '#eef3fa', opacity: 0.5 }}
                />
                <Bar dataKey="leads" name="Leads" fill="#356cb0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Status Breakdown */}
        <div className="border border-neutral-200 p-5 rounded-2xl bg-white shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Lead Pipeline Summary</h3>
                <p className="text-xs font-mono text-neutral-500">Status of incoming patient inquiries</p>
              </div>
              <Link href="/client/leads" className="text-xs font-mono font-semibold underline text-neutral-800 hover:text-primary">
                Manage Leads &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 border border-neutral-200 rounded-xl flex items-center justify-between bg-neutral-50/60 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <div>
                    <div className="text-sm font-bold text-neutral-900">New Leads</div>
                    <div className="text-xs text-neutral-500">Requires initial contact</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-neutral-900 font-mono tabular-nums">{newLeadsCount}</div>
              </div>

              <div className="p-4 border border-neutral-200 rounded-xl flex items-center justify-between bg-neutral-50/60 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Contacted</div>
                    <div className="text-xs text-neutral-500">In consultation process</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-neutral-900 font-mono tabular-nums">{contactedLeadsCount}</div>
              </div>

              <div className="p-4 border border-neutral-200 rounded-xl flex items-center justify-between bg-neutral-50/60 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-600" />
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Converted / Qualified</div>
                    <div className="text-xs text-neutral-500">Appointments booked</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-neutral-900 font-mono tabular-nums">{convertedLeadsCount}</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600 font-mono">
            <span>Total Leads: {leads.length}</span>
            <span className="font-semibold text-neutral-900">
              Conversion Rate: {leads.length ? Math.round((convertedLeadsCount / leads.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Section 5: Pending Content */}
      <div className="border border-neutral-200 p-5 rounded-2xl bg-white shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Content Pending Review & Recent Posts</h3>
            <p className="text-xs font-mono text-neutral-500">Review creative material before publishing</p>
          </div>
          <Link href="/client/content" className="text-xs font-mono font-bold text-neutral-800 hover:text-primary flex items-center gap-1">
            View All &rarr;
          </Link>
        </div>

        {contentEntries.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No content queued right now"
            description="When the Topclues team schedules posts, they'll appear here for your review."
            action={
              <Link href="/client/content" className="text-xs font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900">
                Go to Content Approval
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentEntries.slice(0, 3).map((item) => (
              <div key={item.id} className="border border-neutral-200 p-4 rounded-xl flex flex-col justify-between space-y-3 bg-white hover:shadow-raised hover:-translate-y-0.5 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="primary">{item.platform}</Badge>
                    <Badge variant={item.status === 'published' ? 'accent' : 'amber'}>
                      {item.status}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-neutral-600 line-clamp-2">{item.description}</p>
                </div>
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Publish: {item.publish_date}</span>
                  <Link href="/client/content" className="font-bold text-neutral-800 hover:text-primary">
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 6: Two Column (Reports & Invoices) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports */}
        <div className="border border-neutral-200 p-5 rounded-2xl bg-white shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900">Recent Reports</h3>
            <Link href="/client/reports" className="text-xs font-mono font-bold text-neutral-800 hover:text-primary">
              View All &rarr;
            </Link>
          </div>
          {reports.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No reports uploaded yet"
              description="Monthly performance summaries will appear here."
            />
          ) : (
            <div className="divide-y divide-neutral-100">
              {reports.slice(0, 3).map((rep) => (
                <div key={rep.id} className="py-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{rep.title}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{rep.report_period} &bull; {rep.platform}</div>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(rep.id)}
                    className="px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-md hover:bg-primary-700 flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="border border-neutral-200 p-5 rounded-2xl bg-white shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900">Recent Invoices</h3>
            <Link href="/client/invoices" className="text-xs font-mono font-bold text-neutral-800 hover:text-primary">
              View All &rarr;
            </Link>
          </div>
          {documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No invoices yet"
              description="Tax invoices and receipts will be available here."
            />
          ) : (
            <div className="divide-y divide-neutral-100">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{doc.title}</div>
                    <div className="text-[10px] font-mono text-neutral-500">Date: {doc.billing_date}</div>
                  </div>
                  <button
                    onClick={() => handleDownloadDoc(doc.id)}
                    className="px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-md hover:bg-primary-700 flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
