'use client';
import ManagerAttendanceAbsenteeReportPage from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_views/ManagerAttendanceAbsenteeReportPage.tsx';
import type { ManagerAttendanceAbsenteeReportMainProps } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportMainTypes';

// RESPONSIBILITY: Preserve route query state at the module boundary and pass it to the feature view.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export function ManagerAttendanceAbsenteeReportMain(props: ManagerAttendanceAbsenteeReportMainProps) {
  return <ManagerAttendanceAbsenteeReportPage {...props} />;
}
