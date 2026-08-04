'use client';

import React, { useState, useEffect } from 'react';
import { Tag, CheckCircle, Clock, AlertTriangle, Check, ArrowRight, PartyPopper } from 'lucide-react';
import { getClientOffers, claimOffer } from '../../../lib/actions';

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
}

interface Claim {
  id: string;
  offer_id: string;
  status: string;
  created_at: string;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const isExpiring = (validUntil: string | null) =>
  validUntil && new Date(validUntil).getTime() - Date.now() < 15 * 24 * 60 * 60 * 1000 && new Date(validUntil) >= new Date();

const isExpired = (validUntil: string | null) =>
  validUntil && new Date(validUntil) < new Date();

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Ongoing';

export default function SpecialOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [claims, setClaims] = useState<Record<string, Claim>>({});
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientOffers();
        setOffers(data.offers as Offer[]);
        const claimMap: Record<string, Claim> = {};
        (data.claims as Claim[] || []).forEach(c => {
          if (!claimMap[c.offer_id]) claimMap[c.offer_id] = c;
        });
        setClaims(claimMap);
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

  const handleClaim = async (offer: Offer) => {
    const res = await claimOffer(offer.id, '');
    if (res.success) {
      setClaims(prev => ({ ...prev, [offer.id]: { id: 'pending', offer_id: offer.id, status: 'pending', created_at: new Date().toISOString() } }));
      triggerToast(`Offer "${offer.title}" claimed! Our team will contact you shortly.`);
    } else {
      triggerToast(res.error || 'Failed to claim offer.', true);
    }
  };

  const activeOffers = offers.filter(o => o.status === 'active' && !isExpired(o.valid_until));

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
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Special Client Offers</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Exclusive discounts and package add-ons available for topclues client practices.
        </p>
      </div>

      {activeOffers.length === 0 ? (
        <div className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center space-y-3">
          <Tag className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-base font-bold text-neutral-700">No active offers right now</h3>
          <p className="text-xs text-neutral-400 font-mono">New exclusive offers will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOffers.map((offer) => {
            const claim = claims[offer.id];
            const expiring = isExpiring(offer.valid_until);
            return (
              <div
                key={offer.id}
                className="border-2 border-primary rounded-xl p-6 bg-white flex flex-col justify-between space-y-6 relative shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 justify-between">
                  {expiring ? (
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Expiring Soon
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">{offer.eligibility || 'All active clients'}</span>
                  )}
                  <span className="text-xs font-mono font-bold bg-primary text-white px-2.5 py-1 rounded">
                    SAVE {offer.discount_pct || 0}%
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-neutral-900 leading-snug">{offer.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">{offer.description}</p>
                </div>

                {offer.terms && (
                  <div className="space-y-1.5 pt-2 border-t border-neutral-200">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Terms:</span>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">{offer.terms}</p>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-black font-mono">{formatINR(offer.offer_price)}</span>
                    <span className="text-sm font-mono text-neutral-400 line-through">{formatINR(offer.price)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Valid until: {formatDate(offer.valid_until)}</span>
                  </div>

                  {claim ? (
                    <div className="w-full py-3 bg-accent-50 border border-accent-300 text-accent-800 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                      <PartyPopper className="w-4 h-4" />
                      {claim.status === 'approved' ? 'Claim Approved!' : claim.status === 'rejected' ? 'Claim Declined' : 'Claim Pending — We\'ll contact you'}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleClaim(offer)}
                      className="w-full py-3 bg-primary hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      Claim This Offer <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}