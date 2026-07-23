'use client';

import React, { useState, useEffect } from 'react';
import {
  getServerSession,
  getClientDashboardData,
  downloadBillingDocument,
  getClientReports,
  downloadReport
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
  BarChart3
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

export default function ClientDashboardPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [clientProfile, setClientProfile] = useState<{ name: string; email: string } | null>(null);
  const [documents, setDocuments] = useState<BillingDocument[]>([]);
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [activeTab, setActiveTab] = useState<'billing' | 'reports'>('reports');
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

        const [data, reportsData] = await Promise.all([
          getClientDashboardData(),
          getClientReports()
        ]);
        setClientProfile(data.clientProfile);
        setDocuments(data.documents as BillingDocument[]);
        setReports(reportsData.reports as AnalyticsReport[]);
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
          <p className="text-sm text-neutral-500 mt-0.5">Access your billing documents and monthly performance reports.</p>
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

      <div className="flex gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1 w-fit">
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
      </div>

      {activeTab === 'reports' ? (
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
      ) : (
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
      )}

    </div>
  );
}
