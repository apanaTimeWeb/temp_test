import {
  MANAGER_ENGAGEMENT_DEMO_ABSENTEES,
  MANAGER_ENGAGEMENT_DEMO_ATTENDANCE,
  type ManagerAttendanceAbsenteeReportDemoAbsentee,
  type ManagerAttendanceAbsenteeReportDemoStudent,
} from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/config/manager_attendance_absentee_report.demo_data';

export type ManagerAttendanceAbsenteeReportSampleAttendanceStudent = ManagerAttendanceAbsenteeReportDemoStudent;
export type ManagerAttendanceAbsenteeReportSampleAbsentee = ManagerAttendanceAbsenteeReportDemoAbsentee;
export const MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE = MANAGER_ENGAGEMENT_DEMO_ATTENDANCE.map((record) => ({ ...record }));
export const MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES = MANAGER_ENGAGEMENT_DEMO_ABSENTEES.map((record) => ({ ...record }));
