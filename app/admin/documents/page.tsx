'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminDocumentsData,
  uploadDocument,
  deleteDocument,
  downloadDocument
} from '../../../lib/actions';
import {
  Plus,
  Trash2,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  Calendar,
  Download,
  Filter,
  File
} from 'lucide-react';

interface ClientEntry {
  id: string;
  name: string;
  email: string;
}

interface Document {
  id: string;
  client_id: string;
  name: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size: number;
  expiry_date: string | null;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

const categoryColors: Record<string, string> = {
  report: 'bg-primary-50 text-primary-700 border-primary-200',
  invoice: 'bg-violet-50 text-violet-700 border-violet-200',
  contract: 'bg-amber-50 text-amber-700 border-amber-200',
  certificate: 'bg-accent-50 text-accent-700 border-accent-200',
  other: 'bg-neutral-100 text-neutral-600 border-neutral-200'
};

const formatBytes = (n: number) => {
  if (!n) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminDocumentsPage() {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState('report');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminDocumentsData();
      setClients(data.clients || []);
      setDocuments(data.documents as Document[]);
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

  const handleOpenCreate = () => {
    setSelectedClientId(clients[0]?.id || '');
    setDocName('');
    setCategory('report');
    setExpiryDate('');
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !selectedFile) {
      triggerToast('Document name and file are required.', true);
      return;
    }
    setSaving(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const res = await uploadDocument({
          clientId: selectedClientId,
          name: docName,
          category,
          expiryDate: expiryDate || undefined,
          fileBase64: reader.result as string,
          fileName: selectedFile.name
        });
        if (res.success) {
          loadData();
          setShowModal(false);
          triggerToast('Document uploaded.');
        } else {
          triggerToast(res.error || 'Upload failed.', true);
        }
        setSaving(false);
      };
      reader.onerror = () => {
        triggerToast('Failed to read file.', true);
        setSaving(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
      setSaving(false);
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Delete document "${doc.name}"?`)) return;
    const res = await deleteDocument(doc.id);
    if (res.success) {
      loadData();
      triggerToast('Document deleted.');
    } else {
      triggerToast(res.error || 'Failed to delete.', true);
    }
  };

  const handleDownload = async (doc: Document) => {
    const res = await downloadDocument(doc.id);
    if (res.success && res.url) {
      window.open(res.url, '_blank');
    } else {
      triggerToast(res.error || 'Failed to download document.', true);
    }
  };

  const filteredDocuments = documents.filter(d => categoryFilter === 'all' || d.category === categoryFilter);

  const expiringSoon = documents.filter(d =>
    d.expiry_date && new Date(d.expiry_date).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 && new Date(d.expiry_date) >= new Date()
  ).length;

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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Documents</h1>
          <p className="text-sm text-neutral-500 mt-1">Upload and manage documents available to clients on the portal.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Documents</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{documents.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Categories</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{new Set(documents.map(d => d.category)).size}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Expiring in 30 Days</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{expiringSoon}</div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex items-center gap-2 w-full sm:w-auto">
        <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="report">Report</option>
          <option value="invoice">Invoice</option>
          <option value="contract">Contract</option>
          <option value="certificate">Certificate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">LOADING DOCUMENTS...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No documents found</h3>
            <p className="text-xs text-neutral-400 mt-1">Upload your first document to share with clients.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Document</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Size</th>
                  <th className="py-3.5 px-6">Expiry</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredDocuments.map(doc => (
                  <tr key={doc.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-neutral-100 rounded-lg shrink-0">
                          <File className="w-4 h-4 text-neutral-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">{doc.name}</div>
                          <div className="text-[10px] text-neutral-400">{doc.file_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {doc.client ? (
                        <div>
                          <div className="text-neutral-800 font-medium">{doc.client.name}</div>
                          <div className="text-[10px] text-neutral-400">{doc.client.email}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${categoryColors[doc.category] || categoryColors.other}`}>
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-neutral-500">{formatBytes(doc.file_size)}</td>
                    <td className="py-4 px-6">
                      {doc.expiry_date ? (
                        <span className={`inline-flex items-center gap-1 ${new Date(doc.expiry_date) < new Date() ? 'text-rose-600 font-semibold' : 'text-neutral-600'}`}>
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {new Date(doc.expiry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {new Date(doc.expiry_date) < new Date() && ' (expired)'}
                        </span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          title="Delete"
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-neutral-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">Upload New Document</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-neutral-400 hover:text-primary rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Client</label>
                <select
                  required
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  {clients.length === 0 && <option value="">No clients registered</option>}
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Document Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. September Marketing Report"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="report">Report</option>
                    <option value="invoice">Invoice</option>
                    <option value="contract">Contract</option>
                    <option value="certificate">Certificate</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">File</label>
                <div className="border border-dashed border-neutral-200 bg-neutral-50 rounded-lg p-4 text-center cursor-pointer hover:bg-neutral-100/50 transition-all relative">
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-neutral-700">
                    {selectedFile ? selectedFile.name : 'Click to choose a file'}
                  </p>
                  <p className="text-[9px] text-neutral-400 mt-0.5">PDF, DOC, XLS, or image</p>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}