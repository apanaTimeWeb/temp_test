import {
  MANAGER_ENGAGEMENT_DEMO_ABSENTEES,
  MANAGER_ENGAGEMENT_DEMO_ATTENDANCE,
  type ManagerAttendanceQrScannerDemoAbsentee,
  type ManagerAttendanceQrScannerDemoStudent,
} from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/config/manager_attendance_qr_scanner.demo_data';

export type ManagerAttendanceQrScannerSampleAttendanceStudent = ManagerAttendanceQrScannerDemoStudent;
export type ManagerAttendanceQrScannerSampleAbsentee = ManagerAttendanceQrScannerDemoAbsentee;
export const MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE = MANAGER_ENGAGEMENT_DEMO_ATTENDANCE.map((record) => ({ ...record }));
export const MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES = MANAGER_ENGAGEMENT_DEMO_ABSENTEES.map((record) => ({ ...record }));
