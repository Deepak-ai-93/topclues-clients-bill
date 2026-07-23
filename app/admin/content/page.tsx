'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminContentData,
  createContentEntry,
  updateContentEntry,
  deleteContentEntry,
  downloadContentAsset
} from '../../../lib/actions';
import {
  Search,
  Plus,
  Trash2,
  Calendar,
  User,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Edit3,
  Globe,
  UploadCloud,
  Download
} from 'lucide-react';

interface ClientEntry {
  id: string;
  name: string;
  email: string;
}

interface ContentEntry {
  id: string;
  title: string;
  description: string;
  platform: string;
  publish_date: string;
  status: string;
  asset_url: string;
  asset_name: string;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

const platformLabels: Record<string, string> = {
  social: 'Social Media',
  blog: 'Blog',
  email: 'Email',
  video: 'Video',
  other: 'Other'
};

const platformColors: Record<string, string> = {
  social: 'bg-sky-50 text-sky-700 border-sky-200',
  blog: 'bg-amber-50 text-amber-700 border-amber-200',
  email: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  video: 'bg-rose-50 text-rose-700 border-rose-200',
  other: 'bg-neutral-50 text-neutral-700 border-neutral-200'
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published'
};

const statusColors: Record<string, string> = {
  draft: 'bg-neutral-100 text-neutral-600 border-neutral-300',
  scheduled: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

export default function AdminContentPage() {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ContentEntry | null>(null);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryDescription, setEntryDescription] = useState('');
  const [entryPlatform, setEntryPlatform] = useState('social');
  const [entryPublishDate, setEntryPublishDate] = useState('');
  const [entryStatus, setEntryStatus] = useState('draft');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminContentData();
      setClients(data.clients || []);
      setEntries(data.entries as ContentEntry[]);
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
    setEditingEntry(null);
    setSelectedClientId(clients[0]?.id || '');
    setEntryTitle('');
    setEntryDescription('');
    setEntryPlatform('social');
    setEntryPublishDate(new Date().toISOString().slice(0, 10));
    setEntryStatus('draft');
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleOpenEdit = (entry: ContentEntry) => {
    setEditingEntry(entry);
    setSelectedClientId('');
    setEntryTitle(entry.title);
    setEntryDescription(entry.description);
    setEntryPlatform(entry.platform);
    setEntryPublishDate(entry.publish_date);
    setEntryStatus(entry.status);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle || !entryPublishDate) {
      triggerToast('Please fill in required fields.', true);
      return;
    }

    setSaving(true);
    try {
      const readAndSave = async (action: Function, ...args: any[]) => {
        if (selectedFile) {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64String = reader.result as string;
            const res = await action(...args, {
              pdfBase64: base64String,
              pdfName: selectedFile.name
            });
            if (res.success) {
              loadData();
              setShowModal(false);
              triggerToast(editingEntry ? 'Content entry updated.' : 'Content entry created.');
            } else {
              triggerToast(res.error || 'Operation failed.', true);
            }
            setSaving(false);
          };
          reader.readAsDataURL(selectedFile);
        } else {
          const res = await action(...args, {});
          if (res.success) {
            loadData();
            setShowModal(false);
            triggerToast(editingEntry ? 'Content entry updated.' : 'Content entry created.');
          } else {
            triggerToast(res.error || 'Operation failed.', true);
          }
          setSaving(false);
        }
      };

      if (editingEntry) {
        await readAndSave(updateContentEntry, editingEntry.id, {
          title: entryTitle,
          description: entryDescription,
          platform: entryPlatform,
          publishDate: entryPublishDate,
          status: entryStatus
        });
      } else {
        if (!selectedClientId) {
          triggerToast('Please select a client.', true);
          setSaving(false);
          return;
        }
        await readAndSave(createContentEntry, {
          clientId: selectedClientId,
          title: entryTitle,
          description: entryDescription,
          platform: entryPlatform,
          publishDate: entryPublishDate,
          status: entryStatus
        });
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
      setSaving(false);
    }
  };

  const handleDownload = async (entryId: string) => {
    try {
      const res = await downloadContentAsset(entryId);
      if (res.success && res.url) {
        window.open(res.url, '_blank');
      } else {
        triggerToast(res.error || 'Failed to download.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleDelete = async (entryId: string, title: string) => {
    if (!confirm(`Permanently delete content "${title}"?`)) return;
    try {
      const res = await deleteContentEntry(entryId);
      if (res.success) {
        loadData();
        triggerToast('Content entry deleted.');
      } else {
        triggerToast(res.error || 'Failed to delete.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.client && e.client.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Content Calendar</h1>
          <p className="text-sm text-neutral-500 mt-1">Schedule and manage published assets across platforms for your clients.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-950 text-white hover:bg-neutral-800 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black appearance-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">LOADING CONTENT CALENDAR...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No content entries yet</h3>
            <p className="text-xs text-neutral-400 mt-1">Create your first content calendar entry to start scheduling published assets.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Platform</th>
                  <th className="py-3.5 px-6">Publish Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">File</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <div>{entry.title}</div>
                          {entry.description && (
                            <div className="text-[10px] text-neutral-400 font-normal truncate max-w-[200px]">{entry.description}</div>
                          )}
                        </div>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {entry.client ? (
                        <div>
                          <div className="font-semibold text-neutral-800">{entry.client.name}</div>
                          <div className="text-[10px] text-neutral-400">{entry.client.email}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">Deleted Client</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformColors[entry.platform] || platformColors.other}`}>
                        {platformLabels[entry.platform] || entry.platform}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-neutral-600">{entry.publish_date}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[entry.status] || statusColors.draft}`}>
                        {statusLabels[entry.status] || entry.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {entry.asset_url ? (
                        <button
                          onClick={() => handleDownload(entry.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[10px] font-semibold text-neutral-700 transition-all cursor-pointer"
                          title="Download asset"
                        >
                          <Download className="w-3 h-3" />
                          {entry.asset_name || 'Download'}
                        </button>
                      ) : (
                        <span className="text-neutral-300 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(entry)}
                          className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id, entry.title)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
              <h2 className="text-sm font-semibold text-neutral-900">
                {editingEntry ? 'Edit Content Entry' : 'New Content Entry'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

              {!editingEntry && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Assign Client</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <select
                      required
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black appearance-none cursor-pointer"
                    >
                      {clients.length === 0 && <option value="">No clients registered</option>}
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Title</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. July Newsletter"
                    value={entryTitle}
                    onChange={(e) => setEntryTitle(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Description</label>
                <textarea
                  value={entryDescription}
                  onChange={(e) => setEntryDescription(e.target.value)}
                  placeholder="Brief description of the content asset..."
                  rows={2}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Platform</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <select
                      required
                      value={entryPlatform}
                      onChange={(e) => setEntryPlatform(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black appearance-none cursor-pointer"
                    >
                      <option value="social">Social Media</option>
                      <option value="blog">Blog</option>
                      <option value="email">Email</option>
                      <option value="video">Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Status</label>
                  <select
                    required
                    value={entryStatus}
                    onChange={(e) => setEntryStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black appearance-none cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Publish Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="date"
                    required
                    value={entryPublishDate}
                    onChange={(e) => setEntryPublishDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Asset File (PDF / Doc)</label>
                <div className="border border-dashed border-neutral-200 bg-neutral-50 rounded-lg p-3 text-center cursor-pointer hover:bg-neutral-100/50 transition-all relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-neutral-700">
                    {selectedFile ? selectedFile.name : 'Click to upload asset file'}
                  </p>
                  <p className="text-[9px] text-neutral-400 mt-0.5">PDF or Document</p>
                </div>
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
                  className="flex-1 py-2 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingEntry ? 'Update Entry' : 'Create Entry'
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
