'use client';

import React, { useState, useEffect } from 'react';
import { 
  getAdminBillingData, 
  uploadBillingDocument, 
  deleteBillingDocument,
  downloadBillingDocument
} from '../../../lib/actions';
import { 
  Search, 
  UploadCloud, 
  Trash2, 
  FileText, 
  Download,
  Calendar,
  User,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ClientEntry {
  id: string;
  name: string;
  email: string;
}

interface BillingDocument {
  id: string;
  title: string;
  billing_date: string;
  pdf_name: string;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

export default function AdminInvoicesPage() {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [documents, setDocuments] = useState<BillingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Success / error notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form States
  const [selectedClientId, setSelectedClientId] = useState('');
  const [billingTitle, setBillingTitle] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminBillingData();
      setClients(data.clients);
      setDocuments(data.documents as BillingDocument[]);
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
    setBillingTitle('');
    setBillingDate(new Date().toISOString().split('T')[0]);
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
      if (!selectedClientId || !billingTitle || !billingDate || !selectedFile) {
      triggerToast('Please fill in all fields and select a PDF file.', true);
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        const res = await uploadBillingDocument({
          clientId: selectedClientId,
          title: billingTitle,
          billingDate: billingDate,
          pdfName: selectedFile.name,
          pdfBase64: base64String
        });

        if (res.success) {
          loadData();
          setShowUploadModal(false);
          triggerToast('Invoice successfully uploaded and linked to client.');
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

  const handleDelete = async (docId: string, title: string) => {
      if (!confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await deleteBillingDocument(docId);
      if (res.success) {
        loadData();
        triggerToast('Invoice permanently deleted.');
      } else {
        triggerToast(res.error || 'Failed to delete billing document.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleDownload = async (docId: string) => {
    try {
      const res = await downloadBillingDocument(docId);
      if (res.success && res.url) {
        window.open(res.url, '_blank');
      } else {
        triggerToast(res.error || 'Failed to download document.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.client && doc.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (doc.client && doc.client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Toast notifications */}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Invoices</h1>
          <p className="text-sm text-neutral-500 mt-1">Upload and manage invoices, receipts, and billing documents for your clients.</p>
        </div>

        <button
          onClick={handleOpenUploadModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-950 text-white hover:bg-neutral-800 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Invoice
        </button>
      </div>

      {/* Control filters bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by invoice title, client name, or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black transition-all"
          />
        </div>
      </div>

      {/* Billing list table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">SYNCHRONIZING DOCUMENT ARCHIVES...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No invoices uploaded yet</h3>
            <p className="text-xs text-neutral-400 mt-1">Upload an invoice, receipt, or billing document for one of your clients.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Invoice Title</th>
                  <th className="py-3.5 px-6">Client Name</th>
                  <th className="py-3.5 px-6">Invoice Date</th>
                  <th className="py-3.5 px-6">File Name</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredDocuments.map(doc => (
                  <tr key={doc.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                        {doc.title}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {doc.client ? (
                        <div>
                          <div className="font-semibold text-neutral-800">{doc.client.name}</div>
                          <div className="text-[10px] text-neutral-400">{doc.client.email}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">Deleted Client</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-neutral-500 font-mono">{doc.billing_date}</td>
                    <td className="py-4 px-6 text-neutral-500 font-mono truncate max-w-[180px]">{doc.pdf_name}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(doc.id)}
                          className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
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

      {/* Upload Billing Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-neutral-200 w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">Upload Invoice</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Select Partner Client</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <select
                    required
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black appearance-none cursor-pointer"
                  >
                    {clients.length === 0 && <option value="">No clients registered</option>}
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Invoice Title</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. July 2026 Consultancy Invoice"
                    value={billingTitle}
                    onChange={(e) => setBillingTitle(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Invoice Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="date"
                    required
                    value={billingDate}
                    onChange={(e) => setBillingDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">PDF File</label>
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
                    {selectedFile ? selectedFile.name : 'Click to select or drag invoice PDF'}
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
                  className="flex-1 py-2 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Document'
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
