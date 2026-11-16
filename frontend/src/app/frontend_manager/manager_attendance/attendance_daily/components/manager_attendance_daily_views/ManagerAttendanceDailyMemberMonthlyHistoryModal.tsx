'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  Printer,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Armchair,
  Timer,
} from 'lucide-react';
import type { Student } from '../../types/ManagerAttendanceDailyComponentTypes';
import {
  getStudentMonthlyAttendance,
  MONTH_OPTIONS,
  type AttendanceDailyMonthStatus,
} from '../../utils/ManagerAttendanceDailyMonthlyHistoryUtils';
import { toast } from 'sonner';

export interface ManagerAttendanceDailyMemberMonthlyHistoryModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
}

export function ManagerAttendanceDailyMemberMonthlyHistoryModal({
  isOpen,
  student,
  onClose,
}: ManagerAttendanceDailyMemberMonthlyHistoryModalProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [activeView, setActiveView] = useState<'calendar' | 'table'>('calendar');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');

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
    toast.success(`Monthly attendance slip sent to printer for ${student.name}`);
  };

  const handleExportCsv = () => {
    const headers = ['Day', 'Date', 'Day of Week', 'Status', 'In Time', 'Out Time', 'Study Hours', 'Punch Method'];
    const rows = summary.dailyLogs.map((log) => [
      log.dayNumber,
      log.dateStr,
      log.dayOfWeek,
      log.status.toUpperCase(),
      log.inTime,
      log.outTime,
      `${log.studyHours} hrs`,
      `"${log.verificationMethod}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `monthly_attendance_${student.smartId}_${selectedMonth}.csv`;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${summary.monthLabel} attendance register for ${student.name}`);
  };

  const statusBadge = (status: AttendanceDailyMonthStatus) => {
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
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-monthly-history-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
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
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-primary-subtle text-primary border border-primary/20">
                  {student.shift} Shift
                </span>
                {student.seat && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                    <Armchair size={11} /> {student.seat}
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary mt-1 flex items-center gap-2 flex-wrap">
                <span>Month-wise Member Attendance Record & Turnstile Log</span>
                <span>•</span>
                <span className="font-semibold text-primary">{summary.monthLabel}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Month Selector Pills & Action Buttons */}
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
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-2xs"
              title="Print Monthly Attendance Slip"
            >
              <Printer size={13} />
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-2xs"
              title="Export Month CSV"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Attendance Rate */}
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
                  className={`h-full rounded-full ${
                    summary.attendanceRate >= 85
                      ? 'bg-emerald-500'
                      : summary.attendanceRate >= 70
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, summary.attendanceRate)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Present Days */}
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Present Days</span>
            <div className="mt-2 text-2xl font-black text-emerald-500 font-mono">
              {summary.presentDays}{' '}
              <span className="text-xs font-normal text-secondary">/ {summary.totalWorkingDays}</span>
            </div>
            <p className="text-[11px] text-secondary mt-1">Full shift attended</p>
          </div>

          {/* Absent Days */}
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Absent Days</span>
            <div className="mt-2 text-2xl font-black text-rose-500 font-mono">{summary.absentDays}</div>
            <p className="text-[11px] text-secondary mt-1">Leaves & unexcused</p>
          </div>

          {/* Late Days */}
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Late Arrivals</span>
            <div className="mt-2 text-2xl font-black text-amber-500 font-mono">{summary.lateDays}</div>
            <p className="text-[11px] text-secondary mt-1">&gt;30 min delay</p>
          </div>

          {/* Study Hours */}
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Total Hours</span>
            <div className="mt-2 text-2xl font-black text-indigo-400 font-mono">{summary.totalStudyHours}h</div>
            <p className="text-[11px] text-secondary mt-1">Turnstile time logged</p>
          </div>
        </div>

        {/* View Switcher & Status Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="inline-flex bg-muted p-1 rounded-xl border border-border self-start">
            <button
              type="button"
              onClick={() => setActiveView('calendar')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeView === 'calendar'
                  ? 'bg-card text-primary shadow-xs font-bold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              📅 Month Calendar Grid
            </button>
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeView === 'table'
                  ? 'bg-card text-primary shadow-xs font-bold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              📋 Punch Ledger Log
            </button>
          </div>

          {/* Status Filter Pills */}
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
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    isFActive
                      ? 'bg-primary-subtle text-primary border border-primary/30 font-bold'
                      : 'bg-card text-secondary hover:text-primary border border-border'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* View 1: Calendar Grid View */}
        {activeView === 'calendar' ? (
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 p-3 sm:p-4 bg-muted/40">
              {summary.dailyLogs.map((log) => {
                const isFilteredOut = statusFilter !== 'all' && log.status !== statusFilter;
                return (
                  <div
                    key={log.dayNumber}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-1.5 ${
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
                      <span className="font-mono text-xs font-bold text-primary">
                        Day {log.dayNumber}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-secondary">
                        {log.dayOfWeek}
                      </span>
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
        ) : (
          /* View 2: Detailed Punch Table Log */
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
                  <tr key={log.dayNumber} className="hover:bg-surface-hover transition-colors">
                    <td className="py-2.5 px-3 font-medium text-primary">
                      {log.dateStr}{' '}
                      <span className="text-secondary font-normal font-mono">({log.dayOfWeek})</span>
                    </td>
                    <td className="py-2.5 px-3">{statusBadge(log.status)}</td>
                    <td className="py-2.5 px-3 font-mono text-primary">{log.inTime}</td>
                    <td className="py-2.5 px-3 font-mono text-primary">{log.outTime}</td>
                    <td className="py-2.5 px-3 font-mono text-primary">
                      {log.studyHours > 0 ? `${log.studyHours} hrs` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-secondary text-[11px]">{log.verificationMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info & close button */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <p className="text-xs text-secondary">
            Displaying full {summary.totalDays} days attendance audit record for{' '}
            <strong className="text-primary font-bold">{student.name}</strong> ({student.smartId}).
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-primary transition-colors cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
