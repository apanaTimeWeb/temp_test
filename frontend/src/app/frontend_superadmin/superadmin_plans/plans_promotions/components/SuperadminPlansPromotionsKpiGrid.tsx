'use client';

import React from 'react';
import { Tag, TrendingUp, Percent, Clock } from 'lucide-react';

interface KpiGridProps {
  activeCount: number;
  totalUses: number;
  totalMaxUses: number;
  expiredCount: number;
}

export default function SuperadminPlansPromotionsKpiGrid({
  activeCount,
  totalUses,
  totalMaxUses,
  expiredCount,
}: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Active Codes */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Active Promo Codes</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
            <Tag className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{activeCount}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
            Live Discounts
          </span>
          <span className="text-[11px] text-slate-400">Redeemable</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '85%' }} />
        </div>
      </div>

      {/* Total Redemptions */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Total Redemptions</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{totalUses.toLocaleString()}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300 border border-indigo-500/20">
            Times Used
          </span>
          <span className="text-[11px] text-slate-400">All Campaigns</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: '60%' }} />
        </div>
      </div>

      {/* Max Capacity */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Campaign Capacity</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400">
            <Percent className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{totalMaxUses.toLocaleString()}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-300 border border-sky-500/20">
            Max Limit
          </span>
          <span className="text-[11px] text-slate-400">Overall Quota</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: '75%' }} />
        </div>
      </div>

      {/* Expired / Lapsed */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Expired Campaigns</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{expiredCount}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-300 border border-rose-500/20">
            Archived
          </span>
          <span className="text-[11px] text-slate-400">Past Validity</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500" style={{ width: '30%' }} />
        </div>
      </div>
    </div>
  );
}
