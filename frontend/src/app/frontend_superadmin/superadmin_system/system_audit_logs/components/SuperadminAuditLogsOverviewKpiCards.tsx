'use client';

import { ScrollText, PlusCircle, Trash2, Users } from 'lucide-react';

interface SuperadminAuditLogsOverviewKpiCardsProps {
  stats: {
    total: number;
    createdCount: number;
    deletedCount: number;
    uniqueActors: number;
  };
}

export default function SuperadminAuditLogsOverviewKpiCards({ stats }: SuperadminAuditLogsOverviewKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0e1338]/90 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-indigo-500/40 motion-safe:transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Audit Logs</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
            <ScrollText size={18} />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-100 tabular-nums">{stats.total}</div>
        <div className="text-[11px] text-slate-400 mt-1">Immutable WORM storage</div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#06201a]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-emerald-500/40 motion-safe:transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Created Records</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
            <PlusCircle size={18} />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">{stats.createdCount}</div>
        <div className="text-[11px] text-slate-400 mt-1">Entity inserts & onboardings</div>
      </div>

      <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#220a14]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-rose-500/40 motion-safe:transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deleted Records</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
            <Trash2 size={18} />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-rose-400 tabular-nums">{stats.deletedCount}</div>
        <div className="text-[11px] text-slate-400 mt-1">Permanent removals & expiries</div>
      </div>

      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#1b0d2d]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-purple-500/40 motion-safe:transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Distinct Actors</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shadow-inner">
            <Users size={18} />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-purple-400 tabular-nums">{stats.uniqueActors}</div>
        <div className="text-[11px] text-slate-400 mt-1">Audited administrators</div>
      </div>
    </div>
  );
}