'use client';

import '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceStyles.css';
import { CheckCircle2, Clock, Layers, Wrench } from 'lucide-react';

interface ManagerAssetsMaintenanceKpisProps {
  totalLogs: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  totalCostFormatted: string;
  completedPct: number;
  inProgressPct: number;
  pendingPct: number;
  labels: {
    pending: string;
    inProgress: string;
    completed: string;
  };
}

export function ManagerAssetsMaintenanceKpis({
  totalLogs,
  pendingCount,
  inProgressCount,
  completedCount,
  totalCostFormatted,
  completedPct,
  inProgressPct,
  pendingPct,
  labels,
}: ManagerAssetsMaintenanceKpisProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden p-5 rounded-2xl border border-indigo-500/40 mm-kpi-indigo shadow-lg shadow-indigo-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 text-indigo-400 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Work Orders</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-sans">{totalLogs}</p>
            <span className="text-[11px] text-slate-400 font-medium">Registered service logs</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <Layers size={22} />
          </div>
        </div>

        <div className="group relative overflow-hidden p-5 rounded-2xl border border-amber-500/40 mm-kpi-amber shadow-lg shadow-amber-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 text-amber-400 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{labels.pending}</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 font-sans">{pendingCount}</p>
            <span className="text-[11px] text-amber-200 opacity-75 font-medium">Awaiting service start</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <Clock size={22} />
          </div>
        </div>

        <div className="group relative overflow-hidden p-5 rounded-2xl border border-sky-500/40 mm-kpi-sky shadow-lg shadow-sky-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 text-sky-400 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider">{labels.inProgress}</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-1 font-sans">{inProgressCount}</p>
            <span className="text-[11px] text-sky-200 opacity-75 font-medium">Under active technician repair</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <Wrench size={22} />
          </div>
        </div>

        <div className="group relative overflow-hidden p-5 rounded-2xl border border-emerald-500/40 mm-kpi-emerald shadow-lg shadow-emerald-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 text-emerald-400 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{labels.completed} ({completedCount})</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{totalCostFormatted}</p>
            <span className="text-[11px] text-emerald-200 opacity-75 font-medium">Total settled repair cost</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-primary">Maintenance Work Orders & Status Resolution</h3>
          <span className="text-xs text-secondary font-medium">{totalLogs} Total Service Tickets Recorded</span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-surface-highlight">
          <div style={{ width: `${completedPct}%` }} className="bg-emerald-500 h-full motion-safe:transition-all motion-safe:duration-300" title={`Completed (${completedPct}%)`} />
          <div style={{ width: `${inProgressPct}%` }} className="bg-sky-500 h-full motion-safe:transition-all motion-safe:duration-300" title={`In Progress (${inProgressPct}%)`} />
          <div style={{ width: `${pendingPct}%` }} className="bg-amber-500 h-full motion-safe:transition-all motion-safe:duration-300" title={`Pending (${pendingPct}%)`} />
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-secondary pt-1">
          <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed ({completedPct}%)</span>
          <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> In Progress ({inProgressPct}%)</span>
          <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending ({pendingPct}%)</span>
        </div>
      </div>
    </>
  );
}
