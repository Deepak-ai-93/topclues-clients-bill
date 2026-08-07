'use client';

import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Star, TrendingUp } from 'lucide-react';

/**
 * Signature hero element: a "Clinic Growth Monitor" — a vital-signs screen
 * for the clinic's digital growth. Grounds the landing page in the doctor's
 * world: patient leads, approvals, and ratings on a live ECG-style trace.
 */
export default function GrowthMonitor() {
  const [leads, setLeads] = useState(24);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLeads((n) => n + 1);
      setTick((t) => t + 1);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const bars = [34, 48, 42, 62, 58, 74, 82, 90];

  return (
    <div
      className="relative border border-primary/20 bg-white rounded-2xl shadow-raised overflow-hidden"
      role="img"
      aria-label="Clinic growth monitor showing live patient leads, content approvals and ratings"
    >
      {/* Monitor top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-primary/15 bg-neutral-50/60">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-700 font-semibold">
          Clinic Growth Monitor
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-accent-700 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-blink" />
          Live
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Lead counter */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-1">
              Patient leads this month
            </p>
            <div className="flex items-baseline gap-2">
              <span
                key={tick}
                className="text-4xl sm:text-5xl font-bold tracking-tighter text-neutral-900 tabular-nums animate-tick-up inline-block"
              >
                {leads}
              </span>
              <span className="text-xs font-mono text-accent-600 font-bold bg-accent-50 border border-accent-200 rounded px-1.5 py-0.5">
                +{tick % 4 === 0 ? 3 : 1} today
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center">
            <Activity className="w-4.5 h-4.5 text-primary-600" />
          </div>
        </div>

        {/* ECG pulse line — the signature trace */}
        <div className="relative">
          <svg
            viewBox="0 0 320 72"
            className="w-full h-16"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ecgStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#356cb0" />
                <stop offset="100%" stopColor="#3a9b47" />
              </linearGradient>
            </defs>
            {/* calm baseline */}
            <path
              d="M0,40 L52,40 L60,24 L68,56 L76,40 L128,40 L136,18 L144,62 L152,40 L204,40 L212,26 L220,54 L228,40 L280,40 L288,22 L296,58 L304,40 L320,40"
              fill="none"
              stroke="url(#ecgStroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="620"
              className="animate-pulse-line"
            />
            {/* soft glow underlay */}
            <path
              d="M0,40 L52,40 L60,24 L68,56 L76,40 L128,40 L136,18 L144,62 L152,40 L204,40 L212,26 L220,54 L228,40 L280,40 L288,22 L296,58 L304,40 L320,40"
              fill="none"
              stroke="#356cb0"
              strokeOpacity="0.12"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* live scan head */}
          <div className="absolute top-0 bottom-0 w-px bg-primary/40 animate-blink" />
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
              <CheckCircle2 className="w-3 h-3 text-accent-600" />
              Approvals
            </div>
            <div className="text-lg font-bold text-neutral-900 tabular-nums">18/20</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
              <Star className="w-3 h-3 text-amber-500" />
              Rating
            </div>
            <div className="text-lg font-bold text-neutral-900 tabular-nums">4.9</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
              <TrendingUp className="w-3 h-3 text-primary-600" />
              ROI
            </div>
            <div className="text-lg font-bold text-neutral-900 tabular-nums">3.2x</div>
          </div>
        </div>

        {/* Mini bar chart */}
        <div className="flex items-end gap-1.5 h-16">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t ${
                i === bars.length - 1 ? 'bg-accent-500' : 'bg-primary-400/70'
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* corner flourish */}
      <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-2xl pointer-events-none" />
    </div>
  );
}
