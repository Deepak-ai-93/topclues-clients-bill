'use client';

import React, { useState, useEffect } from 'react';
import { Radio, TrendingUp, Users, IndianRupee, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getClientCampaigns } from '../../../lib/actions';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  objective: string;
  budget: number;
  spend: number;
  leads: number;
  cpl: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  draft: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  scheduled: 'bg-primary-100 text-primary-800 border-primary-300',
  active: 'bg-accent-100 text-accent-800 border-accent-300',
  paused: 'bg-amber-100 text-amber-800 border-amber-300',
  completed: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
};

const platformColors: Record<string, string> = {
  facebook: '#1877F2',
  instagram: '#E1306C',
  google: '#4285F4',
  whatsapp: '#25D366',
  youtube: '#FF0000',
  linkedin: '#0A66C2',
  other: '#6B7280',
};

export default function ClientCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientCampaigns();
        setCampaigns(data.campaigns as Campaign[]);
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

  const totalBudget = campaigns.reduce((s, c) => s + (Number(c.budget) || 0), 0);
  const totalSpend = campaigns.reduce((s, c) => s + (Number(c.spend) || 0), 0);
  const totalLeads = campaigns.reduce((s, c) => s + (Number(c.leads) || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Campaigns</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">What&apos;s running, what it&apos;s achieving, and how it&apos;s performing.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-primary p-4 rounded-xl bg-white">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-500 font-bold">
            <Radio className="w-4 h-4" /> Active Campaigns
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">{campaigns.filter(c => c.status === 'active').length}</div>
        </div>
        <div className="border border-primary p-4 rounded-xl bg-white">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-500 font-bold">
            <Target className="w-4 h-4" /> Leads Generated
          </div>
          <div className="text-2xl font-bold text-primary mt-2">{totalLeads}</div>
        </div>
        <div className="border border-primary p-4 rounded-xl bg-white">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-500 font-bold">
            <IndianRupee className="w-4 h-4" /> Total Spend
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">₹{totalSpend.toLocaleString('en-IN')}</div>
        </div>
        <div className="border border-primary p-4 rounded-xl bg-white">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-500 font-bold">
            <TrendingUp className="w-4 h-4" /> Total Budget
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">₹{totalBudget.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 rounded-xl">
          <Radio className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-semibold">No campaigns yet.</p>
          <p className="text-xs text-neutral-400 font-mono mt-1">Your Topclues team will add campaigns here as they launch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map(campaign => {
            const spendPct = Number(campaign.budget) > 0 ? Math.min(100, Math.round((Number(campaign.spend) / Number(campaign.budget)) * 100)) : 0;
            return (
              <div key={campaign.id} className="border border-primary rounded-xl bg-white p-5 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-mono font-bold uppercase shrink-0"
                      style={{ backgroundColor: platformColors[campaign.platform] || platformColors.other }}
                    >
                      {campaign.platform.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 leading-snug">{campaign.name}</h3>
                      <div className="text-[10px] font-mono text-neutral-400 capitalize">{campaign.platform} • {campaign.objective.replace('_', ' ')}</div>
                    </div>
                  </div>
                </div>

                <span className={`inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${statusColors[campaign.status] || statusColors.draft}`}>
                  {campaign.status}
                </span>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="text-[9px] font-mono text-neutral-400 uppercase">Spend</div>
                    <div className="text-sm font-bold text-neutral-900">₹{(Number(campaign.spend) || 0).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="text-[9px] font-mono text-neutral-400 uppercase">Leads</div>
                    <div className="text-sm font-bold text-primary">{campaign.leads}</div>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="text-[9px] font-mono text-neutral-400 uppercase">CPL</div>
                    <div className="text-sm font-bold text-neutral-900">₹{(Number(campaign.cpl) || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                    <span>Budget Used</span>
                    <span className="font-bold">{spendPct}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${spendPct}%` }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>{campaign.start_date || '—'} → {campaign.end_date || '—'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="border-2 border-primary p-6 rounded-xl bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm font-mono">RT</div>
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">Have a campaign question?</span>
            <h3 className="text-base font-bold text-neutral-900">Ask your account manager about campaign performance</h3>
          </div>
        </div>
        <Link
          href="/client/support"
          className="px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary-700 transition-colors shrink-0"
        >
          Contact Support <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}