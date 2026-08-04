'use client';

import React, { useState, useEffect } from 'react';
import { Download, FileText, Search, CheckCircle, AlertCircle, CreditCard, Receipt } from 'lucide-react';
import { getClientBillingDocuments, downloadBillingDocument } from '../../../lib/actions';

interface BillingDocument {
  id: string;
  title: string;
  billing_date: string;
  amount: number;
  payment_status: string;
  pdf_name: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  paid: 'bg-accent-100 text-accent-800 border-accent-300',
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  overdue: 'bg-rose-100 text-rose-800 border-rose-300',
  partially_paid: 'bg-primary-100 text-primary-800 border-primary-300',
  cancelled: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  refunded: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

export default function ClientInvoicesPage() {
  const [documents, setDocuments] = useState<BillingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientBillingDocuments();
        setDocuments(data.documents as BillingDocument[]);
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

  const handleDownload = async (docId: string) => {
    const res = await downloadBillingDocument(docId);
    if (res.success && res.url) window.open(res.url, '_blank');
    else triggerError(res.error || 'Failed to prepare download.');
  };

  const filtered = documents.filter(d => {
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalDue = documents
    .filter(d => d.payment_status === 'pending' || d.payment_status === 'overdue' || d.payment_status === 'partially_paid')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Invoices & Payments</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">View and download your invoices and payment records.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-primary p-4 rounded-xl bg-white">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-500 font-bold">
            <Receipt className="w-4 h-4" /> Total Invoices
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">{documents.length}</div>
        </div>
        <div className="border border-primary p-4 rounded-xl bg-white">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-500 font-bold">
            <CreditCard className="w-4 h-4" /> Paid
          </div>
          <div className="text-2xl font-bold text-accent-600 mt-2">{documents.filter(d => d.payment_status === 'paid').length}</div>
        </div>
        <div className="border border-primary p-4 rounded-xl bg-white">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-500 font-bold">
            <FileText className="w-4 h-4" /> Pending / Overdue
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {documents.filter(d => d.payment_status === 'pending' || d.payment_status === 'overdue').length}
          </div>
        </div>
        <div className="border border-primary p-4 rounded-xl bg-white">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-500 font-bold">
            <AlertCircle className="w-4 h-4" /> Amount Due
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">₹{totalDue.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 p-2.5 border border-primary rounded-lg bg-white flex-1">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="w-full text-xs font-semibold outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 rounded-xl">
          <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-semibold">No invoices found.</p>
          <p className="text-xs text-neutral-400 font-mono mt-1">Invoices issued by Topclues will appear here.</p>
        </div>
      ) : (
        <div className="border border-primary rounded-xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary bg-neutral-50 text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice</th>
                  <th className="py-3 px-4">Billing Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs font-sans">
                {filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">{doc.title}</div>
                      <div className="text-[10px] font-mono text-neutral-400">{doc.pdf_name}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">{doc.billing_date}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      ₹{(Number(doc.amount) || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${statusColors[doc.payment_status] || statusColors.pending}`}>
                        {doc.payment_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDownload(doc.id)}
                        className="px-3 py-1.5 bg-primary text-white text-[11px] font-semibold rounded-lg hover:bg-primary-700 flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}