'use client';

// RESPONSIBILITY: Render the top-level Monthly Attendance History workspace and deep-link member modal drilldown.

import { ManagerAttendanceMonthlyHistoryMemberModal } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/components/manager_attendance_monthly_history_views/ManagerAttendanceMonthlyHistoryMemberModal';
import { ManagerAttendanceMonthlyHistoryRegister } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/components/manager_attendance_monthly_history_views/ManagerAttendanceMonthlyHistoryRegister';
import { MANAGER_ATTENDANCE_MONTHLY_HISTORY_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/config/manager_attendance_monthly_history.url_config';
import { MANAGER_ATTENDANCE_MONTHLY_HISTORY_SAMPLE_STUDENTS } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/hooks/ManagerAttendanceMonthlyHistoryDemoRepository';
import type { ManagerAttendanceMonthlyHistoryMainProps } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/types/ManagerAttendanceMonthlyHistoryMainTypes';
import type { Student } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/types/ManagerAttendanceMonthlyHistoryTypes';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const INIT_STUDENTS: Student[] = MANAGER_ATTENDANCE_MONTHLY_HISTORY_SAMPLE_STUDENTS.map((s) => ({ ...s }));

export default function ManagerAttendanceMonthlyHistoryPage({
  view,
  id,
  smartId,
  month,
}: ManagerAttendanceMonthlyHistoryMainProps) {
  const tManagerUi = useTranslations('manager.manager_attendance_monthly_history.ui');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(() => {
    if (!id && !smartId) return null;
    return (
      INIT_STUDENTS.find(
        (s) => (id && s.id === id) || (smartId && s.smartId.toLowerCase() === smartId.toLowerCase())
      ) ?? null
    );
  });

  useEffect(() => {
    if (!id && !smartId) return;
    const matched =
      INIT_STUDENTS.find(
        (s) => (id && s.id === id) || (smartId && s.smartId.toLowerCase() === smartId.toLowerCase())
      ) ?? null;
    if (matched) setSelectedStudent(matched);
  }, [id, smartId]);

  return (
    <div className="space-y-6 w-full max-w-full" data-route-view={view} data-route-id={id}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-subtle border border-border text-primary flex items-center justify-center shrink-0">
            <CalendarDays size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
              {tManagerUi('title')}
            </h1>
            <p className="text-xs sm:text-sm text-secondary mt-0.5">{tManagerUi('subtitle')}</p>
          </div>
        </div>

        <Link
          href={MANAGER_ATTENDANCE_MONTHLY_HISTORY_ROUTES.dailyAttendance}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary motion-safe:transition-colors self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>{tManagerUi('back_to_daily')}</span>
        </Link>
      </div>

      <ManagerAttendanceMonthlyHistoryRegister
        students={INIT_STUDENTS}
        initialMonth={month}
        onOpenStudentHistory={(student) => setSelectedStudent(student)}
      />

      <ManagerAttendanceMonthlyHistoryMemberModal
        isOpen={Boolean(selectedStudent)}
        student={selectedStudent}
        initialMonth={month}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
