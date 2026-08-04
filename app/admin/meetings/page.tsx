'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminMeetingsData,
  createMeeting,
  updateMeetingStatus,
  deleteMeeting
} from '../../../lib/actions';
import {
  Plus,
  Trash2,
  Video,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Link2,
  Filter
} from 'lucide-react';

interface ClientEntry {
  id: string;
  name: string;
  email: string;
}

interface Meeting {
  id: string;
  client_id: string;
  title: string;
  meeting_date: string;
  meeting_type: string;
  link: string;
  agenda: string;
  status: string;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-primary-50 text-primary-700 border-primary-200',
  completed: 'bg-accent-50 text-accent-700 border-accent-200',
  cancelled: 'bg-neutral-100 text-neutral-600 border-neutral-200'
};

const typeColors: Record<string, string> = {
  'video call': 'bg-violet-50 text-violet-700 border-violet-200',
  'phone call': 'bg-amber-50 text-amber-700 border-amber-200',
  'in-person': 'bg-teal-50 text-teal-700 border-teal-200'
};

export default function AdminMeetingsPage() {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [title, setTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingType, setMeetingType] = useState('video call');
  const [link, setLink] = useState('');
  const [agenda, setAgenda] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminMeetingsData();
      setClients(data.clients || []);
      setMeetings(data.meetings as Meeting[]);
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
    setMeetingDate('');
    setMeetingType('video call');
    setLink('');
    setAgenda('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !meetingDate) {
      triggerToast('Title and meeting date are required.', true);
      return;
    }
    setSaving(true);
    try {
      const res = await createMeeting({
        clientId: selectedClientId,
        title,
        meetingDate,
        meetingType,
        link,
        agenda
      });
      if (res.success) {
        loadData();
        setShowModal(false);
        triggerToast('Meeting scheduled.');
      } else {
        triggerToast(res.error || 'Failed to schedule meeting.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (meetingId: string, status: string) => {
    const res = await updateMeetingStatus(meetingId, status);
    if (res.success) {
      loadData();
      triggerToast('Meeting status updated.');
    } else {
      triggerToast(res.error || 'Failed to update status.', true);
    }
  };

  const handleDelete = async (meeting: Meeting) => {
    if (!confirm(`Delete meeting "${meeting.title}"?`)) return;
    const res = await deleteMeeting(meeting.id);
    if (res.success) {
      loadData();
      triggerToast('Meeting deleted.');
    } else {
      triggerToast(res.error || 'Failed to delete.', true);
    }
  };

  const filteredMeetings = meetings.filter(m => statusFilter === 'all' || m.status === statusFilter);

  const scheduledCount = meetings.filter(m => m.status === 'scheduled').length;
  const completedCount = meetings.filter(m => m.status === 'completed').length;

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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Meetings</h1>
          <p className="text-sm text-neutral-500 mt-1">Schedule calls and video meetings with your clients.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Meetings</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{meetings.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Scheduled</div>
          <div className="text-2xl font-bold text-primary-700 mt-1">{scheduledCount}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Completed</div>
          <div className="text-2xl font-bold text-accent-700 mt-1">{completedCount}</div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex items-center gap-2 w-full sm:w-auto">
        <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">LOADING MEETINGS...</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="py-16 text-center">
            <Video className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No meetings found</h3>
            <p className="text-xs text-neutral-400 mt-1">Schedule your first client meeting to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Meeting</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredMeetings.map(meeting => (
                  <tr key={meeting.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-neutral-900">{meeting.title}</div>
                      {meeting.agenda && (
                        <div className="text-[10px] text-neutral-400 truncate max-w-[200px]">{meeting.agenda}</div>
                      )}
                      {meeting.link && (
                        <a
                          href={meeting.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary mt-1 hover:underline"
                        >
                          <Link2 className="w-2.5 h-2.5" />
                          Join link
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {meeting.client ? (
                        <div>
                          <div className="text-neutral-800 font-medium">{meeting.client.name}</div>
                          <div className="text-[10px] text-neutral-400">{meeting.client.email}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 text-neutral-700">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        {new Date(meeting.meeting_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-neutral-400 ml-3">
                        <Clock className="w-3 h-3" />
                        {new Date(meeting.meeting_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${typeColors[meeting.meeting_type] || typeColors['video call']}`}>
                        {meeting.meeting_type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={meeting.status}
                        onChange={(e) => handleStatusChange(meeting.id, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border appearance-none cursor-pointer capitalize ${statusColors[meeting.status] || statusColors.scheduled}`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(meeting)}
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
              <h2 className="text-sm font-semibold text-neutral-900">Schedule New Meeting</h2>
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
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly performance review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Meeting Type</label>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="video call">Video Call</option>
                    <option value="phone call">Phone Call</option>
                    <option value="in-person">In Person</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Meeting Link</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Agenda</label>
                <textarea
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="Topics to discuss..."
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
                      Saving...
                    </>
                  ) : 'Schedule Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}