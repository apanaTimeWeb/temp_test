'use client';

import '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_styles/ManagerAccountsSeatGapReportStyles.css';
import { AlertTriangle, Clock, IndianRupee, Wrench } from 'lucide-react';

interface ManagerAccountsSeatGapReportKpisProps {
  visibleCount: number;
  totalLossFormatted: string;
  avgGapDays: number;
  maintenanceCount: number;
  labels: {
    totalGapSeats: string;
    revenueLoss: string;
    avgGapDays: string;
    underMaintenance: string;
  };
}

export function ManagerAccountsSeatGapReportKpis({
  visibleCount,
  totalLossFormatted,
  avgGapDays,
  maintenanceCount,
  labels,
}: ManagerAccountsSeatGapReportKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="group relative overflow-hidden p-5 rounded-2xl border border-rose-500/40 sgr-kpi-rose shadow-lg shadow-rose-950/40 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-rose-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 text-rose-400 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">{labels.totalGapSeats}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1 font-sans">{visibleCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">Unallocated vacant seats</span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
          <AlertTriangle size={22} />
        </div>
      </div>

      <div className="group relative overflow-hidden p-5 rounded-2xl border border-amber-500/40 sgr-kpi-amber shadow-lg shadow-amber-950/40 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 text-amber-400 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{labels.revenueLoss}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">{totalLossFormatted}</p>
          <span className="text-[11px] text-slate-400 font-medium">Accumulated opportunity loss</span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
          <IndianRupee size={22} />
        </div>
      </div>

      <div className="group relative overflow-hidden p-5 rounded-2xl border border-cyan-500/40 sgr-kpi-cyan shadow-lg shadow-cyan-950/40 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-cyan-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 text-cyan-400 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">{labels.avgGapDays}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1 font-sans">{avgGapDays} Days</p>
          <span className="text-[11px] text-cyan-200 font-medium opacity-80">Mean vacancy duration</span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
          <Clock size={22} />
        </div>
      </div>

      <div className="group relative overflow-hidden p-5 rounded-2xl border border-purple-500/40 sgr-kpi-purple shadow-lg shadow-purple-950/40 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-purple-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 text-purple-400 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">{labels.underMaintenance}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-300 mt-1 font-sans">{maintenanceCount}</p>
          <span className="text-[11px] text-purple-200 font-medium opacity-80">Temporarily unavailable</span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs relative z-10">
          <Wrench size={22} />
        </div>
      </div>
    </div>
  );
}
