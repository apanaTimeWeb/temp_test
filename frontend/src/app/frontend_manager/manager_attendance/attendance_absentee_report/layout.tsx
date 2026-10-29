import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Absentee Report | Library OS',
  description: 'Identify consecutive absences, drop-out risk alerts, and student attendance logs',
};

import '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_styles/ManagerAttendanceAbsenteeReportManager_absentee_report.css';
export default function EngagementModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="engagement-theme">{children}</div>;
}
