'use client';

import type {
  AttendanceDailyDayRecord,
  AttendanceDailyMonthStatus,
} from '@/app/frontend_manager/manager_attendance/attendance_daily/utils/ManagerAttendanceDailyMonthlyHistoryUtils';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface ManagerAttendanceDailyCalendarGridProps {
  activeView: 'calendar' | 'table';
  dailyLogs: AttendanceDailyDayRecord[];
  filteredLogs: AttendanceDailyDayRecord[];
  statusFilter: 'all' | 'present' | 'absent' | 'late';
}

function statusBadge(status: AttendanceDailyMonthStatus) {
  switch (status) {
    case 'present':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 size={10} /> Present
        </span>
      );
    case 'absent':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
          <XCircle size={10} /> Absent
        </span>
      );
    case 'late':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <Clock size={10} /> Late
        </span>
      );
    case 'holiday':
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-500 border border-border">
          Sunday / Off
        </span>
      );
  }
}

export function ManagerAttendanceDailyCalendarGrid({
  activeView,
  dailyLogs,
  filteredLogs,
  statusFilter,
}: ManagerAttendanceDailyCalendarGridProps) {
  if (activeView === 'calendar') {
    return (
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 p-3 sm:p-4 bg-muted/40">
          {dailyLogs.map((log) => {
            const isFilteredOut = statusFilter !== 'all' && log.status !== statusFilter;
            return (
              <div
                key={log.dayNumber}
                className={`p-2.5 rounded-xl border motion-safe:transition-all flex flex-col justify-between gap-1.5 ${
                  isFilteredOut
                    ? 'opacity-30 border-border bg-card'
                    : log.status === 'present'
                    ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500'
                    : log.status === 'absent'
                    ? 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500'
                    : log.status === 'late'
                    ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500'
                    : 'border-border bg-card/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">Day {log.dayNumber}</span>
                  <span className="text-[10px] uppercase font-semibold text-secondary">{log.dayOfWeek}</span>
                </div>
                <div className="my-0.5">{statusBadge(log.status)}</div>
                <div className="text-[10px] font-mono text-secondary pt-1 border-t border-border/50 flex items-center justify-between">
                  <span>{log.inTime !== '—' ? `${log.inTime}` : 'No Punch'}</span>
                  {log.studyHours > 0 && <span className="font-semibold text-primary">{log.studyHours}h</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl bg-card overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-muted text-secondary uppercase tracking-wider text-[11px] border-b border-border">
            <th className="py-2.5 px-3 font-semibold">Date & Day</th>
            <th className="py-2.5 px-3 font-semibold">Status</th>
            <th className="py-2.5 px-3 font-semibold">In Time</th>
            <th className="py-2.5 px-3 font-semibold">Out Time</th>
            <th className="py-2.5 px-3 font-semibold">Study Duration</th>
            <th className="py-2.5 px-3 font-semibold">Verification Punch</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filteredLogs.map((log) => (
            <tr key={log.dayNumber} className="hover:bg-surface-hover motion-safe:transition-colors">
              <td className="py-2.5 px-3 font-medium text-primary">
                {log.dateStr} <span className="text-secondary font-normal font-mono">({log.dayOfWeek})</span>
              </td>
              <td className="py-2.5 px-3">{statusBadge(log.status)}</td>
              <td className="py-2.5 px-3 font-mono text-primary">{log.inTime}</td>
              <td className="py-2.5 px-3 font-mono text-primary">{log.outTime}</td>
              <td className="py-2.5 px-3 font-mono text-primary">{log.studyHours > 0 ? `${log.studyHours} hrs` : '—'}</td>
              <td className="py-2.5 px-3 text-secondary text-[11px]">{log.verificationMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
