'use client';
// RESPONSIBILITY: Render the attendance holiday calendar holiday lists component within the components feature. It does not own backend persistence or cross-feature business logic.

import { useLocale, useTranslations } from 'next-intl';
import type { Holiday } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/mocks/manager_attendance_holiday_calendar_fixtures/ManagerAttendanceHolidayCalendarHolidaySampleFixtures';
import { ManagerAttendanceHolidayCalendarEmptyState } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/components/manager_attendance_holiday_calendar_empty_states/ManagerAttendanceHolidayCalendarEmptyState';

const TYPE_BADGE: Record<string, string> = { National: 'eng-badge--primary', Religious: 'eng-badge--warning', Library: 'eng-badge--info' };

function formatKnownIsoCalendarDate(value: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function ManagerAttendanceHolidayCalendarHolidayLists({ holidays, thisMonthHolidays, monthLabel }: { holidays: readonly Holiday[]; thisMonthHolidays: readonly Holiday[]; monthLabel: string }) {
  const tManagerUi = useTranslations('manager.manager_holiday_calendar.ui');
  const locale = useLocale();
  const typeLabels: Record<string, string> = { National: tManagerUi('national'), Religious: tManagerUi('religious'), Library: tManagerUi('library') };
  const unavailableTitle = tManagerUi('holiday_changes_unavailable_host_mutation_contract_not_s_66076e');
  const deleteLabel = tManagerUi('delete_holiday_unavailable');
  return (
    <div className="eng-cal-panel">
      <div className="eng-card">
        <div className="eng-holiday-header">
          <div><div className="eng-card-title">{monthLabel} {tManagerUi('holidays')}</div><div className="eng-card-desc">{thisMonthHolidays.length} {tManagerUi('this_month_0bd41b')}</div></div>
          <button type="button" disabled title={unavailableTitle} className="eng-btn eng-btn--primary eng-btn--sm cursor-not-allowed">{tManagerUi('add_unavailable')}</button>
        </div>
        {thisMonthHolidays.length === 0 ? <ManagerAttendanceHolidayCalendarEmptyState className="eng-holiday-empty">{tManagerUi('no_holidays_in')} {monthLabel} 🎉</ManagerAttendanceHolidayCalendarEmptyState> : (
          <div className="eng-holiday-list">
            {thisMonthHolidays.map((holiday) => (
              <div key={holiday.id} className="eng-holiday-item">
                <div><div className="eng-holiday-name">{holiday.name}</div><div className="eng-holiday-date-row"><div className="eng-holiday-date">{formatKnownIsoCalendarDate(holiday.date, locale)}</div><span className={`eng-badge ${TYPE_BADGE[holiday.type] || 'eng-badge--ghost'} eng-badge--micro`}>{typeLabels[holiday.type] ?? holiday.type}</span></div></div>
                <button type="button" disabled title={unavailableTitle} aria-label={deleteLabel} className="eng-btn eng-btn--icon eng-btn--icon-danger cursor-not-allowed">{tManagerUi('delete_unavailable')}</button>
              </div>
            ))}
          </div>
        )}
        {holidays.length > 0 && <><div className="eng-divider" /><div className="eng-card-title--sm">{tManagerUi('all_holidays')}{holidays.length})</div><div className="eng-holiday-list">{[...holidays].sort((a, b) => a.date.localeCompare(b.date)).map((holiday) => (
          <div key={holiday.id} className="eng-holiday-item"><div><div className="eng-holiday-name--sm">{holiday.name}</div><div className="eng-holiday-date">{formatKnownIsoCalendarDate(holiday.date, locale)}</div></div><button type="button" disabled title={unavailableTitle} aria-label={deleteLabel} className="eng-btn eng-btn--icon eng-btn--icon-danger cursor-not-allowed">{tManagerUi('delete_unavailable')}</button></div>
        ))}</div></>}
      </div>
    </div>
  );
}
