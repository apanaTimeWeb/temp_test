/**
 * Canonical feature-local query-key factory.
 * Keys namespace client cache state only; they do not imply API endpoints,
 * payload schemas, persistence, or authorization contracts.
 */
export const MANAGER_ATTENDANCE_DAILY_QUERY_KEYS = {
  all: ['manager_attendance', 'attendance_daily'] as const,
  lists: () => ['manager_attendance', 'attendance_daily', 'list'] as const,
  list: (filters: Readonly<Record<string, string | number | boolean | undefined>>) =>
    ['manager_attendance', 'attendance_daily', 'list', filters] as const,
  details: () => ['manager_attendance', 'attendance_daily', 'detail'] as const,
  detail: (id: string) => ['manager_attendance', 'attendance_daily', 'detail', id] as const,
} as const;
