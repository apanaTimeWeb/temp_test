'use client';
// RESPONSIBILITY: Render the attendance daily student row component within the components feature. It does not own backend persistence or cross-feature business logic.
import { MANAGER_ATTENDANCE_DAILY_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_daily/config/manager_attendance_daily.url_config';
import type { ManagerAttendanceDailyStudentRowProps } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyComponentTypes';
import { AlertTriangle,Bell,Calendar,CheckCircle,Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

/** Single illustrative attendance row. All changes remain local preview state. */
export function ManagerAttendanceDailyStudentRow({ student, onStatusChange, onFieldChange, onSendAlert, onEvictOverstay, onViewHistory }: ManagerAttendanceDailyStudentRowProps) {
  const tManagerUi = useTranslations('manager.manager_attendance.ui');
  const isAlert = student.consecutiveAbsent >= 3;
  const isOverstay = Boolean(student.isOverstay);

  return (
    <div className={`eng-att-row${isAlert ? ' eng-att-row--alert' : ''}${isOverstay ? ' border-2 border-rose-500/80 bg-rose-500/10 dark:bg-rose-950/25' : ''}`}>
      <div className="eng-att-avatar" aria-hidden="true">{student.initials}</div>
      <div className="eng-att-info">
        <div className="eng-att-name flex items-center gap-2">
          <span>{student.name}</span>
          {isOverstay && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600 text-white motion-safe:animate-pulse">
              Overstay Alert
            </span>
          )}
        </div>
        <div className="eng-att-meta flex items-center gap-1.5 flex-wrap">
          <span>{student.smartId}</span>
          <span>·</span>
          <span>{({ Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Evening: tManagerUi('evening') } as Record<string, string>)[student.shift] ?? student.shift} {tManagerUi('shift_dbd79b')}</span>
          {student.seat && (
            <>
              <span>·</span>
              <span>{student.seat}</span>
            </>
          )}
          {onViewHistory ? (
            <>
              <span>·</span>
              <button
                type="button"
                onClick={() => onViewHistory(student)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer underline underline-offset-2 motion-safe:transition-colors ml-0.5"
                title={`View ${student.name}'s month-wise attendance history & calendar`}
              >
                <Calendar size={11} /> Monthly History
              </button>
            </>
          ) : (
            <>
              <span>·</span>
              <Link
                href={MANAGER_ATTENDANCE_DAILY_ROUTES.memberMonthlyHistory(student.smartId)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer underline underline-offset-2 motion-safe:transition-colors ml-0.5"
                title={`View ${student.name}'s month-wise attendance history & calendar`}
              >
                <Calendar size={11} /> Monthly History
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="eng-seg-group" role="group" aria-label={`${tManagerUi('attendance')} — ${student.name}`}>
        {(['present', 'absent', 'late'] as const).map((status) => (
          <button type="button" key={status} onClick={() => onStatusChange(student.id, status)} aria-pressed={student.status === status}
            className={`eng-seg-btn${student.status === status ? ` eng-seg-btn--${status}` : ''}`}>
            {status === 'present' ? <><CheckCircle size={12} aria-hidden="true"/> {tManagerUi('present')}</>
              : status === 'absent' ? tManagerUi('absent_e3967d')
              : <><Clock size={12} aria-hidden="true"/> {tManagerUi('late')}</>}
          </button>
        ))}
      </div>
      {(student.status === 'present' || student.status === 'late') && (
        <div className="eng-time-pair">
          <div className="eng-time-field">
            <label className="eng-label eng-label--no-margin" htmlFor={`eng-attendance-in-${student.id}`}>{tManagerUi('in')}</label>
            <input maxLength={30} id={`eng-attendance-in-${student.id}`} type="time" className="eng-time-input" value={student.inTime} aria-label={`${tManagerUi('in')} — ${student.name}`} onChange={(event) => onFieldChange(student.id, 'inTime', event.target.value)} />
          </div>
          {student.status === 'present' && (
            <div className="eng-time-field">
              <label className="eng-label eng-label--no-margin" htmlFor={`eng-attendance-out-${student.id}`}>{tManagerUi('out')}</label>
              <input maxLength={30} id={`eng-attendance-out-${student.id}`} type="time" className="eng-time-input" value={student.outTime} aria-label={`${tManagerUi('out')} — ${student.name}`} onChange={(event) => onFieldChange(student.id, 'outTime', event.target.value)} />
            </div>
          )}
        </div>
      )}

      {isOverstay && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          <AlertTriangle size={14} className="shrink-0 text-rose-500" />
          <span className="font-bold">
            Shift Ended at {student.shiftEnd || '14:00 (2:00 PM)'} (+{student.overstayMinutes || 90}m overstay)
          </span>
          {onEvictOverstay && (
            <button
              type="button"
              onClick={() => onEvictOverstay(student)}
              className="ml-auto px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs motion-safe:transition-all cursor-pointer whitespace-nowrap"
              title={`Notify ${student.name} to vacate seat for incoming shift`}
            >
              Evict / Vacate Seat
            </button>
          )}
        </div>
      )}

      {isAlert && (
        <div className="eng-att-alert">
          <span className="eng-badge eng-badge--warning">⚠️ {student.consecutiveAbsent} {tManagerUi('days_consecutive')}</span>
          {onSendAlert ? (
            <button
              type="button"
              onClick={() => onSendAlert(student)}
              title={`Send Attendance Notice for ${student.name}`}
              className="eng-btn eng-btn--ghost eng-btn--sm text-warning hover:bg-warning-bg cursor-pointer font-semibold"
            >
              <Bell size={12} aria-hidden="true"/> Send Notice
            </button>
          ) : (
            <button type="button" disabled title={tManagerUi('parent_alert_unavailable_verified_messaging_contract_not_500034')} className="eng-btn eng-btn--ghost eng-btn--sm cursor-not-allowed">
              <Bell size={12} aria-hidden="true"/> {tManagerUi('alert_unavailable')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
