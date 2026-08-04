'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminLeadsData,
  createLead,
  updateLead,
  deleteLead,
  downloadLeadDocument
} from '../../../lib/actions';
import {
  Search,
  Plus,
  Trash2,
  Download,
  User,
  X,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Edit3,
  Filter,
  UploadCloud,
  FileText
} from 'lucide-react';

interface ClientEntry {
  id: string;
  name: string;
  email: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  notes: string;
  asset_url: string;
  asset_name: string;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

const sourceLabels: Record<string, string> = {
  website: 'Website',
  referral: 'Referral',
  social: 'Social Media',
  email: 'Email',
  call: 'Call',
  other: 'Other'
};

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  lost: 'Lost'
};

const statusColors: Record<string, string> = {
  new: 'bg-primary-50 text-primary-700 border-primary-200',
  contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  converted: 'bg-accent-50 text-accent-700 border-accent-200',
  lost: 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function AdminLeadsPage() {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSource, setLeadSource] = useState('website');
  const [leadStatus, setLeadStatus] = useState('new');
  const [leadNotes, setLeadNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminLeadsData();
      setClients(data.clients || []);
      setLeads(data.leads as Lead[]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleOpenCreate = () => {
    setEditingLead(null);
    setSelectedClientId(clients[0]?.id || '');
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadSource('website');
    setLeadStatus('new');
    setLeadNotes('');
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead(lead);
    setSelectedClientId('');
    setLeadName(lead.name);
    setLeadEmail(lead.email);
    setLeadPhone(lead.phone);
    setLeadSource(lead.source);
    setLeadStatus(lead.status);
    setLeadNotes(lead.notes);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDownload = async (leadId: string) => {
    try {
      const res = await downloadLeadDocument(leadId);
      if (res.success && res.url) {
        window.open(res.url, '_blank');
      } else {
        triggerToast(res.error || 'Failed to download.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName) {
      triggerToast('Lead name is required.', true);
      return;
    }

    setSaving(true);
    try {
      const readAndSave = async (action: Function, ...args: any[]) => {
        if (selectedFile) {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64String = reader.result as string;
            const res = await action(...args, {
              pdfBase64: base64String,
              pdfName: selectedFile.name
            });
            if (res.success) {
              loadData();
              setShowModal(false);
              triggerToast(editingLead ? 'Lead updated.' : 'Lead created.');
            } else {
              triggerToast(res.error || 'Operation failed.', true);
            }
            setSaving(false);
          };
          reader.readAsDataURL(selectedFile);
        } else {
          const res = await action(...args, {});
          if (res.success) {
            loadData();
            setShowModal(false);
            triggerToast(editingLead ? 'Lead updated.' : 'Lead created.');
          } else {
            triggerToast(res.error || 'Operation failed.', true);
          }
          setSaving(false);
        }
      };

      if (editingLead) {
        await readAndSave(updateLead, editingLead.id, {
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          source: leadSource,
          status: leadStatus,
          notes: leadNotes
        });
      } else {
        if (!selectedClientId) {
          triggerToast('Please select a client.', true);
          setSaving(false);
          return;
        }
        await readAndSave(createLead, {
          clientId: selectedClientId,
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          source: leadSource,
          status: leadStatus,
          notes: leadNotes
        });
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
      setSaving(false);
    }
  };

  const handleDelete = async (leadId: string, name: string) => {
    if (!confirm(`Permanently delete lead "${name}"?`)) return;
    try {
      const res = await deleteLead(leadId);
      if (res.success) {
        loadData();
        triggerToast('Lead deleted.');
      } else {
        triggerToast(res.error || 'Failed to delete.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Source', 'Status', 'Notes', 'Client', 'Created'];
    const rows = leads.map(l => [
      l.name,
      l.email,
      l.phone,
      sourceLabels[l.source] || l.source,
      statusLabels[l.status] || l.status,
      l.notes,
      l.client?.name || 'N/A',
      new Date(l.created_at).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Leads exported to CSV.');
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.client && l.client.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Leads Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Review, manage, and export leads for your clients.</p>
        </div>

        <div className="flex gap-2">
          {leads.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">LOADING LEAD DATABASE...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 text-center">
            <User className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No leads found</h3>
            <p className="text-xs text-neutral-400 mt-1">Start adding leads for your clients to track and manage them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-6">Contact</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Source</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Document</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-neutral-900">{lead.name}</div>
                      {lead.notes && (
                        <div className="text-[10px] text-neutral-400 truncate max-w-[160px]">{lead.notes}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        {lead.email && (
                          <span className="flex items-center gap-1 text-neutral-600">
                            <Mail className="w-3 h-3 text-neutral-400" />
                            {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-neutral-600">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {lead.client ? (
                        <span className="text-neutral-700">{lead.client.name}</span>
                      ) : (
                        <span className="text-neutral-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-neutral-600">{sourceLabels[lead.source] || lead.source}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[lead.status] || statusColors.new}`}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {lead.asset_url ? (
                        <button
                          onClick={() => handleDownload(lead.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[10px] font-semibold text-neutral-700 transition-all cursor-pointer"
                          title="Download document"
                        >
                          <Download className="w-3 h-3" />
                          {lead.asset_name || 'Download'}
                        </button>
                      ) : (
                        <span className="text-neutral-300 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(lead)}
                          className="p-1.5 text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id, lead.name)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
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
              <h2 className="text-sm font-semibold text-neutral-900">
                {editingLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-neutral-400 hover:text-primary rounded-lg hover:bg-neutral-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

              {!editingLead && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Assign Client</label>
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
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Lead Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="+1 (555) 123-4567"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Source</label>
                  <select
                    required
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                    <option value="email">Email</option>
                    <option value="call">Call</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Status</label>
                  <select
                    required
                    value={leadStatus}
                    onChange={(e) => setLeadStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Notes</label>
                <textarea
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Additional information about this lead..."
                  rows={2}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Document (PDF / Doc)</label>
                <div className="border border-dashed border-neutral-200 bg-neutral-50 rounded-lg p-3 text-center cursor-pointer hover:bg-neutral-100/50 transition-all relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-neutral-700">
                    {selectedFile ? selectedFile.name : 'Click to upload document'}
                  </p>
                  <p className="text-[9px] text-neutral-400 mt-0.5">PDF or Document</p>
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
                      Saving...
                    </>
                  ) : (
                    editingLead ? 'Update Lead' : 'Add Lead'
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
