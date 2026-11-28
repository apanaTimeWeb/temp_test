'use client';

import type { ManagerSettingsBranchInfoDraft } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';
import { Armchair, CalendarCheck, Clock, Layers } from 'lucide-react';

/** Compact 4-card capacity, floors, daily shifts, and operating schedule KPI strip. */
export function ManagerSettingsBranchInfoKpis({ branchData }: { branchData: ManagerSettingsBranchInfoDraft }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="mgr-branch-kpi--amber group relative overflow-hidden rounded-2xl border border-amber-500/40 p-4 sm:p-5 shadow-lg motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-amber-400" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Total Seating
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs">
            <Armchair size={18} />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight font-sans">
            {branchData.totalSeatingCapacity || '120 Seats'}
          </p>
          <p className="text-xs text-amber-200 mt-1">AC Study Desks</p>
        </div>
      </div>

      <div className="mgr-branch-kpi--purple group relative overflow-hidden rounded-2xl border border-purple-500/40 p-4 sm:p-5 shadow-lg motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-purple-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-purple-400" viewBox="0 0 150 45">
          <path d="M0,32 Q30,14 60,25 T110,10 T150,18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
            Floor Count
          </span>
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs">
            <Layers size={18} />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            {branchData.totalFloors || '2 Floors'}
          </p>
          <p className="text-xs text-purple-200 mt-1">Ground + 1st Floor</p>
        </div>
      </div>

      <div className="mgr-branch-kpi--sky group relative overflow-hidden rounded-2xl border border-sky-500/40 p-4 sm:p-5 shadow-lg motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-sky-400" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
            Daily Shifts
          </span>
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs">
            <Clock size={18} />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            {branchData.totalShifts || '3 Shifts'}
          </p>
          <p className="text-xs text-sky-200 mt-1">Morning · Eve · Night</p>
        </div>
      </div>

      <div className="mgr-branch-kpi--emerald group relative overflow-hidden rounded-2xl border border-emerald-500/40 p-4 sm:p-5 shadow-lg motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-emerald-400" viewBox="0 0 150 45">
          <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Operating Schedule
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs">
            <CalendarCheck size={18} />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-sans">
            All 7 Days Open
          </p>
          <p className="text-xs text-emerald-200 mt-1 truncate" title={branchData.workingHours}>
            {branchData.workingHours || '08:00 AM – 10:00 PM'}
          </p>
        </div>
      </div>
    </div>
  );
}
