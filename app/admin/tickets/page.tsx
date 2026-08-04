'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminTicketsData,
  updateTicket,
  deleteTicket,
  getTicketReplies,
  addTicketReply
} from '../../../lib/actions';
import {
  Trash2,
  MessageSquare,
  X,
  CheckCircle,
  AlertCircle,
  Send,
  Filter,
  ChevronLeft,
  HelpCircle
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assigned_to: string;
  message: string;
  created_at: string;
  resolved_at: string | null;
  client?: {
    name: string;
    email: string;
  };
}

interface Reply {
  id: string;
  sender: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  open: 'bg-primary-50 text-primary-700 border-primary-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  waiting_for_client: 'bg-violet-50 text-violet-700 border-violet-200',
  resolved: 'bg-accent-50 text-accent-700 border-accent-200',
  closed: 'bg-neutral-100 text-neutral-600 border-neutral-200'
};

const priorityColors: Record<string, string> = {
  urgent: 'bg-rose-50 text-rose-700 border-rose-200',
  high: 'bg-amber-50 text-amber-700 border-amber-200',
  normal: 'bg-primary-50 text-primary-700 border-primary-200',
  low: 'bg-neutral-100 text-neutral-600 border-neutral-200'
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminTicketsData();
      setTickets(data.tickets as Ticket[]);
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

  const openTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyText('');
    const data = await getTicketReplies(ticket.id);
    setReplies(data.replies as Reply[]);
  };

  const handleStatusChange = async (ticketId: string, status: string) => {
    const res = await updateTicket(ticketId, { status });
    if (res.success) {
      loadData();
      if (selectedTicket) openTicket(selectedTicket);
      triggerToast('Ticket status updated.');
    } else {
      triggerToast(res.error || 'Failed to update status.', true);
    }
  };

  const handlePriorityChange = async (ticketId: string, priority: string) => {
    const res = await updateTicket(ticketId, { priority });
    if (res.success) {
      loadData();
      if (selectedTicket) openTicket(selectedTicket);
      triggerToast('Ticket priority updated.');
    } else {
      triggerToast(res.error || 'Failed to update priority.', true);
    }
  };

  const handleDelete = async (ticket: Ticket) => {
    if (!confirm(`Delete ticket "${ticket.subject}"?`)) return;
    const res = await deleteTicket(ticket.id);
    if (res.success) {
      if (selectedTicket?.id === ticket.id) setSelectedTicket(null);
      loadData();
      triggerToast('Ticket deleted.');
    } else {
      triggerToast(res.error || 'Failed to delete.', true);
    }
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

  const filteredTickets = tickets.filter(t => statusFilter === 'all' || t.status === statusFilter);

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Support Tickets</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage client support requests and reply to conversations.</p>
        </div>

        {selectedTicket && (
          <button
            onClick={() => setSelectedTicket(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Tickets
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Open</div>
          <div className="text-2xl font-bold text-primary-700 mt-1">{openCount}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">In Progress</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{inProgressCount}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Resolved / Closed</div>
          <div className="text-2xl font-bold text-accent-700 mt-1">{resolvedCount}</div>
        </div>
      </div>

      {selectedTicket ? (
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-200 bg-neutral-50/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase">{selectedTicket.id.slice(0, 8)}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusColors[selectedTicket.status] || statusColors.open}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-white rounded-full border border-neutral-300 uppercase">{selectedTicket.category}</span>
                  {selectedTicket.client && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-white rounded-full border border-neutral-300">
                      {selectedTicket.client.name} • {selectedTicket.client.email}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-neutral-900 mt-2">{selectedTicket.subject}</h2>
                <p className="text-xs text-neutral-600 mt-2 bg-white p-3 rounded-lg border border-neutral-200 max-w-3xl">{selectedTicket.message}</p>
                <div className="text-[10px] font-mono text-neutral-400 mt-2">
                  Created {new Date(selectedTicket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {selectedTicket.resolved_at && <> • Resolved {new Date(selectedTicket.resolved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</>}
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-neutral-100 rounded shrink-0 cursor-pointer">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-neutral-200">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Status</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer capitalize"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_for_client">Waiting for Client</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Priority</span>
                <select
                  value={selectedTicket.priority}
                  onChange={(e) => handlePriorityChange(selectedTicket.id, e.target.value)}
                  className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer capitalize"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">&nbsp;</span>
                <button
                  onClick={() => handleDelete(selectedTicket)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wide">Conversation Thread</h3>
            {replies.length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono">No replies yet. Respond to the client below.</p>
            ) : (
              <div className="space-y-3">
                {replies.map(r => (
                  <div key={r.id} className={`p-4 rounded-lg border max-w-[85%] ${r.sender === 'client' ? 'bg-primary-50 border-primary-200' : 'bg-neutral-50 border-neutral-200'}`}>
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
                className="flex-1 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSendReply}
                disabled={sendingReply || !replyText.trim()}
                className="px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_client">Waiting for Client</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-neutral-400 font-mono">LOADING TICKETS...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-16 text-center">
                <HelpCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-neutral-900">No tickets found</h3>
                <p className="text-xs text-neutral-400 mt-1">Client support requests will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Ticket</th>
                      <th className="py-3.5 px-6">Client</th>
                      <th className="py-3.5 px-6">Category</th>
                      <th className="py-3.5 px-6">Priority</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Created</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {filteredTickets.map(ticket => (
                      <tr
                        key={ticket.id}
                        onClick={() => openTicket(ticket)}
                        className="hover:bg-neutral-50/40 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="font-semibold text-neutral-900">{ticket.subject}</div>
                          <div className="text-[10px] font-mono text-neutral-400">ID: {ticket.id.slice(0, 8)}</div>
                        </td>
                        <td className="py-4 px-6">
                          {ticket.client ? (
                            <div>
                              <div className="text-neutral-800 font-medium">{ticket.client.name}</div>
                              <div className="text-[10px] text-neutral-400">{ticket.client.email}</div>
                            </div>
                          ) : (
                            <span className="text-neutral-400 italic">N/A</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-neutral-600 font-mono text-[10px] uppercase">{ticket.category}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${priorityColors[ticket.priority] || priorityColors.normal}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${statusColors[ticket.status] || statusColors.open}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-neutral-500">
                          {new Date(ticket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(ticket); }}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}