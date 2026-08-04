'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckSquare, ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { getClientContent } from '../../../lib/actions';

interface ContentEntry {
  id: string;
  title: string;
  description: string;
  platform: string;
  content_type: string;
  publish_date: string;
  status: string;
  published_url: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  draft: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  internal_review: 'bg-primary-100 text-primary-800 border-primary-300',
  pending_approval: 'bg-amber-100 text-amber-800 border-amber-300',
  approved: 'bg-accent-100 text-accent-800 border-accent-300',
  changes_requested: 'bg-rose-100 text-rose-800 border-rose-300',
  scheduled: 'bg-primary-100 text-primary-800 border-primary-300',
  published: 'bg-accent-100 text-accent-800 border-accent-300',
  archived: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ClientCalendarPage() {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'list'>('month');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientContent();
        setEntries(data.entries as ContentEntry[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const firstDay = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const entriesOn = (day: number) => entries.filter(e => {
    const d = new Date(e.publish_date);
    return d.getFullYear() === cursor.year && d.getMonth() === cursor.month && d.getDate() === day;
  });

  const filteredList = entries
    .filter(e => platformFilter === 'all' || e.platform === platformFilter)
    .filter(e => statusFilter === 'all' || e.status === statusFilter)
    .sort((a, b) => new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime());

  const moveMonth = (delta: number) => {
    setCursor(prev => {
      let m = prev.month + delta;
      let y = prev.year;
      if (m < 0) { m = 11; y -= 1; }
      if (m > 11) { m = 0; y += 1; }
      return { year: y, month: m };
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Content Calendar</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Your planned, approved and published content across platforms.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-primary rounded-lg p-1">
          <button onClick={() => setView('month')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${view === 'month' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>
            Month
          </button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>
            List
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} className="p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white">
          <option value="all">All Platforms</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
          <option value="linkedin">LinkedIn</option>
          <option value="google_business">Google Business</option>
          <option value="x">X</option>
          <option value="blog">Blog</option>
          <option value="social">Social</option>
          <option value="other">Other</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white">
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="internal_review">Internal Review</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="changes_requested">Changes Requested</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {view === 'month' ? (
        <div className="border border-primary rounded-xl bg-white overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <button onClick={() => moveMonth(-1)} className="p-2 rounded-lg hover:bg-neutral-100"><ChevronLeft className="w-4 h-4" /></button>
            <h2 className="text-base font-bold text-neutral-900">{MONTHS[cursor.month]} {cursor.year}</h2>
            <button onClick={() => moveMonth(1)} className="p-2 rounded-lg hover:bg-neutral-100"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-neutral-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-white p-2 text-center text-[10px] font-mono font-bold text-neutral-500 uppercase">{day}</div>
            ))}
            {cells.map((day, i) => (
              <div key={i} className={`bg-white min-h-[80px] p-2 ${day === null ? '' : 'hover:bg-neutral-50 transition-colors'}`}>
                {day !== null && (
                  <>
                    <div className="text-[11px] font-mono font-bold text-neutral-600 mb-1">{day}</div>
                    <div className="space-y-1">
                      {entriesOn(day).slice(0, 3).map(e => (
                        <Link
                          key={e.id}
                          href="/client/content"
                          className="block text-[9px] font-semibold px-1.5 py-0.5 rounded border truncate"
                          style={{ borderColor: '#356cb033', backgroundColor: '#356cb00d', color: '#356cb0' }}
                        >
                          {e.title}
                        </Link>
                      ))}
                      {entriesOn(day).length > 3 && (
                        <div className="text-[9px] font-mono text-neutral-400 px-1">+{entriesOn(day).length - 3} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-primary rounded-xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary bg-neutral-50 text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Content</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs font-sans">
                {filteredList.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-neutral-400 font-mono">No content items match your filters.</td></tr>
                ) : filteredList.map(e => (
                  <tr key={e.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-neutral-600">{e.publish_date}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">{e.title}</div>
                      <div className="text-[10px] text-neutral-400 font-mono truncate max-w-[260px]">{e.description}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-primary text-white rounded font-bold uppercase">{e.platform.replace('_', ' ')}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">{e.content_type || 'post'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${statusColors[e.status] || statusColors.draft}`}>
                        {e.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {e.published_url ? (
                        <a href={e.published_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link href="/client/content" className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 hover:text-primary">
                          <CheckSquare className="w-3.5 h-3.5" /> Manage
                        </Link>
                      )}
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