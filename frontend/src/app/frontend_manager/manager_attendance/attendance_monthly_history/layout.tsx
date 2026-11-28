import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_attendance/attendance_monthly_history/components/manager_attendance_monthly_history_styles/ManagerAttendanceMonthlyHistoryStyles.css';

export const metadata: Metadata = {
  title: 'Monthly Attendance History | Library OS',
  description: 'Review month-wise student attendance registers, study hours, and individual calendar logs',
};

export default function MonthlyAttendanceHistoryLayout({ children }: { children: React.ReactNode }) {
  return <div className="engagement-theme">{children}</div>;
}
