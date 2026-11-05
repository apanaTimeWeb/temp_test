/** Canonical, module-owned routes for manager attendance navigation. */
const ROOT = '/frontend_manager/manager_attendance/attendance_daily' as const;

export const MANAGER_ATTENDANCE_DAILY_ROUTES = {
  root: ROOT,
  attendance: '/frontend_manager/manager_attendance/attendance_daily',
  absenteeReport: '/frontend_manager/manager_attendance/attendance_absentee_report',
  holidayCalendar: '/frontend_manager/manager_attendance/attendance_daily',
  qrScanner: '/frontend_manager/manager_attendance/attendance_qr_scanner',
} as const;

export const MANAGER_ATTENDANCE_DAILY_API = {
  LIST: '/api/v1/manager/attendance/daily' as const,
  MARK: '/api/v1/manager/attendance/daily/mark' as const,
  BULK_MARK: '/api/v1/manager/attendance/daily/bulk-mark' as const,
  EXPORT_CSV: '/api/v1/manager/attendance/daily/export-csv' as const,
} as const;
