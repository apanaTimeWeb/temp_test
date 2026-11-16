'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Users, UserCheck, UserX, Clock, AlertTriangle } from 'lucide-react';
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
      <div className="p-5 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Users size={18} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
            Enrolled Roster
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            {tManagerUi('total_students')}
          </p>
          <h3 className="text-2xl font-black text-primary tracking-tight">{filtered.length}</h3>
          <p className="mt-1 text-xs text-secondary">
            {shiftLabel(shift)} shift · {dateLabel}
          </p>
        </div>
      </div>

      {/* Present */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UserCheck size={18} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Active Present
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            {tManagerUi('present')}
          </p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{present}</h3>
          <p className="mt-1 text-xs text-secondary">
            {filtered.length ? Math.round((present / filtered.length) * 100) : 0}% attendance rate
          </p>
        </div>
      </div>

      {/* Absent */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <UserX size={18} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            Critical Absentees
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            {tManagerUi('absent')}
          </p>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">{absent}</h3>
          <p className="mt-1 text-xs text-secondary">
            {filtered.filter((s) => s.consecutiveAbsent >= 3).length} {tManagerUi('need_alerts')}
          </p>
        </div>
      </div>

      {/* Late */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock size={18} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Delayed Check-in
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            {tManagerUi('late')}
          </p>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{late}</h3>
          <p className="mt-1 text-xs text-secondary">
            {marked}/{filtered.length} {tManagerUi('marked')}
          </p>
        </div>
      </div>

      {/* Overstay Alerts */}
      <div className={`p-5 rounded-2xl bg-card border ${overstayCount > 0 ? 'border-rose-500/50 bg-rose-500/5' : 'border-border'} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}>
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle size={18} />
          </div>
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${overstayCount > 0 ? 'border-rose-500/40 bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse' : 'border-border bg-muted text-secondary'}`}>
            Shift Overstay
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            Overstay Alerts
          </p>
          <h3 className={`text-2xl font-black ${overstayCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-primary'} tracking-tight`}>
            {overstayCount}
          </h3>
          <p className="mt-1 text-xs text-secondary">
            {overstayCount > 0 ? 'Exceeding shift end window' : 'All shifts cleared'}
          </p>
        </div>
      </div>
    </div>
  );
}

