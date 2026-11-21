'use client';
// RESPONSIBILITY: Display top metrics for Branch Management.
import { GitBranch, CheckCircle2, ShieldAlert, XCircle, Armchair } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewKpiCardsProps {
  branches: SuperadminBranchRecord[];
}

export default function SuperadminBranchesOverviewKpiCards({ branches }: SuperadminBranchesOverviewKpiCardsProps) {
  const total = branches.length;
  const active = branches.filter((b) => b.status === 'active').length;
  const suspended = branches.filter((b) => b.status === 'suspended').length;
  const closed = branches.filter((b) => b.status === 'closed').length;
  const totalSeats = branches.reduce((sum, b) => sum + (b.capacity || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4" aria-label="Branch Statistics">
      {/* Total Branches */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 to-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Branches</span>
          <GitBranch size={16} className="text-indigo-400" />
        </div>
        <p className="text-2xl font-black text-white">{total}</p>
        <p className="text-[11px] text-slate-400 mt-1">Across all registered libraries</p>
      </div>

      {/* Active Branches */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 to-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
          <CheckCircle2 size={16} className="text-emerald-400" />
        </div>
        <p className="text-2xl font-black text-white">{active}</p>
        <p className="text-[11px] text-emerald-400/90 mt-1">{Math.round((active / Math.max(1, total)) * 100)}% Operational</p>
      </div>

      {/* Suspended */}
      <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-950/60 to-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Suspended</span>
          <ShieldAlert size={16} className="text-rose-400" />
        </div>
        <p className="text-2xl font-black text-white">{suspended}</p>
        <p className="text-[11px] text-rose-300 mt-1">Isolated access block</p>
      </div>

      {/* Closed / Archived */}
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Closed / Archived</span>
          <XCircle size={16} className="text-slate-400" />
        </div>
        <p className="text-2xl font-black text-white">{closed}</p>
        <p className="text-[11px] text-slate-400 mt-1">Safely soft-archived</p>
      </div>

      {/* Total Capacity */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/60 to-slate-900/80 p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-300 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Seats</span>
          <Armchair size={16} className="text-amber-400" />
        </div>
        <p className="text-2xl font-black text-amber-300">{totalSeats.toLocaleString()}</p>
        <p className="text-[11px] text-slate-400 mt-1">Across all branches</p>
      </div>
    </div>
  );
}
