/** Canonical, module-owned routes for manager attendance navigation. */
const ROOT = '/frontend_manager/manager_attendance/attendance_qr_scanner' as const;

export const MANAGER_ATTENDANCE_QR_SCANNER_ROUTES = {
  root: ROOT,
  attendance: '/frontend_manager/manager_attendance/attendance_daily',
  absenteeReport: '/frontend_manager/manager_attendance/attendance_absentee_report',
  holidayCalendar: '/frontend_manager/manager_attendance/attendance_daily',
  qrScanner: '/frontend_manager/manager_attendance/attendance_qr_scanner',
} as const;

export const MANAGER_ATTENDANCE_QR_SCANNER_API = {
  SCAN: '/api/v1/manager/attendance/qr-scanner/scan' as const,
  VERIFY: '/api/v1/manager/attendance/qr-scanner/verify' as const,
} as const;
