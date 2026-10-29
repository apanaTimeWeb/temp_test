'use client';
import type { ManagerAttendanceHolidayCalendarMainProps } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/types/ManagerAttendanceHolidayCalendarMainTypes';
import { MANAGER_ENGAGEMENT_SAMPLE_HOLIDAYS, type Holiday } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/mocks/manager_attendance_holiday_calendar_fixtures/ManagerAttendanceHolidayCalendarHolidaySampleFixtures';
import { ManagerAttendanceHolidayCalendarStats } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/components/manager_attendance_holiday_calendar_sections/ManagerAttendanceHolidayCalendarStats.tsx';
import { ManagerAttendanceHolidayCalendarHolidayLists } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/components/manager_attendance_holiday_calendar_views/ManagerAttendanceHolidayCalendarHolidayLists.tsx';
import { useLocale, useTranslations } from 'next-intl';
import { ManagerAttendanceHolidayCalendarAddModal } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/components/manager_attendance_holiday_calendar_dialogs/ManagerAttendanceHolidayCalendarAddModal';

import { MANAGER_ATTENDANCE_HOLIDAY_CALENDAR_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/config/manager_attendance_holiday_calendar.url_config';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';



const INIT_HOLIDAYS = MANAGER_ENGAGEMENT_SAMPLE_HOLIDAYS;

function toLocalDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDays(y:number, m:number) { return new Date(y, m+1, 0).getDate(); }
function getFirstDayIdx(y:number, m:number) { const d=new Date(y,m,1).getDay(); return d===0?6:d-1; }


function parseHolidayLocalDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return new Date(Number.NaN);
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : new Date(Number.NaN);
}




// RESPONSIBILITY: Render the attendance_holiday_calendar feature view while preserving supported deep-link query state.
// DATA FLOW: Route searchParams -> Main props -> this view's route context.
export default function ManagerAttendanceHolidayCalendarPage({ view, id, name, phone, smartId }: ManagerAttendanceHolidayCalendarMainProps) {
  const tManagerUi = useTranslations('manager.manager_holiday_calendar.ui');
  const locale = useLocale();
  const weekDays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 1 + index)));
  const now = new Date();
  const [year, setYear]         = useState(now.getFullYear());
  const [month, setMonth]       = useState(now.getMonth());
  const [showAddDraft, setShowAddDraft] = useState(false);
  const [holidayDraft, setHolidayDraft] = useState({ date: '', name: '', type: 'National' });
  const holidays = INIT_HOLIDAYS;

  const prevMonth = () => month===0 ? (setYear(y=>y-1), setMonth(11)) : setMonth(m=>m-1);
  const nextMonth = () => month===11 ? (setYear(y=>y+1), setMonth(0))  : setMonth(m=>m+1);

  const daysInMonth = getDays(year, month);
  const firstDayIdx = getFirstDayIdx(year, month);
  const todayStr = toLocalDateInputValue(now);

  const holidayMap = new Map<number, Holiday>();
  holidays.forEach(h => {
    const d = parseHolidayLocalDate(h.date);
    if (!Number.isNaN(d.getTime()) && d.getFullYear()===year && d.getMonth()===month) holidayMap.set(d.getDate(), h);
  });

  const cells: (number|null)[] = [
    ...Array(firstDayIdx).fill(null),
    ...Array.from({length:daysInMonth}, (_,i)=>i+1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));

  const thisMonthHolidays = holidays
    .filter(h => { const d=parseHolidayLocalDate(h.date); return !Number.isNaN(d.getTime()) && d.getFullYear()===year && d.getMonth()===month; })
    .sort((a,b) => a.date.localeCompare(b.date));

  return (
    <div className="eng-page" data-route-view={view} data-route-id={id} data-route-name={name} data-route-phone={phone} data-route-smart-id={smartId}>
      {/* ── Breadcrumb ── */}
      <div className="eng-breadcrumb">
        <Link href={MANAGER_ATTENDANCE_HOLIDAY_CALENDAR_ROUTES.attendance}>{tManagerUi('engagement')}</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep"/>
        <span>{tManagerUi('holiday_calendar')}</span>
      </div>

      {/* ── Page Header ── */}
      <div className="eng-page-header">
        <div className="eng-page-title-row">
          <div>
            <h1 className="eng-page-title">{tManagerUi('holiday_calendar_9ae63e')}</h1>
            <p className="eng-page-subtitle">{tManagerUi('review_the_sample_holiday_calendar_changes_are_unavailab_0e7cf0')}</p>
            <p className="eng-input-hint eng-text-warning" data-testid="manager-engagement-holiday-contract-warning" role="status">{tManagerUi('sample_data_only_adding_or_deleting_holidays_does_not_pe_5376fc')}</p>
          </div>
          <div className="eng-page-actions">
            <button type="button" onClick={() => setShowAddDraft(true)} title={tManagerUi('holiday_draft_preview_only')} className="eng-btn eng-btn--primary">
              {tManagerUi('preview_add_holiday_draft')}
            </button>
          </div>
        </div>
      </div>

      <ManagerAttendanceHolidayCalendarStats holidays={holidays} monthLabel={monthLabel} thisMonthCount={thisMonthHolidays.length} />
      <ManagerAttendanceHolidayCalendarAddModal show={showAddDraft} form={holidayDraft} onChange={setHolidayDraft} onClose={() => setShowAddDraft(false)} onAdd={() => setShowAddDraft(false)} />

      {/* ── Two-column Layout ── */}
      <div className="eng-cal-layout">

        {/* Left: Calendar Grid */}
        <div className="eng-cal-main">
          <div className="eng-card">
            {/* Month navigation */}
            <div className="eng-cal-nav">
              <button type="button" onClick={prevMonth} aria-label={tManagerUi('previous_month')} className="eng-btn eng-btn--icon">
                <ChevronLeft size={18}/>
              </button>
              <span className="eng-cal-month">{monthLabel}</span>
              <button type="button" onClick={nextMonth} aria-label={tManagerUi('next_month')} className="eng-btn eng-btn--icon">
                <ChevronRight size={18}/>
              </button>
            </div>

            {/* Day headers */}
            <div className="eng-cal-grid eng-cal-mb-2">
              {weekDays.map(d => (
                <div key={d} className="eng-cal-day-hdr">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="eng-cal-grid">
              {cells.map((day, position) => {
                if (!day) return <div key={`calendar-empty-${year}-${month}-${position}`} className="eng-cal-cell eng-cal-cell--empty"/>;
                const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const isToday   = ds === todayStr;
                const hol       = holidayMap.get(day);
                return (
                  <div key={`calendar-day-${ds}`}
                    className={[
                      'eng-cal-cell',
                      isToday  ? 'eng-cal-cell--today'   : '',
                      hol      ? 'eng-cal-cell--holiday' : '',
                    ].filter(Boolean).join(' ')}
                    title={hol?.name}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="eng-cal-legend">
              <div className="eng-cal-legend-item">
                <div className="eng-cal-dot eng-cal-dot--holiday"/>
                <span>{tManagerUi('holiday')}</span>
              </div>
              <div className="eng-cal-legend-item">
                <div className="eng-cal-dot eng-cal-dot--today"/>
                <span>{tManagerUi('today')}</span>
              </div>
            </div>
          </div>
        </div>

        <ManagerAttendanceHolidayCalendarHolidayLists holidays={holidays} thisMonthHolidays={thisMonthHolidays} monthLabel={monthLabel} />

      </div>
    </div>
  );
}
