'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getServerSession,
  getClientDashboardData,
  downloadBillingDocument,
  getClientReports,
  downloadReport,
  getClientContent,
  getClientLeads,
  updateClientLeadStatus,
  downloadContentAsset,
  downloadLeadDocument
} from '../../lib/actions';
import type { SessionData } from '../../lib/auth';
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  UserPlus,
  Lock,
  Package,
  CheckSquare,
  ArrowRight,
  Star,
  HelpCircle,
  Tag,
  Radio,
  Share2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

const mockChartData = [
  { month: 'Mar', leads: 12 },
  { month: 'Apr', leads: 18 },
  { month: 'May', leads: 14 },
  { month: 'Jun', leads: 22 },
  { month: 'Jul', leads: 19 },
  { month: 'Aug', leads: 25 },
];

export default function ClientDashboardPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [clientProfile, setClientProfile] = useState<{ name: string; email: string } | null>(null);
  const [documents, setDocuments] = useState<BillingDocument[]>([]);
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [contentEntries, setContentEntries] = useState<ContentEntry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
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

        const [data, reportsData, contentData, leadsData] = await Promise.all([
          getClientDashboardData(),
          getClientReports(),
          getClientContent(),
          getClientLeads()
        ]);
        setClientProfile(data.clientProfile);
        setDocuments(data.documents as BillingDocument[]);
        setReports(reportsData.reports as AnalyticsReport[]);
        setContentEntries(contentData.entries as ContentEntry[]);
        setLeads(leadsData.leads as Lead[]);
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

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div>
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
  const leadsThisMonthCount = leads.filter(l => {
    if (!l.created_at) return false;
    const d = new Date(l.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length || leads.length;

  const pendingApprovalsCount = contentEntries.filter(c => c.status === 'draft' || c.status === 'pending_approval').length;

  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const contactedLeadsCount = leads.filter(l => l.status === 'contacted').length;
  const convertedLeadsCount = leads.filter(l => l.status === 'converted' || l.status === 'qualified').length;

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
        <div className="fixed top-6 right-6 z-50 p-4 bg-neutral-900 text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border border-neutral-800">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-black text-white rounded-xl border border-black shadow-sm">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Topclues Doctor Hub</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Welcome back, {formattedDoctorName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 font-mono">
            {clientProfile.name} Clinic &bull; {currentDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-neutral-300 border border-white/20">
            Account Status: Active
          </span>
        </div>
      </div>

      {/* Section 2: Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="border border-black p-5 rounded-lg bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-neutral-500 font-semibold">Active Package</span>
              <Package className="w-5 h-5 text-black" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-black mt-3">Specialist Growth</div>
            <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
              Active
            </span>
          </div>
          <Link href="/client/package" className="text-xs text-neutral-700 hover:text-black font-semibold flex items-center gap-1 mt-4">
            View Package <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2 */}
        <div className="border border-black p-5 rounded-lg bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-neutral-500 font-semibold">Leads This Month</span>
              <UserPlus className="w-5 h-5 text-black" />
            </div>
            <div className="text-3xl font-bold text-black mt-3">{leadsThisMonthCount}</div>
            <span className="text-[10px] font-mono text-neutral-500 mt-1 block">Patient Inquiries</span>
          </div>
          <Link href="/client/leads" className="text-xs text-neutral-700 hover:text-black font-semibold flex items-center gap-1 mt-4">
            View Leads <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3 */}
        <div className="border border-black p-5 rounded-lg bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-neutral-500 font-semibold">Pending Approvals</span>
              <CheckSquare className="w-5 h-5 text-black" />
            </div>
            <div className="text-3xl font-bold text-black mt-3">{pendingApprovalsCount}</div>
            <span className="text-[10px] font-mono text-neutral-500 mt-1 block">Content Items</span>
          </div>
          <Link href="/client/content" className="text-xs text-neutral-700 hover:text-black font-semibold flex items-center gap-1 mt-4">
            Review Content <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 4 */}
        <div className="border border-black p-5 rounded-lg bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-neutral-500 font-semibold">Outstanding Amount</span>
              <FileText className="w-5 h-5 text-black" />
            </div>
            <div className="text-3xl font-bold text-black mt-3">₹0.00</div>
            <span className="text-[10px] font-mono text-neutral-500 mt-1 block">All Paid Up</span>
          </div>
          <Link href="/client/invoices" className="text-xs text-neutral-700 hover:text-black font-semibold flex items-center gap-1 mt-4">
            View Invoices <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Section 3: Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">Quick Actions</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-4 lg:grid-cols-7">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="border border-black px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-colors shrink-0 bg-white"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section 4: Two Column (BarChart & Lead Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recharts BarChart */}
        <div className="border border-black p-5 rounded-xl bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Lead Generation Trend</h3>
              <p className="text-xs font-mono text-neutral-500">Patient leads over the past 6 months</p>
            </div>
            <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2 py-1 rounded border border-neutral-300">
              GROWTH ANALYTICS
            </span>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="leads" fill="#000000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Status Breakdown */}
        <div className="border border-black p-5 rounded-xl bg-white flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Lead Pipeline Summary</h3>
                <p className="text-xs font-mono text-neutral-500">Status of incoming patient inquiries</p>
              </div>
              <Link href="/client/leads" className="text-xs font-mono font-semibold underline text-neutral-800">
                Manage Leads &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded-lg flex items-center justify-between bg-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <div>
                    <div className="text-sm font-bold text-neutral-900">New Leads</div>
                    <div className="text-xs text-neutral-500">Requires initial contact</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-neutral-900 font-mono">{newLeadsCount}</div>
              </div>

              <div className="p-4 border border-neutral-200 rounded-lg flex items-center justify-between bg-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Contacted</div>
                    <div className="text-xs text-neutral-500">In consultation process</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-neutral-900 font-mono">{contactedLeadsCount}</div>
              </div>

              <div className="p-4 border border-neutral-200 rounded-lg flex items-center justify-between bg-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Converted / Qualified</div>
                    <div className="text-xs text-neutral-500">Appointments booked</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-neutral-900 font-mono">{convertedLeadsCount}</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600 font-mono">
            <span>Total Leads: {leads.length}</span>
            <span className="font-semibold text-black">
              Conversion Rate: {leads.length ? Math.round((convertedLeadsCount / leads.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Section 5: Pending Content */}
      <div className="border border-black p-5 rounded-xl bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Content Pending Review & Recent Posts</h3>
            <p className="text-xs font-mono text-neutral-500">Review creative material before publishing</p>
          </div>
          <Link href="/client/content" className="text-xs font-mono font-bold text-black flex items-center gap-1 hover:underline">
            View All &rarr;
          </Link>
        </div>

        {contentEntries.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-neutral-300 rounded-lg">
            <CheckSquare className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-xs text-neutral-500 font-mono">No content items queued at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentEntries.slice(0, 3).map(item => (
              <div key={item.id} className="border border-neutral-300 p-4 rounded-lg flex flex-col justify-between space-y-3 bg-neutral-50/50">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-black text-white rounded font-bold uppercase">
                      {item.platform}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                      item.status === 'published' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-neutral-600 line-clamp-2">{item.description}</p>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Publish: {item.publish_date}</span>
                  <Link href="/client/content" className="font-bold text-black hover:underline">
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
        <div className="border border-black p-5 rounded-xl bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900">Recent Reports</h3>
            <Link href="/client/reports" className="text-xs font-mono font-bold text-black hover:underline">
              View All &rarr;
            </Link>
          </div>
          {reports.length === 0 ? (
            <p className="text-xs text-neutral-400 font-mono py-4 text-center">No reports uploaded yet.</p>
          ) : (
            <div className="divide-y divide-neutral-200">
              {reports.slice(0, 3).map(rep => (
                <div key={rep.id} className="py-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{rep.title}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{rep.report_period} &bull; {rep.platform}</div>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(rep.id)}
                    className="px-2.5 py-1 bg-black text-white text-[11px] font-semibold rounded hover:bg-neutral-800 flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="border border-black p-5 rounded-xl bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900">Recent Invoices</h3>
            <Link href="/client/invoices" className="text-xs font-mono font-bold text-black hover:underline">
              View All &rarr;
            </Link>
          </div>
          {documents.length === 0 ? (
            <p className="text-xs text-neutral-400 font-mono py-4 text-center">No invoices uploaded yet.</p>
          ) : (
            <div className="divide-y divide-neutral-200">
              {documents.slice(0, 3).map(doc => (
                <div key={doc.id} className="py-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{doc.title}</div>
                    <div className="text-[10px] font-mono text-neutral-500">Date: {doc.billing_date}</div>
                  </div>
                  <button
                    onClick={() => handleDownloadDoc(doc.id)}
                    className="px-2.5 py-1 bg-black text-white text-[11px] font-semibold rounded hover:bg-neutral-800 flex items-center gap-1 shrink-0"
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
