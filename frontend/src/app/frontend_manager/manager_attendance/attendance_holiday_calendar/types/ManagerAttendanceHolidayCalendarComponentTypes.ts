/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerAttendanceHolidayCalendarSearchParams } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/types/ManagerAttendanceHolidayCalendarMainTypes';
import type { ReactNode } from 'react';

export type ManagerAttendanceHolidayCalendarEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerAttendanceHolidayCalendarPageProps = {
  searchParams?: Promise<ManagerAttendanceHolidayCalendarSearchParams>;
};
