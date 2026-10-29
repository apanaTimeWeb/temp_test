/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerAttendanceDailySampleAttendanceStudent } from '@/app/frontend_manager/manager_attendance/attendance_daily/hooks/ManagerAttendanceDailyDemoRepository';
import type { ManagerAttendanceDailySearchParams } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyMainTypes';
import type { ReactNode } from 'react';

export type ManagerAttendanceDailyEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type Student = ManagerAttendanceDailySampleAttendanceStudent;

export type AttStatus = Student['status'];

export type AttendanceDailyStatus = ManagerAttendanceDailySampleAttendanceStudent['status'];

export type AttendanceDailyTimeField = 'inTime' | 'outTime';

export interface ManagerAttendanceDailyStudentRowProps {
  student: ManagerAttendanceDailySampleAttendanceStudent;
  onStatusChange: (id: string, status: AttendanceDailyStatus) => void;
  onFieldChange: (id: string, field: AttendanceDailyTimeField, value: string) => void;
}

export type ManagerAttendanceDailyPageProps = {
  searchParams?: Promise<ManagerAttendanceDailySearchParams>;
};

export type ManagerAttendanceDailyTimeField = 'inTime' | 'outTime';
