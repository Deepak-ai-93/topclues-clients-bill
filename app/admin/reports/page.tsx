'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminReportsData,
  uploadReport,
  deleteReport,
  downloadReport
} from '../../../lib/actions';
import {
  Search,
  UploadCloud,
  Trash2,
  FileText,
  Download,
  Calendar,
  User,
  X,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Filter
} from 'lucide-react';

interface ClientEntry {
  id: string;
  name: string;
  email: string;
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
  client?: {
    name: string;
    email: string;
  };
}

const platformLabels: Record<string, string> = {
  meta: 'Meta Ads',
  google: 'Google Ads',
  both: 'Meta + Google',
  other: 'Other'
};

const platformColors: Record<string, string> = {
  meta: 'bg-primary-50 text-primary-700 border-primary-200',
  google: 'bg-green-50 text-green-700 border-green-200',
  both: 'bg-purple-50 text-purple-700 border-purple-200',
  other: 'bg-neutral-50 text-neutral-700 border-neutral-200'
};

export default function AdminReportsPage() {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportPeriod, setReportPeriod] = useState('');
  const [reportType, setReportType] = useState('monthly');
  const [platform, setPlatform] = useState('meta');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminReportsData();
      setClients(data.clients || []);
      setReports(data.reports as AnalyticsReport[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const handleOpenUploadModal = () => {
    setSelectedClientId(clients[0]?.id || '');
    setReportTitle('');
    setReportPeriod(new Date().toISOString().slice(0, 7));
    setReportType('monthly');
    setPlatform('meta');
    setNotes('');
    setSelectedFile(null);
    setShowUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        triggerToast('Please select a valid PDF file.', true);
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !reportTitle || !reportPeriod || !selectedFile) {
      triggerToast('Please fill in all required fields and select a PDF file.', true);
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        const res = await uploadReport({
          clientId: selectedClientId,
          title: reportTitle,
          reportType: reportType,
          reportPeriod: reportPeriod,
          platform: platform,
          notes: notes,
          pdfName: selectedFile.name,
          pdfBase64: base64String
        });

        if (res.success) {
          loadData();
          setShowUploadModal(false);
          triggerToast('Analytics report successfully uploaded and shared with client.');
        } else {
          triggerToast(res.error || 'Upload failed.', true);
        }
        setUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred during upload.', true);
      setUploading(false);
    }
  };

  const handleDelete = async (reportId: string, title: string) => {
    if (!confirm(`Permanently delete the report "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await deleteReport(reportId);
      if (res.success) {
        loadData();
        triggerToast('Report permanently deleted.');
      } else {
        triggerToast(res.error || 'Failed to delete report.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleDownload = async (reportId: string) => {
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

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.client && r.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.report_period.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || r.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Analytics Reports</h1>
          <p className="text-sm text-neutral-500 mt-1">Upload monthly Meta & Google Ads performance reports and share them with clients.</p>
        </div>

        <button
          onClick={handleOpenUploadModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Report
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, client, or period..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="all">All Platforms</option>
            <option value="meta">Meta Ads</option>
            <option value="google">Google Ads</option>
            <option value="both">Meta + Google</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">LOADING REPORT ARCHIVES...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-16 text-center">
            <BarChart3 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No analytics reports uploaded</h3>
            <p className="text-xs text-neutral-400 mt-1">Upload your first monthly performance report for a client.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Report Title</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Period</th>
                  <th className="py-3.5 px-6">Platform</th>
                  <th className="py-3.5 px-6">File</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-neutral-400 shrink-0" />
                        {report.title}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {report.client ? (
                        <div>
                          <div className="font-semibold text-neutral-800">{report.client.name}</div>
                          <div className="text-[10px] text-neutral-400">{report.client.email}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">Deleted Client</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-neutral-600">{report.report_period}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformColors[report.platform] || platformColors.other}`}>
                        {platformLabels[report.platform] || report.platform}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-500 font-mono truncate max-w-[160px]">
                      {report.pdf_name}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(report.id)}
                          className="p-1.5 text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded-lg transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id, report.title)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-neutral-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">Upload Analytics Report</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-neutral-400 hover:text-primary rounded-lg hover:bg-neutral-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Select Client</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <select
                    required
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    {clients.length === 0 && <option value="">No clients registered</option>}
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Platform</label>
                  <select
                    required
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="meta">Meta Ads</option>
                    <option value="google">Google Ads</option>
                    <option value="both">Meta + Google</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Report Type</label>
                  <select
                    required
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Report Title</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. July 2026 Meta Performance Report"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Report Period</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="month"
                    required
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key highlights, KPIs, or summary notes..."
                  rows={2}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Report PDF File</label>
                <div className="border border-dashed border-neutral-200 bg-neutral-50 rounded-lg p-4 text-center cursor-pointer hover:bg-neutral-100/50 transition-all relative">
                  <input
                    type="file"
                    required
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-neutral-700">
                    {selectedFile ? selectedFile.name : 'Click to select analytics report PDF'}
                  </p>
                  <p className="text-[9px] text-neutral-400 mt-0.5">PDF Documents Only</p>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
