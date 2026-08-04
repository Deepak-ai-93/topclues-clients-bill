'use client';

import React, { useState } from 'react';
import { HelpCircle, Plus, MessageSquare, Paperclip, Phone, Mail, Clock, CheckCircle, AlertCircle, Send, User } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created: string;
  lastUpdate: string;
}

const initialTickets: Ticket[] = [
  { id: "TKT-001", subject: "Instagram reel revision required", category: "Content Change", priority: "Medium", status: "in_progress", created: "28 Jul 2026", lastUpdate: "30 Jul 2026" },
  { id: "TKT-002", subject: "July invoice not received", category: "Billing", priority: "High", status: "resolved", created: "20 Jul 2026", lastUpdate: "22 Jul 2026" },
  { id: "TKT-003", subject: "Google Ads campaign performance question", category: "Advertising", priority: "Low", status: "open", created: "1 Aug 2026", lastUpdate: "1 Aug 2026" }
];

const statusColors: Record<string, string> = {
  open: 'bg-primary-100 text-primary-800 border-primary-300',
  in_progress: 'bg-amber-100 text-amber-800 border-amber-300',
  resolved: 'bg-accent-100 text-accent-800 border-accent-300',
  closed: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

const priorityColors: Record<string, string> = {
  urgent: 'bg-rose-100 text-rose-800 border-rose-300',
  high: 'bg-amber-100 text-amber-800 border-amber-300',
  medium: 'bg-primary-100 text-primary-800 border-primary-300',
  low: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    subject: '',
    category: 'Content Change',
    priority: 'Medium',
    description: '',
  });

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TKT-00${tickets.length + 1}`;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const newTicket: Ticket = {
      id: newId,
      subject: formData.subject,
      category: formData.category,
      priority: formData.priority,
      status: 'open',
      created: dateStr,
      lastUpdate: dateStr,
    };

    setTickets([newTicket, ...tickets]);
    setFormData({ subject: '', category: 'Content Change', priority: 'Medium', description: '' });
    setView('list');
    triggerToast(`Support ticket ${newId} created successfully!`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-primary text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border border-primary-800">
          <CheckCircle className="w-4 h-4 text-accent-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Client Support Desk</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Submit support tickets, request changes, or talk to your account manager.</p>
        </div>

        <button
          onClick={() => setView(view === 'list' ? 'create' : 'list')}
          className="px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary-700 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {view === 'list' ? (
            <>
              <Plus className="w-4 h-4" /> Create Support Ticket
            </>
          ) : (
            '← View All Tickets'
          )}
        </button>
      </div>

      {/* Main View: List or Create */}
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
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
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

            <div>
              <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Attachment (Optional)</label>
              <div className="flex items-center gap-3 p-3 border border-neutral-300 rounded-lg bg-neutral-50">
                <Paperclip className="w-4 h-4 text-neutral-500" />
                <input type="file" className="text-xs text-neutral-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-700" />
              </div>
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
      ) : (
        /* Ticket List */
        <div className="border border-primary rounded-xl bg-white overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Your Tickets</h2>
            <span className="text-[10px] font-mono bg-neutral-100 px-2 py-1 rounded border border-neutral-300">
              {tickets.length} TICKETS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary bg-neutral-50 text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs font-sans">
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-black">{t.id}</td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">{t.subject}</td>
                    <td className="py-3.5 px-4 text-neutral-600 font-mono">{t.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        priorityColors[t.priority.toLowerCase()] || priorityColors.medium
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        statusColors[t.status] || statusColors.open
                      }`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-neutral-500">{t.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Account Manager Contact Card */}
      <div className="border-2 border-primary p-6 rounded-xl bg-white space-y-4">
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm font-mono">
            RM
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">Your Dedicated Contact</span>
            <h3 className="text-base font-bold text-neutral-900">Rahul Mehta — Account Manager</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <Phone className="w-4 h-4 text-black shrink-0" />
            <div>
              <span className="text-[9px] text-neutral-400 block">PHONE</span>
              <span className="font-bold text-neutral-800">+91 98765 00001</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <Mail className="w-4 h-4 text-black shrink-0" />
            <div>
              <span className="text-[9px] text-neutral-400 block">EMAIL</span>
              <span className="font-bold text-neutral-800">rahul@topclues.com</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <Clock className="w-4 h-4 text-black shrink-0" />
            <div>
              <span className="text-[9px] text-neutral-400 block">WORKING HOURS</span>
              <span className="font-bold text-neutral-800">Mon-Sat, 9AM-7PM</span>
            </div>
          </div>

          <a
            href="https://wa.me/919876500001"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 bg-accent-600 text-white rounded-lg font-bold text-xs hover:bg-accent-700 transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
