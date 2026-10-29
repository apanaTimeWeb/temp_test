'use client';
// RESPONSIBILITY: Render the attendance holiday calendar stats component within the components feature. It does not own backend persistence or cross-feature business logic.

import { useTranslations } from 'next-intl';
import type { Holiday } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/mocks/manager_attendance_holiday_calendar_fixtures/ManagerAttendanceHolidayCalendarHolidaySampleFixtures';

export function ManagerAttendanceHolidayCalendarStats({ holidays, monthLabel, thisMonthCount }: { holidays: readonly Holiday[]; monthLabel: string; thisMonthCount: number }) {
  const tManagerUi = useTranslations('manager.manager_holiday_calendar.ui');
  return (
    <div className="eng-stats-row">
      <div className="eng-stat-card"><div className="eng-stat-label">{tManagerUi('total_holidays')}</div><div className="eng-stat-value">{holidays.length}</div><div className="eng-stat-sub">{tManagerUi('this_year')}</div></div>
      <div className="eng-stat-card"><div className="eng-stat-label">{tManagerUi('this_month')}</div><div className="eng-stat-value">{thisMonthCount}</div><div className="eng-stat-sub">{monthLabel}</div></div>
      <div className="eng-stat-card"><div className="eng-stat-label">{tManagerUi('national')}</div><div className="eng-stat-value">{holidays.filter((holiday) => holiday.type === 'National').length}</div><div className="eng-stat-sub">{tManagerUi('national_holidays')}</div></div>
      <div className="eng-stat-card"><div className="eng-stat-label">{tManagerUi('religious')}</div><div className="eng-stat-value">{holidays.filter((holiday) => holiday.type === 'Religious').length}</div><div className="eng-stat-sub">{tManagerUi('religious_observances')}</div></div>
    </div>
  );
}
