/** Canonical, module-owned routes for manager attendance navigation. */
const ROOT = '/frontend_manager/manager_attendance/attendance_daily' as const;

export const MANAGER_ATTENDANCE_DAILY_ROUTES = {
  root: ROOT,
  attendance: '/frontend_manager/manager_attendance/attendance_daily',
  absenteeReport: '/frontend_manager/manager_attendance/attendance_absentee_report',
  holidayCalendar: '/frontend_manager/manager_attendance/attendance_holiday_calendar',
  qrScanner: '/frontend_manager/manager_attendance/attendance_qr_scanner',
} as const;

/** No additional external API contract is declared by this route-config repair. */
export const MANAGER_ATTENDANCE_DAILY_API = {} as const;
