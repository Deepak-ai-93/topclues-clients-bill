'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminOffersData,
  createOffer,
  updateOfferStatus,
  deleteOffer
} from '../../../lib/actions';
import {
  Plus,
  Trash2,
  Tag,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  IndianRupee,
  Percent,
  Filter
} from 'lucide-react';

interface ClientEntry {
  id: string;
  name: string;
  email: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  offer_price: number;
  discount_pct: number;
  valid_until: string | null;
  eligibility: string;
  terms: string;
  status: string;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

const statusColors: Record<string, string> = {
  active: 'bg-accent-50 text-accent-700 border-accent-200',
  inactive: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  claimed: 'bg-primary-50 text-primary-700 border-primary-200'
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  claimed: 'Claimed'
};

const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function AdminOffersPage() {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [eligibility, setEligibility] = useState('All new patients');
  const [terms, setTerms] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminOffersData();
      setClients(data.clients || []);
      setOffers(data.offers as Offer[]);
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
    setDescription('');
    setPrice('');
    setOfferPrice('');
    setValidUntil('');
    setEligibility('All new patients');
    setTerms('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !offerPrice) {
      triggerToast('Title, price and offer price are required.', true);
      return;
    }
    setSaving(true);
    try {
      const res = await createOffer({
        clientId: selectedClientId,
        title,
        description,
        price,
        offerPrice,
        validUntil,
        eligibility,
        terms
      });
      if (res.success) {
        loadData();
        setShowModal(false);
        triggerToast('Offer created.');
      } else {
        triggerToast(res.error || 'Failed to create offer.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (offerId: string, status: string) => {
    const res = await updateOfferStatus(offerId, status);
    if (res.success) {
      loadData();
      triggerToast('Offer status updated.');
    } else {
      triggerToast(res.error || 'Failed to update status.', true);
    }
  };

  const handleDelete = async (offer: Offer) => {
    if (!confirm(`Delete offer "${offer.title}"?`)) return;
    const res = await deleteOffer(offer.id);
    if (res.success) {
      loadData();
      triggerToast('Offer deleted.');
    } else {
      triggerToast(res.error || 'Failed to delete.', true);
    }
  };

  const filteredOffers = offers.filter(o => statusFilter === 'all' || o.status === statusFilter);

  const activeCount = offers.filter(o => o.status === 'active').length;
  const claimedCount = offers.filter(o => o.status === 'claimed').length;
  const avgDiscount = offers.length
    ? Math.round(offers.reduce((s, o) => s + (o.discount_pct || 0), 0) / offers.length)
    : 0;

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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Special Offers</h1>
          <p className="text-sm text-neutral-500 mt-1">Create and manage patient offers published on the client portal.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Offers</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{offers.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Active</div>
          <div className="text-2xl font-bold text-accent-700 mt-1">{activeCount}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Avg Discount</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{avgDiscount}%</div>
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="claimed">Claimed</option>
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">LOADING OFFERS...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="py-16 text-center">
            <Tag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No offers found</h3>
            <p className="text-xs text-neutral-400 mt-1">Create your first patient offer to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Offer</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Pricing</th>
                  <th className="py-3.5 px-6">Valid Until</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredOffers.map(offer => (
                  <tr key={offer.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-neutral-900">{offer.title}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[220px]">{offer.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      {offer.client ? (
                        <div>
                          <div className="text-neutral-800 font-medium">{offer.client.name}</div>
                          <div className="text-[10px] text-neutral-400">{offer.client.email}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-neutral-900">{formatINR(offer.offer_price)}</span>
                        <span className="text-neutral-400 line-through">{formatINR(offer.price)}</span>
                        {offer.discount_pct > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-accent-700 bg-accent-50 border border-accent-200 rounded-full px-1.5 py-0.5">
                            <Percent className="w-2.5 h-2.5" />
                            {offer.discount_pct}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {offer.valid_until ? (
                        <span className="inline-flex items-center gap-1 text-neutral-600">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {new Date(offer.valid_until).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={offer.status}
                        onChange={(e) => handleStatusChange(offer.id, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border appearance-none cursor-pointer ${statusColors[offer.status] || statusColors.inactive}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="claimed">Claimed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(offer)}
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
              <h2 className="text-sm font-semibold text-neutral-900">Create New Offer</h2>
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
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Offer Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% Off First Consultation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Offer details shown to patients..."
                  rows={2}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Original Price (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="2000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Offer Price (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="1600"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Valid Until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Eligibility</label>
                <input
                  type="text"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. All new patients"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Terms</label>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Terms and conditions..."
                  rows={2}
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
                  ) : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}