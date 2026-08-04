'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminReviewsData,
  updateReviewStatus
} from '../../../lib/actions';
import {
  Star,
  CheckCircle,
  AlertCircle,
  Filter,
  MessageSquareQuote,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface Review {
  id: string;
  client_id: string;
  rating: number;
  title: string;
  review: string;
  source: string;
  status: string;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

const statusColors: Record<string, string> = {
  approved: 'bg-accent-50 text-accent-700 border-accent-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200'
};

const statusLabels: Record<string, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected'
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminReviewsData();
      setReviews(data.reviews as Review[]);
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

  const handleStatusChange = async (reviewId: string, status: string) => {
    const res = await updateReviewStatus(reviewId, status);
    if (res.success) {
      loadData();
      triggerToast('Review status updated.');
    } else {
      triggerToast(res.error || 'Failed to update status.', true);
    }
  };

  const filteredReviews = reviews.filter(r => statusFilter === 'all' || r.status === statusFilter);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';
  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;

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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Reviews & Feedback</h1>
          <p className="text-sm text-neutral-500 mt-1">Moderate patient testimonials submitted through the client portal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Reviews</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{reviews.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Average Rating</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1 flex items-center gap-2">
            {avgRating}
            <span className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-4 h-4 ${i <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
              ))}
            </span>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Pending Moderation</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</div>
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">LOADING REVIEWS...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquareQuote className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No reviews found</h3>
            <p className="text-xs text-neutral-400 mt-1">Patient reviews will appear here once submitted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Review</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Rating</th>
                  <th className="py-3.5 px-6">Source</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredReviews.map(review => (
                  <tr key={review.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-neutral-900">{review.title || 'Untitled review'}</div>
                      <div className="text-[10px] text-neutral-400 line-clamp-2 max-w-[280px]">{review.review}</div>
                    </td>
                    <td className="py-4 px-6">
                      {review.client ? (
                        <div>
                          <div className="text-neutral-800 font-medium">{review.client.name}</div>
                          <div className="text-[10px] text-neutral-400">{review.client.email}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i <= (review.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                        ))}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-neutral-600 capitalize">
                        {review.source === 'external' ? <ExternalLink className="w-3 h-3 text-neutral-400" /> : <ShieldCheck className="w-3 h-3 text-neutral-400" />}
                        {review.source || 'portal'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={review.status}
                        onChange={(e) => handleStatusChange(review.id, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border appearance-none cursor-pointer ${statusColors[review.status] || statusColors.pending}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-neutral-500">
                      {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}