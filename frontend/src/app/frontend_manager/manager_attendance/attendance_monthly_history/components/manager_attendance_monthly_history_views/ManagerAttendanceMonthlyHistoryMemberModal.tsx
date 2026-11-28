'use client';

// RESPONSIBILITY: Render individual student monthly attendance calendar modal with slip print and CSV export.

import { ManagerAttendanceMonthlyHistoryCalendarGrid } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/components/manager_attendance_monthly_history_views/ManagerAttendanceMonthlyHistoryCalendarGrid';
import { MONTH_OPTIONS } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/constants/ManagerAttendanceMonthlyHistoryConstants';
import type { Student } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/types/ManagerAttendanceMonthlyHistoryTypes';
import { exportManagerMemberMonthlyHistoryCsv } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/utils/ManagerAttendanceMonthlyHistoryCsv';
import { getStudentMonthlyAttendance } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/utils/ManagerAttendanceMonthlyHistoryUtilities';
import { Armchair, Calendar, Download, Printer, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface ManagerAttendanceMonthlyHistoryMemberModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  initialMonth?: string;
}

export function ManagerAttendanceMonthlyHistoryMemberModal({
  isOpen,
  student,
  onClose,
  initialMonth,
}: ManagerAttendanceMonthlyHistoryMemberModalProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth || '2026-11');
  const [activeView, setActiveView] = useState<'calendar' | 'table'>('calendar');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');

  useEffect(() => {
    if (initialMonth) setSelectedMonth(initialMonth);
  }, [initialMonth]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const summary = useMemo(() => {
    if (!student) return null;
    return getStudentMonthlyAttendance(student, selectedMonth);
  }, [student, selectedMonth]);

  if (!isOpen || !student || !summary) return null;

  const filteredLogs = summary.dailyLogs.filter((log) => {
    if (statusFilter === 'all') return true;
    return log.status === statusFilter;
  });

  const handlePrintSlip = () => {
    window.print();
    toast.success(`Monthly attendance slip sent to printer for ${student.name}`, {
      id: `monthly-slip-print-${student.id}`,
    });
  };

  const handleExportCsv = () => {
    exportManagerMemberMonthlyHistoryCsv(summary, student.smartId, selectedMonth);
    toast.success(`Exported ${summary.monthLabel} attendance register for ${student.name}`, {
      id: `monthly-history-csv-${student.id}`,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-monthly-history-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs motion-safe:animate-in fade-in motion-safe:duration-fast"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-border pb-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-base shrink-0">
              {student.initials || 'ST'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="member-monthly-history-title" className="text-lg sm:text-xl font-black text-primary truncate">
                  {student.name}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-highlight border border-border text-secondary">
                  {student.smartId}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary-subtle text-primary border border-border">
                  {student.shift} Shift
                </span>
                {student.seat && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                    <Armchair size={11} /> {student.seat}
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary mt-1 flex items-center gap-2 flex-wrap">
                <span>Month-wise Member Attendance Record &amp; Turnstile Log</span>
                <span>•</span>
                <span className="font-semibold text-primary">{summary.monthLabel}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shrink-0"
            title="Close modal"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted p-2.5 rounded-xl border border-border">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className="text-xs font-bold text-secondary mr-1 shrink-0 flex items-center gap-1">
              <Calendar size={13} className="text-primary" /> Month:
            </span>
            {MONTH_OPTIONS.map((m) => {
              const isSelected = selectedMonth === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMonth(m.id)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold motion-safe:transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card text-secondary hover:text-primary border border-border'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handlePrintSlip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-2xs"
              title="Print Monthly Attendance Slip"
            >
              <Printer size={13} />
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-2xs"
              title="Export Month CSV"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Attendance Rate</span>
            <div className="mt-2">
              <div
                className={`text-2xl font-black font-mono ${
                  summary.attendanceRate >= 85
                    ? 'text-emerald-500'
                    : summary.attendanceRate >= 70
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}
              >
                {summary.attendanceRate}%
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden border border-border">
                <div
                  className={`h-full rounded-full mgr-dynamic-width-${Math.min(100, Math.max(0, Math.round(summary.attendanceRate)))} ${
                    summary.attendanceRate >= 85
                      ? 'bg-emerald-500'
                      : summary.attendanceRate >= 70
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Present Days</span>
            <div className="mt-2 text-2xl font-black text-emerald-500 font-mono">
              {summary.presentDays}{' '}
              <span className="text-xs font-normal text-secondary">/ {summary.totalWorkingDays}</span>
            </div>
            <p className="text-[11px] text-secondary mt-1">Full shift attended</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Absent Days</span>
            <div className="mt-2 text-2xl font-black text-rose-500 font-mono">{summary.absentDays}</div>
            <p className="text-[11px] text-secondary mt-1">Leaves &amp; unexcused</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Late Arrivals</span>
            <div className="mt-2 text-2xl font-black text-amber-500 font-mono">{summary.lateDays}</div>
            <p className="text-[11px] text-secondary mt-1">&gt;30 min delay</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Total Hours</span>
            <div className="mt-2 text-2xl font-black text-indigo-400 font-mono">{summary.totalStudyHours}h</div>
            <p className="text-[11px] text-secondary mt-1">Turnstile time logged</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="inline-flex bg-muted p-1 rounded-xl border border-border self-start">
            <button
              type="button"
              onClick={() => setActiveView('calendar')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg motion-safe:transition-all cursor-pointer ${
                activeView === 'calendar' ? 'bg-card text-primary shadow-xs font-bold' : 'text-secondary hover:text-primary'
              }`}
            >
              📅 Month Calendar Grid
            </button>
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg motion-safe:transition-all cursor-pointer ${
                activeView === 'table' ? 'bg-card text-primary shadow-xs font-bold' : 'text-secondary hover:text-primary'
              }`}
            >
              📋 Punch Ledger Log
            </button>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-secondary mr-1">Filter:</span>
            {[
              { id: 'all', label: 'All Days' },
              { id: 'present', label: 'Present' },
              { id: 'absent', label: 'Absent' },
              { id: 'late', label: 'Late' },
            ].map((f) => {
              const isFActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id as 'all' | 'present' | 'absent' | 'late')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium motion-safe:transition-all cursor-pointer ${
                    isFActive ? 'bg-primary-subtle text-primary border border-primary font-bold' : 'bg-card text-secondary hover:text-primary border border-border'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <ManagerAttendanceMonthlyHistoryCalendarGrid
          activeView={activeView}
          dailyLogs={summary.dailyLogs}
          filteredLogs={filteredLogs}
          statusFilter={statusFilter}
        />

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <p className="text-xs text-secondary">
            Displaying full {summary.totalDays} days attendance audit record for{' '}
            <strong className="text-primary font-bold">{student.name}</strong> ({student.smartId}).
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-primary motion-safe:transition-colors cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
