import {
  MANAGER_ATTENDANCE_MONTHLY_HISTORY_DEMO_STUDENTS,
  type ManagerAttendanceMonthlyHistoryDemoStudent,
} from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/config/manager_attendance_monthly_history.demo_data';

export type { ManagerAttendanceMonthlyHistoryDemoStudent };

export const MANAGER_ATTENDANCE_MONTHLY_HISTORY_SAMPLE_STUDENTS =
  MANAGER_ATTENDANCE_MONTHLY_HISTORY_DEMO_STUDENTS.map((record) => ({ ...record }));
