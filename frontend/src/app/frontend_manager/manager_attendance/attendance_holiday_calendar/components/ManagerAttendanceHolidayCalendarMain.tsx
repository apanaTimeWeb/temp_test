'use client';
import ManagerAttendanceHolidayCalendarPage from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/components/manager_attendance_holiday_calendar_views/ManagerAttendanceHolidayCalendarPage';
import type { ManagerAttendanceHolidayCalendarMainProps } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/types/ManagerAttendanceHolidayCalendarMainTypes';

// RESPONSIBILITY: Preserve route query state at the module boundary and pass it to the feature view.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export function ManagerAttendanceHolidayCalendarMain(props: ManagerAttendanceHolidayCalendarMainProps) {
  return <ManagerAttendanceHolidayCalendarPage {...props} />;
}
