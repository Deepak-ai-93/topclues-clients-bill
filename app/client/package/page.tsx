'use client';

import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getClientPackageData } from '../../../lib/actions';

interface UsageItem {
  id: string;
  service: string;
  included: number;
  completed: number;
  in_progress: number;
}

interface PackageInfo {
  id: string;
  name: string;
  pricing: number;
  billing_cycle: string;
  included_services: string[] | string;
  feature_list: string[] | string;
  optional_add_ons: string[] | string;
  support_level: string;
  description: string;
}

export default function MyPackagePage() {
  const [loading, setLoading] = useState(true);
  const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
  const [usage, setUsage] = useState<UsageItem[]>([]);
  const [renewalDate, setRenewalDate] = useState('');
  const [accountManager, setAccountManager] = useState('Topclues Team');

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientPackageData();
        setPackageInfo((data.package as unknown as PackageInfo) || null);
        setUsage(data.usage as UsageItem[]);
        setRenewalDate(data.renewalDate);
        setAccountManager(data.accountManager);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const toArray = (v: string[] | string | undefined): string[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const includedServices = toArray(packageInfo?.included_services);
  const features = toArray(packageInfo?.feature_list);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">My Active Package</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          View your subscription package details, service allocations, and monthly deliverables.
        </p>
      </div>

      {!packageInfo ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 rounded-xl">
          <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-semibold">No active package assigned yet.</p>
          <p className="text-xs text-neutral-400 font-mono mt-1">Your Topclues team will assign your package here.</p>
          <Link href="/client/support" className="inline-block mt-4 px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors">
            Contact Account Manager
          </Link>
        </div>
      ) : (
        <>
          <div className="border-2 border-primary p-6 rounded-xl bg-white space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-900">{packageInfo.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-accent-100 text-accent-800 border border-accent-300">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">Account Manager: {accountManager}</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-semibold block">Monthly Subscription Fee</span>
                <span className="text-2xl font-bold text-black font-mono">
                  ₹{(Number(packageInfo.pricing) || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono block">/ {packageInfo.billing_cycle}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">Billing Cycle</span>
                <span className="text-xs font-bold text-neutral-900 font-mono mt-1 block capitalize">{packageInfo.billing_cycle}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">Next Renewal</span>
                <span className="text-xs font-bold text-neutral-900 font-mono mt-1 block">{renewalDate || '—'}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">Support Level</span>
                <span className="text-xs font-bold text-neutral-900 font-mono mt-1 block">{packageInfo.support_level || 'Standard'}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">Status</span>
                <span className="text-xs font-bold text-accent-700 font-mono mt-1 block">Active</span>
              </div>
            </div>
          </div>

          <div className="border border-primary rounded-xl bg-white overflow-hidden space-y-4 p-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Current Month Deliverables Tracker</h2>
              <p className="text-xs text-neutral-500 font-mono">Real-time status of your package items for the current billing cycle</p>
            </div>

            {usage.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-neutral-300 rounded-lg">
                <p className="text-xs text-neutral-400 font-mono">No usage data recorded for this month yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-primary bg-neutral-50 text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Service / Deliverable</th>
                      <th className="py-3 px-4 text-center">Included</th>
                      <th className="py-3 px-4 text-center">Completed</th>
                      <th className="py-3 px-4 text-center">In Progress</th>
                      <th className="py-3 px-4 text-center">Remaining</th>
                      <th className="py-3 px-4">Progress Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-xs">
                    {usage.map((item) => {
                      const remaining = Math.max(0, item.included - item.completed - item.in_progress);
                      const pct = item.included > 0 ? Math.min(100, Math.round((item.completed / item.included) * 100)) : 0;
                      const isComplete = item.included > 0 && item.completed >= item.included;
                      return (
                        <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-neutral-900">{item.service}</td>
                          <td className="py-3.5 px-4 text-center font-mono font-semibold">{item.included}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-accent-700 font-bold">{item.completed}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-amber-600 font-bold">{item.in_progress}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-neutral-500 font-semibold">{remaining}</td>
                          <td className="py-3.5 px-4 w-48">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-mono">
                                <span className={isComplete ? 'text-accent-700 font-bold' : 'text-neutral-500'}>
                                  {pct}% {isComplete ? 'Complete' : 'In Progress'}
                                </span>
                              </div>
                              <div className="w-full h-2 bg-neutral-100 rounded-full border border-neutral-300 overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${isComplete ? 'bg-accent-600' : 'bg-amber-500'}`}
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
            )}
          </div>

          {includedServices.length > 0 && (
            <div className="border border-primary p-6 rounded-xl bg-white space-y-4">
              <h2 className="text-lg font-bold text-neutral-900">Included Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {includedServices.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 p-3 rounded-lg border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-800">
                    <CheckCircle className="w-4 h-4 text-accent-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-primary p-6 rounded-xl bg-primary text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
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
              Contact {accountManager} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}