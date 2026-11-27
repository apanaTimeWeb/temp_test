import {
  MANAGER_ENGAGEMENT_DEMO_ABSENTEES,
  MANAGER_ENGAGEMENT_DEMO_ATTENDANCE,
  type ManagerAttendanceDailyDemoAbsentee,
  type ManagerAttendanceDailyDemoStudent,
} from '@/app/frontend_manager/manager_attendance/attendance_daily/config/manager_attendance_daily.demo_data';

export type ManagerAttendanceDailySampleAttendanceStudent = ManagerAttendanceDailyDemoStudent;
export type ManagerAttendanceDailySampleAbsentee = ManagerAttendanceDailyDemoAbsentee;
export const MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE = MANAGER_ENGAGEMENT_DEMO_ATTENDANCE.map((record) => ({ ...record }));
export const MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES = MANAGER_ENGAGEMENT_DEMO_ABSENTEES.map((record) => ({ ...record }));
