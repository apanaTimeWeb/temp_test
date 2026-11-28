/** Canonical route and API contract for manager attendance monthly history. */
const ROOT = '/frontend_manager/manager_attendance/attendance_monthly_history' as const;

export const MANAGER_ATTENDANCE_MONTHLY_HISTORY_ROUTES = {
  root: ROOT,
  dailyAttendance: '/frontend_manager/manager_attendance/attendance_daily',
  memberHistory: (smartId: string, month?: string) => {
    const params = new URLSearchParams({ smartId });
    if (month) params.set('month', month);
    return `${ROOT}?${params.toString()}` as const;
  },
} as const;

export const MANAGER_ATTENDANCE_MONTHLY_HISTORY_API = {
  LIST: '/api/v1/manager/attendance/monthly-history' as const,
  MEMBER_DETAIL: (id: string) => `/api/v1/manager/attendance/monthly-history/${encodeURIComponent(id)}` as const,
  EXPORT_CSV: '/api/v1/manager/attendance/monthly-history/export-csv' as const,
} as const;
