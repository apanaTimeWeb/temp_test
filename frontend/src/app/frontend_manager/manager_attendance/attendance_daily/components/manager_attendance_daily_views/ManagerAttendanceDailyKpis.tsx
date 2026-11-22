'use client';

import { AlertTriangle,Clock,UserCheck,Users,UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Student } from '../../types/ManagerAttendanceDailyComponentTypes';

interface ManagerAttendanceDailyKpisProps {
  filtered: Student[];
  dateLabel: string;
  shift: string;
  shiftLabel: (value: string) => string;
  present: number;
  absent: number;
  late: number;
  marked: number;
}

export function ManagerAttendanceDailyKpis({
  filtered,
  dateLabel,
  shift,
  shiftLabel,
  present,
  absent,
  late,
  marked,
}: ManagerAttendanceDailyKpisProps) {
  const tManagerUi = useTranslations('manager.manager_attendance.ui');
  const overstayCount = filtered.filter((s) => s.isOverstay).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {/* Total Students */}
      <div className="group relative overflow-hidden p-5 rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 shadow-lg shadow-indigo-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl border border-indigo-500/40 bg-indigo-500/20 text-indigo-400 transition-transform group-hover:scale-110 shadow-xs">
              <Users size={18} />
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
              Enrolled Roster
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              {tManagerUi('total_students')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">{filtered.length}</h3>
            <p className="mt-1 text-xs text-slate-400">
              {shiftLabel(shift)} shift · {dateLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Present */}
      <div className="group relative overflow-hidden p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0e2c21] to-emerald-900/60 shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 transition-transform group-hover:scale-110 shadow-xs">
              <UserCheck size={18} />
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
              Active Present
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              {tManagerUi('present')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-sans">{present}</h3>
            <p className="mt-1 text-xs text-slate-400">
              {filtered.length ? Math.round((present / filtered.length) * 100) : 0}% attendance rate
            </p>
          </div>
        </div>
      </div>

      {/* Absent */}
      <div className="group relative overflow-hidden p-5 rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/80 via-[#260e19] to-rose-900/60 shadow-lg shadow-rose-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-rose-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl border border-rose-500/40 bg-rose-500/20 text-rose-400 transition-transform group-hover:scale-110 shadow-xs">
              <UserX size={18} />
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/15 text-rose-300">
              Critical Absentees
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              {tManagerUi('absent')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight font-sans">{absent}</h3>
            <p className="mt-1 text-xs text-slate-400">
              {filtered.filter((s) => s.consecutiveAbsent >= 3).length} {tManagerUi('need_alerts')}
            </p>
          </div>
        </div>
      </div>

      {/* Late */}
      <div className="group relative overflow-hidden p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#261708] to-amber-900/60 shadow-lg shadow-amber-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/20 text-amber-400 transition-transform group-hover:scale-110 shadow-xs">
              <Clock size={18} />
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-300">
              Delayed Check-in
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              {tManagerUi('late')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight font-sans">{late}</h3>
            <p className="mt-1 text-xs text-slate-400">
              {marked}/{filtered.length} {tManagerUi('marked')}
            </p>
          </div>
        </div>
      </div>

      {/* Overstay Alerts */}
      <div className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between ${
        overstayCount > 0
          ? 'border-rose-500/50 bg-gradient-to-br from-rose-950/85 via-[#351221] to-rose-900/70 shadow-lg shadow-rose-950/50 hover:border-rose-400/70'
          : 'border-purple-500/40 bg-gradient-to-br from-purple-950/80 via-[#24133f] to-purple-900/60 shadow-lg shadow-purple-950/40 hover:border-purple-400/60'
      }`}>
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q30,14 60,25 T110,10 T150,18" fill="none" stroke={overstayCount > 0 ? '#f87171' : '#c084fc'} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110 shadow-xs ${
              overstayCount > 0
                ? 'border-rose-500/40 bg-rose-500/20 text-rose-400'
                : 'border-purple-500/40 bg-purple-500/20 text-purple-400'
            }`}>
              <AlertTriangle size={18} />
            </div>
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
              overstayCount > 0
                ? 'border-rose-500/40 bg-rose-500/20 text-rose-300 animate-pulse'
                : 'border-purple-500/30 bg-purple-500/15 text-purple-300'
            }`}>
              Shift Overstay
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Overstay Alerts
            </p>
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${overstayCount > 0 ? 'text-rose-400' : 'text-purple-300'}`}>
              {overstayCount}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {overstayCount > 0 ? 'Exceeding shift end window' : 'All shifts cleared'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

