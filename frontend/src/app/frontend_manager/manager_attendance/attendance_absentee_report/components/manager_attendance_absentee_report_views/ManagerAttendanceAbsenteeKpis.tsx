'use client';

import { AlertTriangle, Clock, FileCheck, ShieldCheck, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ManagerAttendanceAbsenteeKpisProps {
  totalFiltered: number;
  threshold: string;
  criticalCount: number;
  moderateCount: number;
  onLeaveCount: number;
  notifiedCount: number;
}

export function ManagerAttendanceAbsenteeKpis({
  totalFiltered,
  threshold,
  criticalCount,
  moderateCount,
  onLeaveCount,
  notifiedCount,
}: ManagerAttendanceAbsenteeKpisProps) {
  const tManagerUi = useTranslations('manager.manager_absentee_report.ui');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="mgr-absentee-surface--indigo group relative overflow-hidden rounded-2xl border border-indigo-500/40 p-5 shadow-lg shadow-indigo-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
        <svg aria-hidden="true" className="text-indigo-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {tManagerUi('total_absentees')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              {totalFiltered}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Above {threshold === 'all' ? '0' : threshold} days absence
            </p>
          </div>
        </div>
      </div>

      <div className="mgr-absentee-surface--rose group relative overflow-hidden rounded-2xl border border-rose-500/40 p-5 shadow-lg shadow-rose-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-rose-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
        <svg aria-hidden="true" className="text-rose-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Critical Risk (7+ D)
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400 font-mono">
              {criticalCount}
            </div>
            <p className="mt-1 text-xs text-slate-400">Unexcused dropout & seat loss risk</p>
          </div>
        </div>
      </div>

      <div className="mgr-absentee-surface--amber group relative overflow-hidden rounded-2xl border border-amber-500/40 p-5 shadow-lg shadow-amber-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
        <svg aria-hidden="true" className="text-amber-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Moderate (3-6 D)
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-400 font-mono">
              {moderateCount}
            </div>
            <p className="mt-1 text-xs text-slate-400">Active attendance monitoring</p>
          </div>
        </div>
      </div>

      <div className="mgr-absentee-surface--sky group relative overflow-hidden rounded-2xl border border-sky-500/40 p-5 shadow-lg shadow-sky-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
        <svg aria-hidden="true" className="text-sky-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              On Leave / Excused
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
              <FileCheck size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-sky-400 font-mono">
              {onLeaveCount}
            </div>
            <p className="mt-1 text-xs text-slate-400">Approved leave (seats protected)</p>
          </div>
        </div>
      </div>

      <div className="mgr-absentee-surface--emerald group relative overflow-hidden rounded-2xl border border-emerald-500/40 p-5 shadow-lg shadow-emerald-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
        <svg aria-hidden="true" className="text-emerald-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {tManagerUi('parents_notified')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center motion-safe:transition-transform group-hover:scale-110 shadow-xs">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 font-mono">
              {notifiedCount}
            </div>
            <p className="mt-1 text-xs text-slate-400">Of {totalFiltered} total filtered absentees</p>
          </div>
        </div>
      </div>
    </div>
  );
}
