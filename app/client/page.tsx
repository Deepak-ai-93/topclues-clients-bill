'use client';

import React, { useState, useEffect } from 'react';
import {
  getServerSession,
  getClientDashboardData,
  downloadBillingDocument,
  getClientReports,
  downloadReport,
  getClientContent,
  getClientLeads,
  updateClientLeadStatus
} from '../../lib/actions';
import type { SessionData } from '../../lib/auth';
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Building,
  Mail,
  Lock,
  BarChart3,
  Calendar,
  UserPlus,
  Edit3
} from 'lucide-react';

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

const platformLabels: Record<string, string> = {
  meta: 'Meta Ads',
  google: 'Google Ads',
  both: 'Meta + Google',
  other: 'Other'
};

const platformColors: Record<string, string> = {
  meta: 'bg-blue-50 text-blue-700 border-blue-200',
  google: 'bg-green-50 text-green-700 border-green-200',
  both: 'bg-purple-50 text-purple-700 border-purple-200',
  other: 'bg-neutral-50 text-neutral-700 border-neutral-200'
};

const contentPlatformLabels: Record<string, string> = {
  social: 'Social Media',
  blog: 'Blog',
  email: 'Email',
  video: 'Video',
  other: 'Other'
};

const contentPlatformColors: Record<string, string> = {
  social: 'bg-sky-50 text-sky-700 border-sky-200',
  blog: 'bg-amber-50 text-amber-700 border-amber-200',
  email: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  video: 'bg-rose-50 text-rose-700 border-rose-200',
  other: 'bg-neutral-50 text-neutral-700 border-neutral-200'
};

const contentStatusLabels: Record<string, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published'
};

const contentStatusColors: Record<string, string> = {
  draft: 'bg-neutral-100 text-neutral-600 border-neutral-300',
  scheduled: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const leadStatusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  lost: 'Lost'
};

const leadStatusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  lost: 'bg-rose-50 text-rose-700 border-rose-200'
};

const leadSourceLabels: Record<string, string> = {
  website: 'Website',
  referral: 'Referral',
  social: 'Social Media',
  email: 'Email',
  call: 'Call',
  other: 'Other'
};

type Tab = 'reports' | 'billing' | 'content' | 'leads';

export default function ClientDashboardPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [clientProfile, setClientProfile] = useState<{ name: string; email: string } | null>(null);
  const [documents, setDocuments] = useState<BillingDocument[]>([]);
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [contentEntries, setContentEntries] = useState<ContentEntry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('reports');
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

  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    try {
      const res = await updateClientLeadStatus(leadId, status);
      if (res.success) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
        triggerToast(`Lead status updated to "${leadStatusLabels[status] || status}".`);
      } else {
        triggerToast(res.error || 'Failed to update status.', true);
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
          <p className="text-xs text-neutral-400 font-mono tracking-widest">LOADING SECURE PORTAL GATEWAY...</p>
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

  const renderReportsTab = () => (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4.5 h-4.5 text-neutral-500" />
          <h2 className="text-sm font-semibold text-neutral-950">Monthly Performance Reports</h2>
        </div>
        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded border border-neutral-200">
          {reports.length > 0 ? `${reports.length} REPORTS` : 'NO DATA'}
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="py-16 text-center">
          <BarChart3 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900">No reports available yet</h3>
          <p className="text-xs text-neutral-400 mt-1">Your monthly analytics reports will appear here once published by your administrator.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Report Title</th>
                <th className="py-3.5 px-6">Period</th>
                <th className="py-3.5 px-6">Platform</th>
                <th className="py-3.5 px-6">Notes</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {reports.map(report => (
                <tr key={report.id} className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-neutral-900">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-neutral-400 shrink-0" />
                      {report.title}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-neutral-600">{report.report_period}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformColors[report.platform] || platformColors.other}`}>
                      {platformLabels[report.platform] || report.platform}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-neutral-500 max-w-[200px] truncate">
                    {report.notes || '-'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDownloadReport(report.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderBillingTab = () => (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4.5 h-4.5 text-neutral-500" />
          <h2 className="text-sm font-semibold text-neutral-950">Your Billing Documents</h2>
        </div>
        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded border border-neutral-200">
          SECURE ACCESS
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="py-16 text-center">
          <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900">No billing documents logged</h3>
          <p className="text-xs text-neutral-400 mt-1">Contact your administrator if you believe this is an error.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Document Title</th>
                <th className="py-3.5 px-6">Billing Date</th>
                <th className="py-3.5 px-6">File Name</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-neutral-900">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                      {doc.title}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-neutral-500 font-mono">{doc.billing_date}</td>
                  <td className="py-4 px-6 text-neutral-500 font-mono truncate max-w-[240px]">{doc.pdf_name}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDownloadDoc(doc.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderContentTab = () => (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-neutral-500" />
          <h2 className="text-sm font-semibold text-neutral-950">Content Calendar & Published Assets</h2>
        </div>
        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded border border-neutral-200">
          {contentEntries.length > 0 ? `${contentEntries.length} ENTRIES` : 'NO DATA'}
        </span>
      </div>

      {contentEntries.length === 0 ? (
        <div className="py-16 text-center">
          <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900">No content scheduled yet</h3>
          <p className="text-xs text-neutral-400 mt-1">Your content calendar and published assets will appear here once assigned by your administrator.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-6">Platform</th>
                <th className="py-3.5 px-6">Publish Date</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {contentEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-neutral-900 max-w-[300px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="truncate">{entry.title}</span>
                      {entry.description && (
                        <span className="text-[10px] text-neutral-400 font-normal truncate">{entry.description}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${contentPlatformColors[entry.platform] || contentPlatformColors.other}`}>
                      {contentPlatformLabels[entry.platform] || entry.platform}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-neutral-600">{entry.publish_date}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${contentStatusColors[entry.status] || contentStatusColors.draft}`}>
                      {contentStatusLabels[entry.status] || entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderLeadsTab = () => (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4.5 h-4.5 text-neutral-500" />
          <h2 className="text-sm font-semibold text-neutral-950">Your Leads</h2>
        </div>
        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded border border-neutral-200">
          {leads.length > 0 ? `${leads.length} LEADS` : 'NO DATA'}
        </span>
      </div>

      {leads.length === 0 ? (
        <div className="py-16 text-center">
          <UserPlus className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900">No leads assigned yet</h3>
          <p className="text-xs text-neutral-400 mt-1">Leads will appear here once your administrator assigns them to your account.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Contact</th>
                <th className="py-3.5 px-6">Source</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-neutral-900">{lead.name}</div>
                    {lead.notes && (
                      <div className="text-[10px] text-neutral-400 truncate max-w-[160px]">{lead.notes}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-0.5 text-neutral-600">
                      {lead.email && <span className="truncate max-w-[180px]">{lead.email}</span>}
                      {lead.phone && <span className="text-[10px]">{lead.phone}</span>}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-600">
                    {leadSourceLabels[lead.source] || lead.source}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border appearance-none cursor-pointer ${leadStatusColors[lead.status] || leadStatusColors.new}`}
                    >
                      {Object.entries(leadStatusLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-neutral-200/50">
        <div>
          <span className="text-[10px] font-bold tracking-wider font-mono text-neutral-400 uppercase">Secure Client Hub</span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            Welcome back, {clientProfile.name || 'Partner'}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Access your reports, billing documents, content calendar, and leads.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200/50 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700">
            <Building className="w-4 h-4 text-neutral-500" />
            <span>{clientProfile.name}</span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200/50 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700">
            <Mail className="w-4 h-4 text-neutral-500" />
            <span className="font-mono">{clientProfile.email}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1 w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics Reports
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'billing'
              ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Billing Documents
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Content Calendar
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'leads'
              ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          Leads
        </button>
      </div>

      {activeTab === 'reports' && renderReportsTab()}
      {activeTab === 'billing' && renderBillingTab()}
      {activeTab === 'content' && renderContentTab()}
      {activeTab === 'leads' && renderLeadsTab()}

    </div>
  );
}
