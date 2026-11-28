import type { ManagerAttendanceMonthlyHistoryDemoStudent } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/config/manager_attendance_monthly_history.demo_data';
import type { ManagerAttendanceMonthlyHistorySearchParams } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/types/ManagerAttendanceMonthlyHistoryMainTypes';

export type Student = ManagerAttendanceMonthlyHistoryDemoStudent;

export type AttendanceMonthlyHistoryMonthStatus = 'present' | 'absent' | 'late' | 'holiday';

export interface AttendanceMonthlyHistoryDayRecord {
  dayNumber: number;
  dateStr: string;
  dayOfWeek: string;
  isSunday: boolean;
  status: AttendanceMonthlyHistoryMonthStatus;
  inTime: string;
  outTime: string;
  studyHours: number;
  verificationMethod: string;
}

export interface StudentMonthlyAttendanceSummary {
  studentId: string;
  studentName: string;
  smartId: string;
  shift: string;
  seat: string;
  month: string;
  monthLabel: string;
  totalDays: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  holidayDays: number;
  attendanceRate: number;
  totalStudyHours: number;
  dailyLogs: AttendanceMonthlyHistoryDayRecord[];
}

export type ManagerAttendanceMonthlyHistoryPageProps = {
  searchParams?: Promise<ManagerAttendanceMonthlyHistorySearchParams>;
};
