
import type { ManagerAttendanceHolidayCalendarEmptyStateProps } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/types/ManagerAttendanceHolidayCalendarComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.


/** Accessible module-owned empty/status surface; child content preserves the existing localized message and icon. */
export function ManagerAttendanceHolidayCalendarEmptyState({ children, className = 'fin-empty-state', testId = 'manager_attendance_holiday_calendar-empty-state' }: ManagerAttendanceHolidayCalendarEmptyStateProps) {
  return <div role="status" aria-live="polite" data-testid={testId} className={className}>{children}</div>;
}
