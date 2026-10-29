import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Holiday Calendar | Library OS',
  description: 'Official library operational holidays, study recesses, and scheduled closures',
};

import '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/components/manager_attendance_holiday_calendar_styles/ManagerAttendanceHolidayCalendarManager_holiday_calendar.css';
export default function EngagementModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="engagement-theme">{children}</div>;
}
