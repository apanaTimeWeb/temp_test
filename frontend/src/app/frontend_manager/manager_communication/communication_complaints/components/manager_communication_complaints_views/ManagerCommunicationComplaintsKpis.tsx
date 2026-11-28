'use client';

import { AlertCircle, CheckCircle2, Clock, Layers } from 'lucide-react';

interface ManagerCommunicationComplaintsKpisProps {
  stats: {
    total: number;
    openCount: number;
    inProgressCount: number;
    resolvedCount: number;
    resolutionRate: number;
  };
}

/** 4-card complaint summary metrics strip (Total, Open, In-Progress, Resolved). */
export function ManagerCommunicationComplaintsKpis({ stats }: ManagerCommunicationComplaintsKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="mgr-card mc-kpi-indigo group relative overflow-hidden p-4 rounded-2xl border border-indigo-500/40 shadow-lg motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex items-center gap-3.5 select-none">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-indigo-400" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
          <Layers size={20} />
        </div>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block">Total Lodged</span>
          <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">{stats.total}</span>
        </div>
      </div>

      <div className="mgr-card mc-kpi-rose group relative overflow-hidden p-4 rounded-2xl border border-rose-500/40 shadow-lg motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-rose-400/60 hover:shadow-xl flex items-center gap-3.5 select-none">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-rose-400" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
          <AlertCircle size={20} />
        </div>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <span>Pending Open</span>
            {stats.openCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 motion-safe:animate-pulse" />}
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-rose-400 tracking-tight font-sans">{stats.openCount}</span>
        </div>
      </div>

      <div className="mgr-card mc-kpi-amber group relative overflow-hidden p-4 rounded-2xl border border-amber-500/40 shadow-lg motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex items-center gap-3.5 select-none">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-amber-400" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
          <Clock size={20} />
        </div>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block">In-Progress</span>
          <span className="text-xl sm:text-2xl font-extrabold text-amber-400 tracking-tight font-sans">{stats.inProgressCount}</span>
        </div>
      </div>

      <div className="mgr-card mc-kpi-emerald group relative overflow-hidden p-4 rounded-2xl border border-emerald-500/40 shadow-lg motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex items-center gap-3.5 select-none">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-emerald-400" viewBox="0 0 150 45">
          <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
          <CheckCircle2 size={20} />
        </div>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block">
            Resolved ({stats.resolutionRate}%)
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 tracking-tight font-sans">{stats.resolvedCount}</span>
        </div>
      </div>
    </div>
  );
}
