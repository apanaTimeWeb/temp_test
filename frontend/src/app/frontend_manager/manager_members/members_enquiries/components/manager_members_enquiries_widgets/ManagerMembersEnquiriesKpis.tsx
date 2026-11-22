'use client';
import { GitBranch,GraduationCap,UserPlus,Users } from 'lucide-react';

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
      <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 p-4 sm:p-5 shadow-lg shadow-indigo-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-16 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider truncate">Total Leads</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-110">
              <Users size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">{stats.total}</div>
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                {horizonLabel}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400 truncate">
              All prospect leads
            </p>
          </div>
        </div>
      </div>

      {/* KPI 2: New Prospects */}
      <div className="group relative overflow-hidden rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0e2540] to-sky-900/60 p-4 sm:p-5 shadow-lg shadow-sky-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-16 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider truncate">New Leads</span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-110">
              <UserPlus size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">{stats.newLeads}</div>
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 whitespace-nowrap">
                {horizonLabel}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400 truncate">Awaiting initial follow-up</p>
          </div>
        </div>
      </div>

      {/* KPI 3: Active Pipeline (Visited + Interested) */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#261708] to-amber-900/60 p-4 sm:p-5 shadow-lg shadow-amber-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-16 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q30,14 60,25 T110,10 T150,18" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider truncate">In Pipeline</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-110">
              <GitBranch size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">{stats.activePipeline}</div>
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                {horizonLabel}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400 truncate">
              {stats.visited} visited · {stats.interested} interested
            </p>
          </div>
        </div>
      </div>

      {/* KPI 4: Admissions Converted */}
      <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0e2c21] to-emerald-900/60 p-4 sm:p-5 shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-16 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider truncate">Admitted / Won</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-110">
              <GraduationCap size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">{stats.converted}</div>
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                {stats.conversionRate}% Rate
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400 truncate">
              Converted to library memberships
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
