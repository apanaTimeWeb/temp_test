'use client';
import ManagerAttendanceDailyPage from '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_views/ManagerAttendanceDailyPage';
import type { ManagerAttendanceDailyMainProps } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyMainTypes';

// RESPONSIBILITY: Preserve route query state at the module boundary and pass it to the feature view.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export function ManagerAttendanceDailyMain(props: ManagerAttendanceDailyMainProps) {
  return <ManagerAttendanceDailyPage {...props} />;
}
