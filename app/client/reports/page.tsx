'use client';

import React, { useState, useEffect } from 'react';
import { Download, FileText, BarChart3, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { getClientReports, downloadReport } from '../../../lib/actions';

interface Report {
  id: string;
  title: string;
  report_type: string;
  report_period: string;
  platform: string;
  pdf_name: string;
  notes: string | null;
  created_at: string;
}

const typeColors: Record<string, string> = {
  monthly: 'bg-primary-100 text-primary-800 border-primary-300',
  quarterly: 'bg-amber-100 text-amber-800 border-amber-300',
  custom: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

export default function ClientReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientReports();
        setReports(data.reports as Report[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  const handleDownload = async (reportId: string) => {
    const res = await downloadReport(reportId);
    if (res.success && res.url) window.open(res.url, '_blank');
    else triggerError(res.error || 'Failed to prepare download.');
  };

  const filtered = reports.filter(r => {
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.report_period || '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || r.report_type === typeFilter;
    return matchSearch && matchType;
  });

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-primary text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border border-primary-800">
          <CheckCircle className="w-4 h-4 text-accent-400" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-rose-950 text-white border border-rose-900 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Monthly Reports</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">Performance reports for your marketing campaigns, archived and ready to download.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 p-2.5 border border-primary rounded-lg bg-white flex-1">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full text-xs font-semibold outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white"
        >
          <option value="all">All Types</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 rounded-xl">
          <BarChart3 className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-semibold">No reports found.</p>
          <p className="text-xs text-neutral-400 font-mono mt-1">Reports uploaded by your Topclues team will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(report => (
            <div key={report.id} className="border border-primary p-5 rounded-xl bg-white space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">{report.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${typeColors[report.report_type] || typeColors.custom}`}>
                        {report.report_type}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">{report.report_period}</span>
                      <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded uppercase">{report.platform}</span>
                    </div>
                  </div>
                </div>
              </div>
              {report.notes && <p className="text-xs text-neutral-600 font-mono bg-neutral-50 border border-neutral-200 rounded-lg p-2.5">{report.notes}</p>}
              {report.notes !== null && report.notes === '' && null}
              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400">
                  {new Date(report.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <button
                  onClick={() => handleDownload(report.id)}
                  className="px-3 py-2 bg-primary text-white text-[11px] font-semibold rounded-lg hover:bg-primary-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}