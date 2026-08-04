'use client';

import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, ExternalLink, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { getClientMeetings, createClientTicket } from '../../../lib/actions';

interface Meeting {
  id: string;
  title: string;
  meeting_date: string;
  meeting_type: string;
  link: string;
  agenda: string;
  notes: string;
  status: string;
  created_at: string;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [reqSubject, setReqSubject] = useState('');
  const [reqDate, setReqDate] = useState('');
  const [reqTime, setReqTime] = useState('');
  const [reqNotes, setReqNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientMeetings();
        setMeetings(data.meetings as Meeting[]);
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

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createClientTicket({
        subject: `Meeting Request: ${reqSubject}`,
        category: 'Other',
        priority: 'normal',
        message: `Preferred date: ${reqDate} at ${reqTime}.\n\n${reqNotes}`,
      });
      if (res.success) {
        triggerToast('Meeting request submitted! Your account manager will send an invite shortly.');
        setReqSubject('');
        setReqDate('');
        setReqTime('');
        setReqNotes('');
      } else {
        triggerToast(res.error || 'Failed to submit request.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming' || m.status === 'rescheduled');
  const pastMeetings = meetings.filter(m => m.status === 'completed' || m.status === 'cancelled');

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Meetings & Strategy Calls</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">Schedule and join video reviews with your dedicated Topclues marketing team.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-black" /> Upcoming Scheduled Meetings
          </h2>
          <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300 font-bold">
            {upcomingMeetings.length} UPCOMING
          </span>
        </div>

        {upcomingMeetings.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-neutral-300 rounded-xl">
            <p className="text-xs text-neutral-400 font-mono">No upcoming meetings scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingMeetings.map((m) => (
              <div key={m.id} className="border-2 border-primary p-6 rounded-xl bg-white space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 bg-primary text-white rounded">
                      {m.meeting_type}
                    </span>
                    <span className="text-xs font-mono font-bold text-accent-700 bg-accent-50 px-2 py-0.5 rounded border border-accent-200">
                      {m.status === 'rescheduled' ? 'RESCHEDULED' : 'CONFIRMED'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 leading-snug">{m.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 pt-1">
                    <span className="flex items-center gap-1.5 font-bold text-black">
                      <Calendar className="w-4 h-4 text-neutral-500" /> {formatDate(m.meeting_date)}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-black">
                      <Clock className="w-4 h-4 text-neutral-500" /> {formatTime(m.meeting_date)}
                    </span>
                  </div>

                  {m.agenda && (
                    <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      <strong className="font-mono text-[10px] block text-neutral-500 uppercase">Agenda:</strong>
                      {m.agenda}
                    </p>
                  )}
                </div>

                {m.link && (
                  <div className="pt-4 border-t border-neutral-200">
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-primary hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" /> Join Google Meet
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {pastMeetings.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900">Past Meeting Archive</h2>
          <div className="border border-primary rounded-xl bg-white divide-y divide-neutral-200 overflow-hidden">
            {pastMeetings.map(m => (
              <div key={m.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded">
                      {m.meeting_type}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900">{m.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-neutral-500 block">{formatDate(m.meeting_date)} &bull; {formatTime(m.meeting_date)}</span>
                  {m.notes && (
                    <p className="text-xs text-neutral-600 mt-1 font-sans italic">
                      Notes: &quot;{m.notes}&quot;
                    </p>
                  )}
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded self-start sm:self-auto border ${
                  m.status === 'completed' ? 'text-accent-700 bg-accent-100 border-accent-300' : 'text-neutral-500 bg-neutral-100 border-neutral-300'
                }`}>
                  {m.status === 'completed' ? 'Completed' : 'Cancelled'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-2 border-primary p-6 rounded-xl bg-white space-y-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Request a Strategy Meeting</h2>
          <p className="text-xs text-neutral-500 font-mono">Need an urgent review or strategy discussion? Submit your preferred time below.</p>
        </div>

        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Subject / Agenda Topic</label>
              <input
                type="text"
                required
                value={reqSubject}
                onChange={e => setReqSubject(e.target.value)}
                placeholder="e.g. Campaign strategy review"
                className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Preferred Date</label>
              <input
                type="date"
                required
                value={reqDate}
                onChange={e => setReqDate(e.target.value)}
                className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Preferred Time</label>
              <input
                type="text"
                required
                value={reqTime}
                onChange={e => setReqTime(e.target.value)}
                placeholder="e.g. 11:00 AM"
                className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Notes / Preparation Details</label>
            <textarea
              rows={3}
              value={reqNotes}
              onChange={e => setReqNotes(e.target.value)}
              placeholder="Any specific items you would like to cover in the call..."
              className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-700 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> {submitting ? 'Submitting...' : 'Submit Meeting Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}