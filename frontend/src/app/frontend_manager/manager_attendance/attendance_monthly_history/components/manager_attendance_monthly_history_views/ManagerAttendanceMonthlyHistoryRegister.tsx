'use client';

// RESPONSIBILITY: Render the month-wise attendance register table with KPIs, toolbar, and student history trigger.

import { ManagerAttendanceMonthlyHistoryKpis } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/components/manager_attendance_monthly_history_views/ManagerAttendanceMonthlyHistoryKpis';
import { ManagerAttendanceMonthlyHistoryToolbar } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/components/manager_attendance_monthly_history_views/ManagerAttendanceMonthlyHistoryToolbar';
import { MONTH_OPTIONS } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/constants/ManagerAttendanceMonthlyHistoryConstants';
import type {
  Student,
  StudentMonthlyAttendanceSummary,
} from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/types/ManagerAttendanceMonthlyHistoryTypes';
import { exportManagerMonthlyRegisterCsv } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/utils/ManagerAttendanceMonthlyHistoryCsv';
import { getStudentMonthlyAttendance } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/utils/ManagerAttendanceMonthlyHistoryUtilities';
import { Calendar, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ManagerAttendanceMonthlyHistoryRegisterProps {
  students: Student[];
  onOpenStudentHistory: (student: Student) => void;
  initialMonth?: string;
}

export function ManagerAttendanceMonthlyHistoryRegister({
  students,
  onOpenStudentHistory,
  initialMonth,
}: ManagerAttendanceMonthlyHistoryRegisterProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth || '2026-11');
  const [selectedShift, setSelectedShift] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (initialMonth) setSelectedMonth(initialMonth);
  }, [initialMonth]);

  const monthlySummaries: StudentMonthlyAttendanceSummary[] = useMemo(
    () => students.map((s) => getStudentMonthlyAttendance(s, selectedMonth)),
    [students, selectedMonth]
  );

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

  const totalEnrolled = filtered.length;
  const avgAttendance =
    totalEnrolled > 0
      ? Math.round((filtered.reduce((acc, curr) => acc + curr.attendanceRate, 0) / totalEnrolled) * 10) / 10
      : 0;
  const highAttendanceCount = filtered.filter((s) => s.attendanceRate >= 90).length;
  const lowAttendanceCount = filtered.filter((s) => s.attendanceRate < 75).length;
  const totalHoursLogged = filtered.reduce((acc, curr) => acc + curr.totalStudyHours, 0);

  const handlePrint = () => {
    window.print();
    toast.success('Monthly attendance register sent to printer / PDF', {
      id: 'monthly-register-print',
    });
  };

  const handleExportCsv = () => {
    exportManagerMonthlyRegisterCsv(filtered, selectedMonth);
    toast.success('Monthly register CSV exported successfully', {
      id: 'monthly-register-export-csv',
    });
  };

  return (
    <div className="space-y-5">
      <ManagerAttendanceMonthlyHistoryToolbar
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedShift={selectedShift}
        onSelectShift={setSelectedShift}
        onExportCsv={handleExportCsv}
        onPrint={handlePrint}
      />

      <ManagerAttendanceMonthlyHistoryKpis
        totalEnrolled={totalEnrolled}
        avgAttendance={avgAttendance}
        highAttendanceCount={highAttendanceCount}
        lowAttendanceCount={lowAttendanceCount}
        totalHoursLogged={totalHoursLogged}
      />

      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted text-secondary uppercase tracking-wider text-[11px] border-b border-border">
                <th className="py-3 px-4 font-semibold">Student Name &amp; ID</th>
                <th className="py-3 px-4 font-semibold">Shift &amp; Seat</th>
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
                      className="hover:bg-surface-hover motion-safe:transition-colors group cursor-pointer"
                      onClick={() => studentObj && onOpenStudentHistory(studentObj)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-primary block leading-tight group-hover:text-primary motion-safe:transition-colors">
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
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-subtle text-primary border border-border">
                            {item.shift} Shift
                          </span>
                          <span className="block text-[11px] text-secondary font-mono">{item.seat}</span>
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary motion-safe:transition-all shadow-2xs cursor-pointer"
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
