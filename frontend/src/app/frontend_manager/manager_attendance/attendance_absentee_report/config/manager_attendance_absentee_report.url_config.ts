/** Canonical, module-owned routes for manager attendance navigation. */
const ROOT = '/frontend_manager/manager_attendance/attendance_absentee_report' as const;

export const MANAGER_ATTENDANCE_ABSENTEE_REPORT_ROUTES = {
  root: ROOT,
  attendance: '/frontend_manager/manager_attendance/attendance_daily',
  absenteeReport: '/frontend_manager/manager_attendance/attendance_absentee_report',
  holidayCalendar: '/frontend_manager/manager_attendance/attendance_daily',
  qrScanner: '/frontend_manager/manager_attendance/attendance_qr_scanner',
} as const;

export const MANAGER_ATTENDANCE_ABSENTEE_REPORT_API = {
  LIST: '/api/v1/manager/attendance/absentee-report' as const,
  SEND_ALERTS: '/api/v1/manager/attendance/absentee-report/send-alerts' as const,
  EXPORT_CSV: '/api/v1/manager/attendance/absentee-report/export-csv' as const,
} as const;
