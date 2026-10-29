/**
 * Canonical feature-local query-key factory.
 * Keys namespace client cache state only; they do not imply API endpoints,
 * payload schemas, persistence, or authorization contracts.
 */
export const MANAGER_ATTENDANCE_QR_SCANNER_QUERY_KEYS = {
  all: ['manager_attendance', 'attendance_qr_scanner'] as const,
  lists: () => ['manager_attendance', 'attendance_qr_scanner', 'list'] as const,
  list: (filters: Readonly<Record<string, string | number | boolean | undefined>>) =>
    ['manager_attendance', 'attendance_qr_scanner', 'list', filters] as const,
  details: () => ['manager_attendance', 'attendance_qr_scanner', 'detail'] as const,
  detail: (id: string) => ['manager_attendance', 'attendance_qr_scanner', 'detail', id] as const,
} as const;
