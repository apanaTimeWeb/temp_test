'use client';

// RESPONSIBILITY: Preserve route query state at the module boundary and pass explicit typed props to the view.

import ManagerAttendanceMonthlyHistoryPage from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/components/manager_attendance_monthly_history_views/ManagerAttendanceMonthlyHistoryPage';
import type { ManagerAttendanceMonthlyHistoryMainProps } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/types/ManagerAttendanceMonthlyHistoryMainTypes';

export function ManagerAttendanceMonthlyHistoryMain(props: ManagerAttendanceMonthlyHistoryMainProps) {
  return (
    <ManagerAttendanceMonthlyHistoryPage
      view={props.view}
      id={props.id}
      smartId={props.smartId}
      month={props.month}
    />
  );
}
