'use client';

import React, { useState } from 'react';
import { Tag, CheckCircle, Clock, AlertTriangle, Check, ArrowRight } from 'lucide-react';

const demoOffers = [
  {
    id: "off-1",
    title: "Additional Reels Package",
    description: "Add 4 extra Instagram Reels to your current month's content plan.",
    benefits: ["4 Professional Reels", "Script Writing Included", "Priority Scheduling"],
    regularPrice: "₹8,000",
    offerPrice: "₹5,500",
    discountPct: 31,
    validUntil: "31 August 2026",
    eligibility: "All Active Clients",
    isExpiring: false
  },
  {
    id: "off-2",
    title: "Google Ads Setup — Festival Season",
    description: "Special festival season Google Ads campaign setup at discounted rates.",
    benefits: ["Campaign Setup", "Ad Creatives (5)", "14-Day Management", "Performance Report"],
    regularPrice: "₹12,000",
    offerPrice: "₹7,999",
    discountPct: 33,
    validUntil: "15 August 2026",
    eligibility: "Clinic Growth Package clients",
    isExpiring: true
  },
  {
    id: "off-3",
    title: "Annual Contract — 2 Months Free",
    description: "Switch to an annual contract and get 2 months of service completely free.",
    benefits: ["2 Months Free", "Priority Support", "Dedicated Account Manager", "Quarterly Strategy Review"],
    regularPrice: "₹1,80,000",
    offerPrice: "₹1,50,000",
    discountPct: 17,
    validUntil: "30 September 2026",
    eligibility: "All Active Clients",
    isExpiring: false
  }
];

export default function SpecialOffersPage() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleClaim = (offerTitle: string) => {
    setSuccessMsg(`Our team will contact you shortly regarding "${offerTitle}"!`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-primary text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border border-primary-800">
          <CheckCircle className="w-4 h-4 text-accent-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Special Client Offers</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Exclusive discounts and package add-ons available for topclues client practices.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoOffers.map((offer) => (
          <div
            key={offer.id}
            className="border-2 border-primary rounded-xl p-6 bg-white flex flex-col justify-between space-y-6 relative shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Badges top right */}
            <div className="flex items-center gap-2 justify-between">
              {offer.isExpiring ? (
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Expiring Soon
                </span>
              ) : (
                <span className="text-[10px] font-mono text-neutral-500 uppercase">{offer.eligibility}</span>
              )}
              <span className="text-xs font-mono font-bold bg-primary text-white px-2.5 py-1 rounded">
                SAVE {offer.discountPct}%
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-900 leading-snug">{offer.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">{offer.description}</p>
            </div>

            {/* Benefits List */}
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">What's Included:</span>
              <ul className="space-y-1.5">
                {offer.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                    <Check className="w-3.5 h-3.5 text-accent-600 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing & Expiry */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-black font-mono">{offer.offerPrice}</span>
                <span className="text-sm font-mono text-neutral-400 line-through">{offer.regularPrice}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Valid until: {offer.validUntil}</span>
              </div>

              <button
                onClick={() => handleClaim(offer.title)}
                className="w-full py-3 bg-primary hover:bg-primary text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                Claim This Offer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
