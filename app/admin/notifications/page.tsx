'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminNotificationsData,
  sendNotification,
  deleteNotification
} from '../../../lib/actions';
import {
  Plus,
  Trash2,
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react';

interface ClientEntry {
  id: string;
  name: string;
  email: string;
}

interface Notification {
  id: string;
  client_id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

const typeLabels: Record<string, string> = {
  content: 'Content',
  report: 'Report',
  invoice: 'Invoice',
  lead: 'Lead',
  offer: 'Offer',
  meeting: 'Meeting',
  support: 'Support',
  package: 'Package',
  security: 'Security',
  general: 'General'
};

const typeColors: Record<string, string> = {
  content: 'bg-primary-50 text-primary-700 border-primary-200',
  report: 'bg-violet-50 text-violet-700 border-violet-200',
  invoice: 'bg-amber-50 text-amber-700 border-amber-200',
  lead: 'bg-teal-50 text-teal-700 border-teal-200',
  offer: 'bg-accent-50 text-accent-700 border-accent-200',
  meeting: 'bg-rose-50 text-rose-700 border-rose-200',
  support: 'bg-sky-50 text-sky-700 border-sky-200',
  package: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  security: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  general: 'bg-neutral-100 text-neutral-600 border-neutral-200'
};

export default function AdminNotificationsPage() {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');
  const [link, setLink] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminNotificationsData();
      setClients(data.clients || []);
      setNotifications(data.notifications as Notification[]);
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
    setTitle('');
    setMessage('');
    setType('general');
    setLink('');
    setShowModal(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      triggerToast('Title and message are required.', true);
      return;
    }
    setSaving(true);
    try {
      const res = await sendNotification({
        clientId: selectedClientId,
        title,
        message,
        type,
        link
      });
      if (res.success) {
        loadData();
        setShowModal(false);
        triggerToast('Notification sent.');
      } else {
        triggerToast(res.error || 'Failed to send notification.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Notification) => {
    if (!confirm(`Delete notification "${item.title}"?`)) return;
    const res = await deleteNotification(item.id);
    if (res.success) {
      loadData();
      triggerToast('Notification deleted.');
    } else {
      triggerToast(res.error || 'Failed to delete.', true);
    }
  };

  const filteredNotifications = notifications.filter(n => typeFilter === 'all' || n.type === typeFilter);
  const unreadCount = notifications.filter(n => !n.read).length;

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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Notifications</h1>
          <p className="text-sm text-neutral-500 mt-1">Send targeted alerts and updates to your clients.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Send Notification
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Sent</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{notifications.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Unread</div>
          <div className="text-2xl font-bold text-primary-700 mt-1">{unreadCount}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Clients</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{clients.length}</div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${typeFilter === 'all' ? 'bg-primary text-white' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'}`}
        >
          All
        </button>
        {Object.keys(typeLabels).map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${typeFilter === t ? 'bg-primary text-white' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'}`}
          >
            {typeLabels[t]}
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">LOADING NOTIFICATIONS...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No notifications found</h3>
            <p className="text-xs text-neutral-400 mt-1">Send your first notification to a client.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Notification</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Sent</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredNotifications.map(item => (
                  <tr key={item.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className={`font-semibold ${item.read ? 'text-neutral-900' : 'text-neutral-900'}`}>{item.title}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[240px]">{item.message}</div>
                    </td>
                    <td className="py-4 px-6">
                      {item.client ? (
                        <div>
                          <div className="text-neutral-800 font-medium">{item.client.name}</div>
                          <div className="text-[10px] text-neutral-400">{item.client.email}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${typeColors[item.type] || typeColors.general}`}>
                        {typeLabels[item.type] || item.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.read ? 'bg-neutral-100 text-neutral-500 border-neutral-200' : 'bg-accent-50 text-accent-700 border-accent-200'}`}>
                        {item.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-neutral-500">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(item)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-neutral-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">Send Notification</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-neutral-400 hover:text-primary rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSend} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Recipient Client</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    {Object.keys(typeLabels).map(t => (
                      <option key={t} value={t}>{typeLabels[t]}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Deep Link (optional)</label>
                  <input
                    type="text"
                    placeholder="/client/reports"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New report available"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Notification body..."
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary resize-none"
                />
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Notification
                    </>
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