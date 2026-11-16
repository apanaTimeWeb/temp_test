'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Download,
  Printer,
  X,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import type { Student } from '../../types/ManagerAttendanceDailyComponentTypes';
import {
  getStudentMonthlyAttendance,
  MONTH_OPTIONS,
  type StudentMonthlyAttendanceSummary,
} from '../../utils/ManagerAttendanceDailyMonthlyHistoryUtils';
import { toast } from 'sonner';

interface ManagerAttendanceDailyMonthlyRegisterProps {
  students: Student[];
  onOpenStudentHistory: (student: Student) => void;
}

export function ManagerAttendanceDailyMonthlyRegister({
  students,
  onOpenStudentHistory,
}: ManagerAttendanceDailyMonthlyRegisterProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [selectedShift, setSelectedShift] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const monthlySummaries: StudentMonthlyAttendanceSummary[] = useMemo(() => {
    return students.map((s) => getStudentMonthlyAttendance(s, selectedMonth));
  }, [students, selectedMonth]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return monthlySummaries.filter((item) => {
      const matchShift = selectedShift === 'All' || item.shift === selectedShift;
      const matchSearch =
        !q ||
        item.studentName.toLowerCase().includes(q) ||
        item.smartId.toLowerCase().includes(q) ||
        item.seat.toLowerCase().includes(q);
      return matchShift && matchSearch;
    });
  }, [monthlySummaries, selectedShift, searchQuery]);

  // Aggregated KPIs
  const totalEnrolled = filtered.length;
  const avgAttendance =
    totalEnrolled > 0
      ? Math.round(
          (filtered.reduce((acc, curr) => acc + curr.attendanceRate, 0) / totalEnrolled) * 10
        ) / 10
      : 0;
  const highAttendanceCount = filtered.filter((s) => s.attendanceRate >= 90).length;
  const lowAttendanceCount = filtered.filter((s) => s.attendanceRate < 75).length;
  const totalHoursLogged = filtered.reduce((acc, curr) => acc + curr.totalStudyHours, 0);

  const handlePrint = () => {
    window.print();
    toast.success('Monthly attendance register sent to printer / PDF');
  };

  const handleExportCsv = () => {
    const headers = [
      'Smart ID',
      'Student Name',
      'Shift',
      'Seat',
      'Month',
      'Attendance Rate',
      'Present Days',
      'Absent Days',
      'Late Days',
      'Total Working Days',
      'Total Study Hours',
    ];
    const rows = filtered.map((item) => [
      item.smartId,
      `"${item.studentName}"`,
      item.shift,
      `"${item.seat}"`,
      item.monthLabel,
      `${item.attendanceRate}%`,
      item.presentDays,
      item.absentDays,
      item.lateDays,
      item.totalWorkingDays,
      `${item.totalStudyHours} hrs`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `monthly_attendance_register_${selectedMonth}.csv`;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Monthly register CSV exported successfully');
  };

  return (
    <div className="space-y-5">
      {/* ── Control Bar: Month Selection, Shift Filter & Global Actions ── */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <Calendar size={16} className="text-primary shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-secondary mr-1 shrink-0">
              Select Month:
            </span>
            {MONTH_OPTIONS.map((m) => {
              const isSelected = selectedMonth === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMonth(m.id)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted text-secondary hover:text-primary border border-border'
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
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-2xs"
              title="Export Month-wise CSV"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-2xs"
              title="Print Monthly Register"
            >
              <Printer size={13} />
              <span>Print Register</span>
            </button>
          </div>
        </div>

        {/* Search & Shift Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search member name, smart ID, or seat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-muted border border-border rounded-xl text-xs text-primary outline-none focus:border-primary focus:bg-card transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer p-0.5"
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            <span className="text-xs font-semibold text-secondary shrink-0">Shift Filter:</span>
            {['All', 'Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'].map((s) => {
              const isShiftActive = selectedShift === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedShift(s)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isShiftActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card text-secondary hover:text-primary border border-border'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Monthly Summary KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
            Enrolled In Scope
          </span>
          <div className="mt-2 text-2xl font-black text-primary font-mono">{totalEnrolled}</div>
          <p className="text-[11px] text-secondary mt-0.5">Active members</p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            Avg Monthly Rate
          </span>
          <div className="mt-2 text-2xl font-black text-emerald-500 font-mono">{avgAttendance}%</div>
          <p className="text-[11px] text-secondary mt-0.5">Average turnstile score</p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            High Consistent (&ge;90%)
          </span>
          <div className="mt-2 text-2xl font-black text-indigo-400 font-mono">
            {highAttendanceCount}
          </div>
          <p className="text-[11px] text-secondary mt-0.5">Gold tier consistency</p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Dropout Risk (&lt;75%)
          </span>
          <div className="mt-2 text-2xl font-black text-rose-500 font-mono">
            {lowAttendanceCount}
          </div>
          <p className="text-[11px] text-secondary mt-0.5">Requires manager review</p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
            Study Hours Logged
          </span>
          <div className="mt-2 text-2xl font-black text-primary font-mono">{totalHoursLogged}h</div>
          <p className="text-[11px] text-secondary mt-0.5">Total hours in hall</p>
        </div>
      </div>

      {/* ── Month-wise Member Register Table ── */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted text-secondary uppercase tracking-wider text-[11px] border-b border-border">
                <th className="py-3 px-4 font-semibold">Student Name & ID</th>
                <th className="py-3 px-4 font-semibold">Shift & Seat</th>
                <th className="py-3 px-4 font-semibold min-w-[160px]">Monthly Attendance %</th>
                <th className="py-3 px-4 font-semibold text-center">Present</th>
                <th className="py-3 px-4 font-semibold text-center">Absent</th>
                <th className="py-3 px-4 font-semibold text-center">Late</th>
                <th className="py-3 px-4 font-semibold text-center">Study Hours</th>
                <th className="py-3 px-4 font-semibold text-right">Drilldown History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondary">
                    <p className="text-sm font-semibold text-primary">No member records match the filter.</p>
                    <p className="text-xs mt-1">Try selecting a different shift or clearing your search.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const studentObj = students.find((s) => s.id === item.studentId);
                  return (
                    <tr
                      key={item.studentId}
                      className="hover:bg-surface-hover transition-colors group cursor-pointer"
                      onClick={() => studentObj && onOpenStudentHistory(studentObj)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-primary block leading-tight group-hover:text-primary transition-colors">
                              {item.studentName}
                            </span>
                            <span className="font-mono text-[11px] text-secondary mt-0.5 block">
                              {item.smartId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-subtle text-primary border border-primary/20">
                            {item.shift} Shift
                          </span>
                          <span className="block text-[11px] text-secondary font-mono">
                            {item.seat}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span
                              className={`font-bold ${
                                item.attendanceRate >= 85
                                  ? 'text-emerald-500'
                                  : item.attendanceRate >= 70
                                  ? 'text-amber-500'
                                  : 'text-rose-500'
                              }`}
                            >
                              {item.attendanceRate}%
                            </span>
                            <span className="text-[11px] text-secondary">
                              {item.presentDays}/{item.totalWorkingDays} days
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border">
                            <div
                              className={`h-full rounded-full ${
                                item.attendanceRate >= 85
                                  ? 'bg-emerald-500'
                                  : item.attendanceRate >= 70
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, item.attendanceRate)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-500">
                        {item.presentDays}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-rose-500">
                        {item.absentDays}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-500">
                        {item.lateDays}
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-primary">
                        {item.totalStudyHours}h
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (studentObj) onOpenStudentHistory(studentObj);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary transition-all shadow-2xs cursor-pointer"
                          title={`Open ${item.studentName}'s month calendar view`}
                        >
                          <Calendar size={12} className="text-primary" />
                          <span>View Calendar</span>
                          <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-muted border-t border-border flex items-center justify-between text-xs text-secondary">
          <span>
            Showing {filtered.length} member records for {MONTH_OPTIONS.find((m) => m.id === selectedMonth)?.label}
          </span>
          <span className="font-semibold text-primary">Shift Scope: {selectedShift}</span>
        </div>
      </div>
    </div>
  );
}
