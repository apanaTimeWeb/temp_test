import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Attendance | Library OS',
  description: 'Track real-time student check-ins, check-outs, shifts, and attendance registry',
};

import '@/app/frontend_manager/manager_attendance/attendance_daily/components/manager_attendance_daily_styles/ManagerAttendanceDailyManager_attendance.css';
export default function EngagementModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="engagement-theme">{children}</div>;
}
