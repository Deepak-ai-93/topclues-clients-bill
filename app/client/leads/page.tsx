'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, UserPlus, Phone, MessageCircle, ChevronDown, CheckCircle, AlertCircle, X, History } from 'lucide-react';
import { getClientLeads, updateClientLeadStatus, getLeadFollowups, addLeadFollowup } from '../../../lib/actions';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  notes: string;
  interested_service: string;
  location: string;
  campaign_name: string;
  assigned_staff: string;
  next_followup_date: string | null;
  created_at: string;
}

interface Followup {
  id: string;
  note: string;
  next_followup_date: string | null;
  created_by: string;
  created_at: string;
}

const statuses = ['new', 'contacted', 'appointment_booked', 'follow_up_required', 'converted', 'not_interested', 'invalid', 'duplicate'];

const statusColors: Record<string, string> = {
  new: 'bg-primary-100 text-primary-800 border-primary-300',
  contacted: 'bg-amber-100 text-amber-800 border-amber-300',
  appointment_booked: 'bg-violet-100 text-violet-800 border-violet-300',
  follow_up_required: 'bg-rose-100 text-rose-800 border-rose-300',
  converted: 'bg-accent-100 text-accent-800 border-accent-300',
  not_interested: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  invalid: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  duplicate: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

export default function ClientLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [followupNote, setFollowupNote] = useState('');
  const [followupDate, setFollowupDate] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientLeads();
        setLeads(data.leads as Lead[]);
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

  const handleStatusChange = async (leadId: string, status: string) => {
    const res = await updateClientLeadStatus(leadId, status);
    if (res.success) {
      setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, status } : l)));
      if (selectedLead?.id === leadId) setSelectedLead({ ...selectedLead, status });
      triggerToast('Lead status updated.');
    } else {
      triggerToast(res.error || 'Failed to update status.', true);
    }
  };

  const openLead = async (lead: Lead) => {
    setSelectedLead(lead);
    setFollowupNote('');
    setFollowupDate('');
    const data = await getLeadFollowups(lead.id);
    setFollowups(data.followups as Followup[]);
  };

  const handleAddFollowup = async () => {
    if (!selectedLead) return;
    if (!followupNote.trim()) {
      triggerToast('Please enter a follow-up note.', true);
      return;
    }
    const res = await addLeadFollowup(selectedLead.id, followupNote.trim(), followupDate || undefined);
    if (res.success) {
      triggerToast('Follow-up note added.');
      setFollowupNote('');
      setFollowupDate('');
      const data = await getLeadFollowups(selectedLead.id);
      setFollowups(data.followups as Followup[]);
      setLeads(prev => prev.map(l => (l.id === selectedLead.id ? { ...l, next_followup_date: followupDate || l.next_followup_date } : l)));
      setSelectedLead({ ...selectedLead, next_followup_date: followupDate || selectedLead.next_followup_date });
    } else {
      triggerToast(res.error || 'Failed to add note.', true);
    }
  };

  const handleExportCSV = () => {
    const header = ['Name', 'Email', 'Phone', 'Source', 'Status', 'Service', 'Location', 'Campaign', 'Assigned', 'Next Follow-up', 'Received Date', 'Notes'];
    const rows = filtered.map(l => [
      l.name, l.email, l.phone, l.source, l.status, l.interested_service, l.location,
      l.campaign_name, l.assigned_staff, l.next_followup_date || '', l.created_at, l.notes
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Leads exported to CSV.');
  };

  const filtered = leads.filter(l => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const sources = Array.from(new Set(leads.map(l => l.source)));

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
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
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Leads Management</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Review patient inquiries, track follow-ups and measure outcomes.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 p-2.5 border border-primary rounded-lg bg-white flex-1">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full text-xs font-semibold outline-none"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white">
          <option value="all">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white">
          <option value="all">All Sources</option>
          {sources.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 rounded-xl">
          <UserPlus className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-semibold">No leads found.</p>
          <p className="text-xs text-neutral-400 font-mono mt-1">Incoming patient inquiries will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-primary rounded-xl bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary bg-neutral-50 text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Next Follow-up</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-xs font-sans">
                  {filtered.map(lead => (
                    <tr key={lead.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">{lead.name}</div>
                        <div className="text-[10px] font-mono text-neutral-400">{lead.phone || lead.email || 'No contact'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 rounded border border-neutral-300 uppercase">{lead.source.replace('_', ' ')}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${statusColors[lead.status] || statusColors.new}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-neutral-600">{lead.next_followup_date || '—'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openLead(lead)}
                          className="px-3 py-1.5 bg-primary text-white text-[11px] font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
                        >
                          View / Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail panel */}
          <div className="border border-primary rounded-xl bg-white p-5 space-y-5 h-fit sticky top-6">
            {!selectedLead ? (
              <div className="text-center py-10">
                <History className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                <p className="text-xs text-neutral-400 font-mono">Select a lead to view details and add follow-ups.</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">{selectedLead.name}</h3>
                    <div className="text-[10px] font-mono text-neutral-400 mt-0.5">{selectedLead.phone} {selectedLead.email && `• ${selectedLead.email}`}</div>
                  </div>
                  <button onClick={() => setSelectedLead(null)} className="p-1 hover:bg-neutral-100 rounded">
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="text-[9px] text-neutral-400 block">STATUS</span>
                    <select
                      value={selectedLead.status}
                      onChange={e => handleStatusChange(selectedLead.id, e.target.value)}
                      className="w-full text-xs font-bold text-neutral-800 bg-transparent outline-none cursor-pointer"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="text-[9px] text-neutral-400 block">SOURCE</span>
                    <span className="font-bold text-neutral-800 capitalize">{selectedLead.source.replace('_', ' ')}</span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="text-[9px] text-neutral-400 block">SERVICE</span>
                    <span className="font-bold text-neutral-800">{selectedLead.interested_service || '—'}</span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="text-[9px] text-neutral-400 block">RECEIVED</span>
                    <span className="font-bold text-neutral-800">{new Date(selectedLead.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                  {selectedLead.location && (
                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 col-span-2">
                      <span className="text-[9px] text-neutral-400 block">LOCATION</span>
                      <span className="font-bold text-neutral-800">{selectedLead.location}</span>
                    </div>
                  )}
                  {selectedLead.notes && (
                    <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 col-span-2">
                      <span className="text-[9px] text-neutral-400 block">NOTES</span>
                      <span className="font-bold text-neutral-800">{selectedLead.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {selectedLead.phone && (
                    <>
                      <a href={`tel:${selectedLead.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-white rounded-lg text-[11px] font-bold hover:bg-primary-700 transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a
                        href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-accent-600 text-white rounded-lg text-[11px] font-bold hover:bg-accent-700 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </>
                  )}
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-neutral-500 uppercase">Follow-up History</h4>
                  {followups.length === 0 ? (
                    <p className="text-[11px] text-neutral-400 font-mono">No follow-ups recorded yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {followups.map(f => (
                        <div key={f.id} className="p-3 border border-neutral-200 rounded-lg bg-neutral-50">
                          <p className="text-[11px] font-semibold text-neutral-800">{f.note}</p>
                          <div className="flex items-center justify-between mt-1.5 text-[9px] font-mono text-neutral-400">
                            <span>{f.created_by}</span>
                            <span>{new Date(f.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          {f.next_followup_date && (
                            <div className="text-[9px] font-mono text-primary font-bold mt-1">Next: {f.next_followup_date}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <textarea
                      value={followupNote}
                      onChange={e => setFollowupNote(e.target.value)}
                      rows={3}
                      placeholder="Add a follow-up note..."
                      className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-black"
                    />
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={followupDate}
                        onChange={e => setFollowupDate(e.target.value)}
                        className="flex-1 p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white"
                      />
                      <button
                        onClick={handleAddFollowup}
                        className="px-4 py-2.5 bg-primary text-white rounded-lg text-[11px] font-bold hover:bg-primary-700 transition-colors cursor-pointer"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}