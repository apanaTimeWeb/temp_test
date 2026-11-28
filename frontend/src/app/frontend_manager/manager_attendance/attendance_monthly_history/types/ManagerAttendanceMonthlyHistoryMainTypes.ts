export type ManagerAttendanceMonthlyHistoryQueryValue = string | string[] | undefined;

export interface ManagerAttendanceMonthlyHistorySearchParams {
  view?: ManagerAttendanceMonthlyHistoryQueryValue;
  id?: ManagerAttendanceMonthlyHistoryQueryValue;
  smartId?: ManagerAttendanceMonthlyHistoryQueryValue;
  month?: ManagerAttendanceMonthlyHistoryQueryValue;
}

export interface ManagerAttendanceMonthlyHistoryMainProps {
  view?: string;
  id?: string;
  smartId?: string;
  month?: string;
}
