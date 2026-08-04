'use client';

import React, { useState, useEffect } from 'react';
import { Download, FolderOpen, FileText, Search, AlertCircle, CheckCircle, FileWarning } from 'lucide-react';
import { getClientDocuments, downloadDocument } from '../../../lib/actions';

interface Document {
  id: string;
  name: string;
  category: string;
  file_name: string;
  file_size: number;
  status: string;
  expiry_date: string | null;
  created_at: string;
}

const categoryMeta: Record<string, { label: string; color: string }> = {
  agreements: { label: 'Agreements', color: '#356CB0' },
  certificates: { label: 'Certificates', color: '#3A9B47' },
  brand: { label: 'Brand', color: '#7C3AED' },
  reports: { label: 'Reports', color: '#D97706' },
  billing: { label: 'Billing', color: '#DC2626' },
  meetings: { label: 'Meetings', color: '#0891B2' },
  general: { label: 'General', color: '#6B7280' },
};

function formatSize(bytes: number) {
  if (!bytes) return '—';
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(0)} KB`;
  return `${bytes} B`;
}

export default function ClientDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientDocuments();
        setDocuments(data.documents as Document[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
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

  const handleDownload = async (docId: string) => {
    const res = await downloadDocument(docId);
    if (res.success && res.url) {
      window.open(res.url, '_blank');
      triggerToast('Download started.');
    } else {
      triggerToast(res.error || 'Failed to prepare download.', true);
    }
  };

  const categories = Array.from(new Set(documents.map(d => d.category)));
  const filtered = documents.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.file_name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || d.category === categoryFilter;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Documents</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">Agreements, certificates, brand files and more — in one place.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 p-2.5 border border-primary rounded-lg bg-white flex-1">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full text-xs font-semibold outline-none"
          />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{categoryMeta[c]?.label || c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 rounded-xl">
          <FolderOpen className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-semibold">No documents found.</p>
          <p className="text-xs text-neutral-400 font-mono mt-1">Documents shared by Topclues will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const meta = categoryMeta[doc.category] || categoryMeta.general;
            const isExpired = doc.expiry_date && new Date(doc.expiry_date) < new Date();
            return (
              <div key={doc.id} className="border border-primary rounded-xl bg-white p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: meta.color }}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2">{doc.name}</h3>
                    <div className="text-[10px] font-mono text-neutral-400 mt-0.5">{doc.file_name || '—'} • {formatSize(doc.file_size)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded text-white" style={{ backgroundColor: meta.color }}>
                    {meta.label}
                  </span>
                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    isExpired ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-accent-100 text-accent-800 border-accent-300'
                  }`}>
                    {isExpired ? 'Expired' : doc.status}
                  </span>
                  {doc.expiry_date && (
                    <span className="text-[9px] font-mono text-neutral-400 flex items-center gap-1">
                      <FileWarning className="w-3 h-3" /> Valid till {doc.expiry_date}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400">
                    {new Date(doc.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => handleDownload(doc.id)}
                    className="px-3 py-2 bg-primary text-white text-[11px] font-semibold rounded-lg hover:bg-primary-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}