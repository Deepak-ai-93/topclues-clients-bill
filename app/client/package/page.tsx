'use client';

import React from 'react';
import { Package, CheckCircle, Clock, User, Calendar, CreditCard, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const packageInfo = {
  name: "Specialist Growth Package",
  status: "active",
  startDate: "1 July 2026",
  endDate: "30 June 2027",
  monthlyFee: "₹15,000",
  renewalDate: "1 July 2027",
  accountManager: "Rahul Mehta"
};

const services = [
  { name: "Static Social Media Posts", included: 10, completed: 7, inProgress: 1 },
  { name: "Instagram Reels", included: 4, completed: 2, inProgress: 1 },
  { name: "Video Shoots", included: 1, completed: 1, inProgress: 0 },
  { name: "Blog Posts", included: 4, completed: 2, inProgress: 1 },
  { name: "Meta Ads Management", included: 1, completed: 0, inProgress: 1 },
  { name: "Google Ads Management", included: 1, completed: 0, inProgress: 1 },
  { name: "Monthly Performance Report", included: 1, completed: 1, inProgress: 0 },
];

export default function MyPackagePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">My Active Package</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          View your subscription package details, service allocations, and monthly deliverables.
        </p>
      </div>

      {/* Hero Card */}
      <div className="border-2 border-black p-6 rounded-xl bg-white space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900">{packageInfo.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">Account Manager: {packageInfo.accountManager}</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-semibold block">Monthly Subscription Fee</span>
            <span className="text-2xl font-bold text-black font-mono">{packageInfo.monthlyFee}</span>
            <span className="text-[10px] text-neutral-400 font-mono block">/ month (Billed Monthly)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">Start Date</span>
            <span className="text-xs font-bold text-neutral-900 font-mono mt-1 block">{packageInfo.startDate}</span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">End Date</span>
            <span className="text-xs font-bold text-neutral-900 font-mono mt-1 block">{packageInfo.endDate}</span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">Next Renewal</span>
            <span className="text-xs font-bold text-neutral-900 font-mono mt-1 block">{packageInfo.renewalDate}</span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">Billing Cycle</span>
            <span className="text-xs font-bold text-neutral-900 font-mono mt-1 block">Monthly Recurring</span>
          </div>
        </div>
      </div>

      {/* Deliverables Usage Tracker Table */}
      <div className="border border-black rounded-xl bg-white overflow-hidden space-y-4 p-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Current Month Deliverables Tracker</h2>
          <p className="text-xs text-neutral-500 font-mono">Real-time status of your package items for the current billing cycle</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black bg-neutral-50 text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">
                <th className="py-3 px-4">Service / Deliverable</th>
                <th className="py-3 px-4 text-center">Included</th>
                <th className="py-3 px-4 text-center">Completed</th>
                <th className="py-3 px-4 text-center">In Progress</th>
                <th className="py-3 px-4 text-center">Remaining</th>
                <th className="py-3 px-4">Progress Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs">
              {services.map((item) => {
                const remaining = Math.max(0, item.included - item.completed - item.inProgress);
                const pct = Math.min(100, Math.round((item.completed / item.included) * 100));
                const isComplete = item.completed >= item.included;

                return (
                  <tr key={item.name} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-900">{item.name}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">{item.included}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-700 font-bold">{item.completed}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-amber-600 font-bold">{item.inProgress}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-neutral-500 font-semibold">{remaining}</td>
                    <td className="py-3.5 px-4 w-48">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className={isComplete ? 'text-emerald-700 font-bold' : 'text-neutral-500'}>
                            {pct}% {isComplete ? 'Complete' : 'In Progress'}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 rounded-full border border-neutral-300 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${isComplete ? 'bg-emerald-600' : 'bg-amber-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Included Features List */}
      <div className="border border-black p-6 rounded-xl bg-white space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Included Services & Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Custom Medical Content Creation",
            "Monthly Performance Analytics",
            "Meta & Google Ads Campaign Setup",
            "Dedicated Account Manager",
            "WhatsApp & Phone Support",
            "Lead Collection & Management",
            "Brand Design & Asset Storage",
            "High Quality Reels & Video Editing",
            "SEO Blog Posts & Articles"
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2.5 p-3 rounded-lg border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-800">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Renewal CTA Card */}
      <div className="border border-black p-6 rounded-xl bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Plan Renewal</span>
          <h3 className="text-xl font-bold mt-0.5">Upgrade or Modify Your Growth Package</h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-xl">
            Want to scale your clinic's patient outreach with additional reels, Google Ads management, or custom landing pages? Talk with your account manager.
          </p>
        </div>
        <Link
          href="/client/support"
          className="px-5 py-3 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          Contact Rahul Mehta <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
