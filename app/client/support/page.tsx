'use client';

import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Phone, Mail, Clock, CheckCircle, AlertCircle, Send, ChevronLeft, X } from 'lucide-react';
import { getClientTickets, getTicketReplies, createClientTicket, addTicketReply } from '../../../lib/actions';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assigned_to: string;
  created_at: string;
  message: string;
}

interface Reply {
  id: string;
  sender: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  open: 'bg-primary-100 text-primary-800 border-primary-300',
  in_progress: 'bg-amber-100 text-amber-800 border-amber-300',
  waiting_for_client: 'bg-violet-100 text-violet-800 border-violet-300',
  resolved: 'bg-accent-100 text-accent-800 border-accent-300',
  closed: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

const priorityColors: Record<string, string> = {
  urgent: 'bg-rose-100 text-rose-800 border-rose-300',
  high: 'bg-amber-100 text-amber-800 border-amber-300',
  normal: 'bg-primary-100 text-primary-800 border-primary-300',
  low: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subject: '',
    category: 'Content Change',
    priority: 'normal',
    description: '',
  });

  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const loadTickets = async () => {
    const data = await getClientTickets();
    setTickets(data.tickets as Ticket[]);
  };

  useEffect(() => {
    async function load() {
      try {
        await loadTickets();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createClientTicket({
      subject: formData.subject,
      category: formData.category,
      priority: formData.priority,
      message: formData.description,
    });
    if (res.success) {
      triggerToast('Support ticket created successfully!');
      setFormData({ subject: '', category: 'Content Change', priority: 'normal', description: '' });
      setView('list');
      await loadTickets();
    } else {
      triggerToast(res.error || 'Failed to create ticket.', true);
    }
  };

  const openTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyText('');
    const data = await getTicketReplies(ticket.id);
    setReplies(data.replies as Reply[]);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await addTicketReply(selectedTicket.id, replyText.trim());
      if (res.success) {
        setReplyText('');
        const data = await getTicketReplies(selectedTicket.id);
        setReplies(data.replies as Reply[]);
      } else {
        triggerToast(res.error || 'Failed to send reply.', true);
      }
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Client Support Desk</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Submit support tickets, request changes, or talk to your account manager.</p>
        </div>

        <button
          onClick={() => { setView(view === 'list' ? 'create' : 'list'); setSelectedTicket(null); }}
          className="px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary-700 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {view === 'list' && !selectedTicket ? (
            <>
              <Plus className="w-4 h-4" /> Create Support Ticket
            </>
          ) : (
            <><ChevronLeft className="w-4 h-4" /> Back to Tickets</>
          )}
        </button>
      </div>

      {view === 'create' ? (
        <div className="border-2 border-primary p-6 rounded-xl bg-white space-y-6 max-w-3xl">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-3">Submit New Support Ticket</h2>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your request or issue"
                className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="Content Change">Content Change</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Advertising">Advertising</option>
                  <option value="Billing">Billing</option>
                  <option value="Website">Website</option>
                  <option value="Leads">Leads</option>
                  <option value="Reports">Reports</option>
                  <option value="Account Access">Account Access</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Description / Details</label>
              <textarea
                rows={5}
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed information regarding your inquiry..."
                className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-4 py-2.5 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-700 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit Ticket
              </button>
            </div>
          </form>
        </div>
      ) : selectedTicket ? (
        <div className="border border-primary rounded-xl bg-white overflow-hidden">
          <div className="p-6 border-b border-neutral-200 bg-neutral-50/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase">{selectedTicket.id.slice(0, 8)}</span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${statusColors[selectedTicket.status] || statusColors.open}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${priorityColors[selectedTicket.priority] || priorityColors.normal}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 rounded border border-neutral-300 uppercase">{selectedTicket.category}</span>
                </div>
                <h2 className="text-lg font-bold text-neutral-900 mt-2">{selectedTicket.subject}</h2>
                <p className="text-xs text-neutral-600 mt-2 bg-white p-3 rounded-lg border border-neutral-200">{selectedTicket.message}</p>
                <div className="text-[10px] font-mono text-neutral-400 mt-2">
                  Created {formatDate(selectedTicket.created_at)}
                  {selectedTicket.assigned_to && <> • Assigned to {selectedTicket.assigned_to}</>}
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-neutral-100 rounded shrink-0">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <h3 className="text-sm font-mono font-bold text-neutral-500 uppercase">Conversation Thread</h3>
            {replies.length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono">No replies yet. Topclues will respond shortly.</p>
            ) : (
              <div className="space-y-3">
                {replies.map(r => (
                  <div key={r.id} className={`p-4 rounded-lg border max-w-[85%] ${r.sender === 'client' ? 'bg-primary-50 border-primary-200 ml-auto' : 'bg-neutral-50 border-neutral-200'}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase">{r.sender_name}</span>
                      <span className="text-[9px] font-mono text-neutral-400">
                        {new Date(r.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-800">{r.message}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-neutral-200">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendReply(); }}
                placeholder="Type your reply..."
                className="flex-1 p-2.5 border border-primary rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-black"
              />
              <button
                onClick={handleSendReply}
                disabled={sendingReply || !replyText.trim()}
                className="px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-primary rounded-xl bg-white overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Your Tickets</h2>
            <span className="text-[10px] font-mono bg-neutral-100 px-2 py-1 rounded border border-neutral-300">
              {tickets.length} TICKETS
            </span>
          </div>

          {tickets.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-neutral-300 rounded-lg">
              <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-neutral-500 font-mono">No support tickets yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary bg-neutral-50 text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-xs font-sans">
                  {tickets.map(t => (
                    <tr key={t.id} onClick={() => openTicket(t)} className="hover:bg-neutral-50/50 transition-colors cursor-pointer">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">{t.subject}</div>
                        <div className="text-[10px] font-mono text-neutral-400">ID: {t.id.slice(0, 8)}</div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 font-mono">{t.category}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${priorityColors[t.priority] || priorityColors.normal}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${statusColors[t.status] || statusColors.open}`}>
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-neutral-500">{formatDate(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="border-2 border-primary p-6 rounded-xl bg-white space-y-4">
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm font-mono">
            RT
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">Your Dedicated Contact</span>
            <h3 className="text-base font-bold text-neutral-900">Topclues Account Team</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <Phone className="w-4 h-4 text-black shrink-0" />
            <div>
              <span className="text-[9px] text-neutral-400 block">PHONE</span>
              <span className="font-bold text-neutral-800">+91 90000 12345</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <Mail className="w-4 h-4 text-black shrink-0" />
            <div>
              <span className="text-[9px] text-neutral-400 block">EMAIL</span>
              <span className="font-bold text-neutral-800">support@topclues.in</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <Clock className="w-4 h-4 text-black shrink-0" />
            <div>
              <span className="text-[9px] text-neutral-400 block">WORKING HOURS</span>
              <span className="font-bold text-neutral-800">Mon-Sat, 9AM-7PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}