'use client';
import { Users, UserPlus, GitBranch, GraduationCap } from 'lucide-react';

interface ManagerMembersEnquiriesKpisProps {
  stats: {
    total: number;
    newLeads: number;
    activePipeline: number;
    visited: number;
    interested: number;
    converted: number;
    conversionRate: number;
  };
  horizonLabel: string;
}

export function ManagerMembersEnquiriesKpis({ stats, horizonLabel }: ManagerMembersEnquiriesKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full max-w-full min-w-0">
      {/* KPI 1: Total Enquiries */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-4 sm:p-5 transition-all hover:border-indigo-400 hover:shadow-lg shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider truncate">Total Leads</span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-xs shrink-0">
            <Users size={18} />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">{stats.total}</div>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
              {horizonLabel}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 truncate">
            All prospect leads
          </p>
        </div>
      </div>

      {/* KPI 2: New Prospects */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-4 sm:p-5 transition-all hover:border-indigo-400 hover:shadow-lg shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider truncate">New Leads</span>
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center shadow-xs shrink-0">
            <UserPlus size={18} />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">{stats.newLeads}</div>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 whitespace-nowrap">
              {horizonLabel}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 truncate">Awaiting initial follow-up</p>
        </div>
      </div>

      {/* KPI 3: Active Pipeline (Visited + Interested) */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-4 sm:p-5 transition-all hover:border-indigo-400 hover:shadow-lg shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider truncate">In Pipeline</span>
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-xs shrink-0">
            <GitBranch size={18} />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">{stats.activePipeline}</div>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 whitespace-nowrap">
              {horizonLabel}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 truncate">
            {stats.visited} visited · {stats.interested} interested
          </p>
        </div>
      </div>

      {/* KPI 4: Admissions Converted */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-4 sm:p-5 transition-all hover:border-indigo-400 hover:shadow-lg shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider truncate">Admitted / Won</span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs shrink-0">
            <GraduationCap size={18} />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-400">{stats.converted}</div>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
              {stats.conversionRate}% Rate
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 truncate">
            Converted to library memberships
          </p>
        </div>
      </div>
    </div>
  );
}
