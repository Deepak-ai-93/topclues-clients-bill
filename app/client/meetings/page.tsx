'use client';

import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, ExternalLink, CheckCircle, Plus, Send } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed';
  participants: string[];
  meetLink?: string;
  agenda?: string;
  notes?: string;
}

const demoMeetings: Meeting[] = [
  {
    id: "m1",
    title: "Monthly Performance Review — August 2026",
    date: "15 August 2026",
    time: "11:00 AM",
    type: "Review",
    status: "scheduled",
    participants: ["Dr. Rajesh Sharma", "Rahul Mehta (Account Manager)"],
    meetLink: "https://meet.google.com/abc-defg-hij",
    agenda: "Review July performance, plan August campaigns, discuss content calendar."
  },
  {
    id: "m2",
    title: "Campaign Strategy Session",
    date: "5 August 2026",
    time: "03:00 PM",
    type: "Strategy",
    status: "scheduled",
    participants: ["Dr. Rajesh Sharma", "Priya Sharma (Campaign Manager)"],
    meetLink: "https://meet.google.com/xyz-abcd-efg",
    agenda: "Discuss Q3 ad strategy, budget allocation, festival campaign planning."
  },
  {
    id: "m3",
    title: "July Monthly Review",
    date: "18 July 2026",
    time: "11:00 AM",
    type: "Review",
    status: "completed",
    participants: ["Dr. Rajesh Sharma", "Rahul Mehta"],
    meetLink: "",
    agenda: "",
    notes: "Reviewed June performance. Targets: increase leads by 20%, launch 2 reels."
  }
];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(demoMeetings);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Request form state
  const [reqSubject, setReqSubject] = useState('');
  const [reqDate, setReqDate] = useState('');
  const [reqTime, setReqTime] = useState('');
  const [reqNotes, setReqNotes] = useState('');

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Meeting request submitted! Your account manager will send an invite shortly.");
    setReqSubject('');
    setReqDate('');
    setReqTime('');
    setReqNotes('');
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled');
  const pastMeetings = meetings.filter(m => m.status === 'completed');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-primary text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border border-primary-800">
          <CheckCircle className="w-4 h-4 text-accent-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Meetings & Strategy Calls</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">Schedule and join video reviews with your dedicated Topclues marketing team.</p>
      </div>

      {/* Upcoming Meetings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-black" /> Upcoming Scheduled Meetings
          </h2>
          <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300 font-bold">
            {upcomingMeetings.length} UPCOMING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingMeetings.map((m) => (
            <div key={m.id} className="border-2 border-primary p-6 rounded-xl bg-white space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 bg-primary text-white rounded">
                    {m.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-accent-700 bg-accent-50 px-2 py-0.5 rounded border border-accent-200">
                    CONFIRMED
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 leading-snug">{m.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 pt-1">
                  <span className="flex items-center gap-1.5 font-bold text-black">
                    <Calendar className="w-4 h-4 text-neutral-500" /> {m.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-black">
                    <Clock className="w-4 h-4 text-neutral-500" /> {m.time}
                  </span>
                </div>

                {m.agenda && (
                  <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <strong className="font-mono text-[10px] block text-neutral-500 uppercase">Agenda:</strong>
                    {m.agenda}
                  </p>
                )}

                {/* Participants */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1.5 font-bold">Participants:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.participants.map(p => (
                      <span key={p} className="text-[11px] font-mono px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded-md text-neutral-800">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row gap-2">
                {m.meetLink && (
                  <a
                    href={m.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-primary hover:bg-primary text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Video className="w-4 h-4" /> Join Google Meet
                  </a>
                )}
                <button
                  onClick={() => triggerToast(`Calendar invite copied for ${m.title}`)}
                  className="px-3.5 py-2.5 border border-primary hover:bg-neutral-100 text-neutral-900 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900">Past Meeting Archive</h2>
          <div className="border border-primary rounded-xl bg-white divide-y divide-neutral-200 overflow-hidden">
            {pastMeetings.map(m => (
              <div key={m.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded">
                      {m.type}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900">{m.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-neutral-500 block">{m.date} &bull; {m.time}</span>
                  {m.notes && (
                    <p className="text-xs text-neutral-600 mt-1 font-sans italic">
                      Notes: "{m.notes}"
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-accent-700 bg-accent-100 border border-accent-300 px-2.5 py-1 rounded self-start sm:self-auto">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request a Meeting Form Card */}
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
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-700 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Submit Meeting Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
