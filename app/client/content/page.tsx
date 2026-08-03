'use client';

import React, { useState, useEffect } from 'react';
import { getClientContent, updateContentStatus, downloadContentAsset } from '@/lib/actions';
import { CheckSquare, Download, Check, X, MessageSquare, AlertCircle, CheckCircle, Calendar, RefreshCw } from 'lucide-react';

interface ContentEntry {
  id: string;
  title: string;
  description: string;
  platform: string;
  publish_date: string;
  status: string;
  asset_name: string;
  asset_url?: string;
  created_at: string;
}

const statusBadgeColors: Record<string, string> = {
  draft: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  pending_approval: 'bg-amber-100 text-amber-800 border-amber-300',
  approved: 'bg-blue-100 text-blue-800 border-blue-300',
  changes_requested: 'bg-rose-100 text-rose-800 border-rose-300',
  scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  published: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  changes_requested: 'Changes Requested',
  scheduled: 'Scheduled',
  published: 'Published',
};

export default function ContentApprovalPage() {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<string>('all');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal State
  const [selectedEntry, setSelectedEntry] = useState<ContentEntry | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      setLoading(true);
      const res = await getClientContent();
      setEntries((res.entries || []) as ContentEntry[]);
    } catch (err: any) {
      triggerToast(err.message || 'Failed to fetch content.', true);
    } finally {
      setLoading(false);
    }
  }

  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await updateContentStatus(id, 'published');
      if (res.success) {
        setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'published' } : e));
        triggerToast('Content approved & published successfully!');
      } else {
        triggerToast(res.error || 'Failed to update content status.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleRequestChangesClick = (entry: ContentEntry) => {
    setSelectedEntry(entry);
    setCommentText('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntry) return;

    try {
      const res = await updateContentStatus(selectedEntry.id, 'changes_requested');
      if (res.success) {
        setEntries(prev => prev.map(e => e.id === selectedEntry.id ? { ...e, status: 'changes_requested' } : e));
        triggerToast('Change request submitted to your content team.');
      } else {
        triggerToast(res.error || 'Failed to update status.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    } finally {
      setIsModalOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleDownloadAsset = async (id: string) => {
    try {
      const res = await downloadContentAsset(id);
      if (res.success && res.url) {
        window.open(res.url, '_blank');
      } else {
        triggerToast(res.error || 'Could not download asset.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const filteredEntries = entries.filter(item => {
    if (filterTab === 'all') return true;
    if (filterTab === 'pending_approval') return item.status === 'pending_approval' || item.status === 'draft';
    return item.status === filterTab;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-neutral-900 text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border border-neutral-800">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-rose-950 text-white border border-rose-900 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Hub</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-0.5">Content Approval</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Review, approve, or request revisions for social posts, reels, and articles.</p>
        </div>

        <button
          onClick={fetchContent}
          className="px-3.5 py-2 bg-white border border-black rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-neutral-100 transition-colors shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-2 overflow-x-auto">
        {[
          { key: 'all', label: 'All Content' },
          { key: 'pending_approval', label: 'Pending Approval' },
          { key: 'approved', label: 'Approved' },
          { key: 'changes_requested', label: 'Changes Requested' },
          { key: 'scheduled', label: 'Scheduled' },
          { key: 'published', label: 'Published' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterTab === tab.key
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Cards Grid */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-neutral-400">Loading content calendar...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-neutral-300 rounded-xl bg-white space-y-2">
          <CheckSquare className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-800">No Content Found</h3>
          <p className="text-xs text-neutral-400 font-mono">No entries matching filter "{filterTab}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="border-2 border-black rounded-xl p-5 bg-white flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-3">
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 bg-black text-white rounded">
                    {entry.platform}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                    statusBadgeColors[entry.status] || statusBadgeColors.draft
                  }`}>
                    {statusLabels[entry.status] || entry.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-neutral-900 leading-snug">{entry.title}</h3>

                {/* Description */}
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">{entry.description}</p>
              </div>

              {/* Footer / Meta */}
              <div className="space-y-3 pt-3 border-t border-neutral-200">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    Target Date: {entry.publish_date}
                  </span>

                  {entry.asset_name && (
                    <button
                      onClick={() => handleDownloadAsset(entry.id)}
                      className="text-xs font-bold text-black flex items-center gap-1 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" /> Asset
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleApprove(entry.id)}
                    disabled={entry.status === 'published'}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      entry.status === 'published'
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm'
                    }`}
                  >
                    <Check className="w-4 h-4" /> {entry.status === 'published' ? 'Approved' : '✓ Approve'}
                  </button>

                  <button
                    onClick={() => handleRequestChangesClick(entry)}
                    className="flex-1 py-2 px-3 border border-black hover:bg-neutral-100 text-neutral-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 text-rose-600" /> ✗ Request Changes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment / Request Changes Modal */}
      {isModalOpen && selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-black rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-black" /> Request Content Changes
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-neutral-500 font-mono">Item Title:</p>
              <p className="text-sm font-bold text-neutral-900">{selectedEntry.title}</p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1">
                  Revision Notes / Instructions:
                </label>
                <textarea
                  rows={4}
                  required
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Describe the changes needed (e.g., change caption text, update image color, adjust doctor name placement)..."
                  className="w-full p-3 border border-black rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-neutral-800"
                >
                  Submit Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
