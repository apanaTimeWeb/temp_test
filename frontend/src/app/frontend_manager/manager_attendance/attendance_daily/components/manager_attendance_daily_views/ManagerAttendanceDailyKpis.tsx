'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Students */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {tManagerUi('total_students')}
          </span>
          <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning border border-border flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary">{filtered.length}</div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{dateLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">
            {shiftLabel(shift)} shift ({dateLabel})
          </p>
        </div>
      </div>

      {/* Present */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {tManagerUi('present')}
          </span>
          <div className="w-10 h-10 rounded-xl bg-success-bg text-success border border-border flex items-center justify-center">
            <UserCheck size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-success">{present}</div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-success border border-border">
              [{dateLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">
            {filtered.length ? Math.round((present / filtered.length) * 100) : 0}
            {tManagerUi('rate')} attendance rate ({dateLabel})
          </p>
        </div>
      </div>

      {/* Absent */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {tManagerUi('absent')}
          </span>
          <div className="w-10 h-10 rounded-xl bg-danger-bg text-danger border border-border flex items-center justify-center">
            <UserX size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-danger">{absent}</div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-danger border border-border">
              [{dateLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">
            {filtered.filter((s) => s.consecutiveAbsent >= 3).length} {tManagerUi('need_alerts')} ({dateLabel})
          </p>
        </div>
      </div>

      {/* Late */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {tManagerUi('late')}
          </span>
          <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning border border-border flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-warning">{late}</div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-warning border border-border">
              [{dateLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">
            {marked}/{filtered.length} {tManagerUi('marked')} ({dateLabel})
          </p>
        </div>
      </div>
    </div>
  );
}

