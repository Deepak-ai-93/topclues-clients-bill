'use client';

import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle, AlertCircle, ExternalLink, MessageSquare } from 'lucide-react';
import { getClientReviews, submitClientReview } from '../../../lib/actions';

interface Review {
  id: string;
  rating: number;
  title: string;
  message: string;
  service: string;
  publish_consent: boolean;
  status: string;
  created_at: string;
}

const services = [
  'Content quality',
  'Communication',
  'Reporting',
  'Lead quality',
  'Video production',
  'Timeliness',
  'Overall experience',
];

const externalLinks = [
  { label: 'Google Review', href: 'https://www.google.com/search?q=topclues+solutions' },
  { label: 'Facebook Review', href: 'https://www.facebook.com/topclues' },
  { label: 'Website Testimonial', href: 'https://topclues.in' },
];

export default function ClientReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [service, setService] = useState(services[0]);
  const [publishConsent, setPublishConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientReviews();
        setReviews(data.reviews as Review[]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitClientReview({ rating, title, message, service, publishConsent });
      if (res.success) {
        triggerToast('Thank you! Your feedback has been submitted.');
        setRating(0);
        setTitle('');
        setMessage('');
        setPublishConsent(false);
        const data = await getClientReviews();
        setReviews(data.reviews as Review[]);
      } else {
        triggerToast(res.error || 'Failed to submit feedback.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Reviews & Feedback</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">Share your experience with Topclues and publish a review.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback form */}
        <form onSubmit={handleSubmit} className="border-2 border-primary p-6 rounded-xl bg-white space-y-5 h-fit">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-3">Service Feedback</h2>

          <div>
            <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-2">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-mono text-neutral-500">
                {rating ? `${rating} / 5` : 'Select rating'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Service Area</label>
            <select
              value={service}
              onChange={e => setService(e.target.value)}
              className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold bg-white"
            >
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Short headline for your feedback"
              className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">Your Feedback</label>
            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              placeholder="Tell us about your experience..."
              className="w-full p-2.5 border border-primary rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <label className="flex items-start gap-2.5 p-3 border border-neutral-200 rounded-lg bg-neutral-50 cursor-pointer">
            <input
              type="checkbox"
              checked={publishConsent}
              onChange={e => setPublishConsent(e.target.checked)}
              className="mt-0.5 accent-primary"
            />
            <span className="text-[11px] text-neutral-600">
              I consent to Topclues publishing this feedback as a public testimonial. I understand I can revoke this at any time.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full py-3 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        <div className="space-y-6">
          {/* External review shortcuts */}
          <div className="border border-primary p-6 rounded-xl bg-white space-y-4">
            <h2 className="text-base font-bold text-neutral-900">Leave a Public Review</h2>
            <p className="text-xs text-neutral-500">Loved working with us? Your review helps other doctors discover Topclues.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {externalLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-primary rounded-lg text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  {link.label} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Feedback history */}
          <div className="border border-primary p-6 rounded-xl bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">Your Feedback History</h2>
              <span className="text-[10px] font-mono bg-neutral-100 px-2 py-1 rounded border border-neutral-300">{reviews.length} SUBMITTED</span>
            </div>
            {reviews.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-neutral-300 rounded-lg">
                <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-mono">No feedback submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="p-4 border border-neutral-200 rounded-lg bg-neutral-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-3.5 h-3.5 ${star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                        ))}
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        r.status === 'published' ? 'bg-accent-100 text-accent-800 border-accent-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-2">{r.title || 'Untitled'}</h4>
                    <p className="text-xs text-neutral-600 mt-1">{r.message}</p>
                    <div className="text-[10px] font-mono text-neutral-400 mt-2">
                      {r.service} • {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}