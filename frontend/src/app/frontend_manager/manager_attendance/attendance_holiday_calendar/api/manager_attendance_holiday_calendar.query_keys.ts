/**
 * Canonical feature-local query-key factory.
 * Keys namespace client cache state only; they do not imply API endpoints,
 * payload schemas, persistence, or authorization contracts.
 */
export const MANAGER_ATTENDANCE_HOLIDAY_CALENDAR_QUERY_KEYS = {
  all: ['manager_attendance', 'attendance_holiday_calendar'] as const,
  lists: () => ['manager_attendance', 'attendance_holiday_calendar', 'list'] as const,
  list: (filters: Readonly<Record<string, string | number | boolean | undefined>>) =>
    ['manager_attendance', 'attendance_holiday_calendar', 'list', filters] as const,
  details: () => ['manager_attendance', 'attendance_holiday_calendar', 'detail'] as const,
  detail: (id: string) => ['manager_attendance', 'attendance_holiday_calendar', 'detail', id] as const,
} as const;
