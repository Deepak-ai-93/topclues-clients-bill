'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Users, Eye, MessageSquare, TrendingUp, RefreshCw, Globe, Youtube, Linkedin, Facebook, Instagram } from 'lucide-react';
import { getClientSocialSnapshots } from '../../../lib/actions';

interface Snapshot {
  id: string;
  platform: string;
  followers: number;
  reach: number;
  impressions: number;
  engagement: number;
  profile_visits: number;
  posts_published: number;
  best_post: string;
  last_synced: string | null;
}

const platformMeta: Record<string, { label: string; color: string; Icon: any }> = {
  facebook: { label: 'Facebook', color: '#1877F2', Icon: Facebook },
  instagram: { label: 'Instagram', color: '#E1306C', Icon: Instagram },
  youtube: { label: 'YouTube', color: '#FF0000', Icon: Youtube },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', Icon: Linkedin },
  google_business: { label: 'Google Business', color: '#4285F4', Icon: Globe },
  x: { label: 'X', color: '#000000', Icon: Share2 },
};

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function ClientSocialPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientSocialSnapshots();
        setSnapshots(data.snapshots as Snapshot[]);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">Social Media Overview</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Consolidated performance of your connected channels.
          {snapshots.length > 0 && <span className="font-mono text-neutral-400"> Data updated periodically by your Topclues team.</span>}
        </p>
      </div>

      {snapshots.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 rounded-xl">
          <Share2 className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 font-semibold">No social accounts connected yet.</p>
          <p className="text-xs text-neutral-400 font-mono mt-1">Your Topclues team will add channel summaries here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {snapshots.map(snap => {
            const meta = platformMeta[snap.platform] || platformMeta.x;
            const Icon = meta.Icon;
            return (
              <div key={snap.id} className="border border-primary rounded-xl bg-white p-5 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: meta.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">{meta.label}</h3>
                      <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        {snap.last_synced ? `Synced ${new Date(snap.last_synced).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : 'Not synced yet'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">{snap.posts_published} posts</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase"><Users className="w-3 h-3" /> Followers</div>
                    <div className="text-lg font-bold text-neutral-900 mt-0.5">{formatNumber(snap.followers)}</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase"><Eye className="w-3 h-3" /> Reach</div>
                    <div className="text-lg font-bold text-neutral-900 mt-0.5">{formatNumber(snap.reach)}</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase"><MessageSquare className="w-3 h-3" /> Engagement</div>
                    <div className="text-lg font-bold text-neutral-900 mt-0.5">{snap.engagement}%</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase"><TrendingUp className="w-3 h-3" /> Profile Visits</div>
                    <div className="text-lg font-bold text-neutral-900 mt-0.5">{formatNumber(snap.profile_visits)}</div>
                  </div>
                </div>

                {snap.best_post && (
                  <div className="p-3 border border-accent-300 bg-accent-50 rounded-lg">
                    <span className="text-[9px] font-mono font-bold text-accent-800 uppercase">Best Performing</span>
                    <p className="text-xs font-semibold text-neutral-800 mt-0.5">{snap.best_post}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}