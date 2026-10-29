'use client';
// RESPONSIBILITY: Render the attendance daily student row component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the attendance daily student row component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { Bell, CheckCircle, Clock } from 'lucide-react';
import type { ManagerAttendanceDailyStudentRowProps } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyComponentTypes';






/** Single illustrative attendance row. All changes remain local preview state. */
export function ManagerAttendanceDailyStudentRow({ student, onStatusChange, onFieldChange }: ManagerAttendanceDailyStudentRowProps) {
  const tManagerUi = useTranslations('manager.manager_attendance.ui');
  const isAlert = student.consecutiveAbsent >= 3;

  return (
    <div className={`eng-att-row${isAlert ? ' eng-att-row--alert' : ''}`}>
      <div className="eng-att-avatar" aria-hidden="true">{student.initials}</div>
      <div className="eng-att-info">
        <div className="eng-att-name">{student.name}</div>
        <div className="eng-att-meta">{student.smartId} · {({ Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Evening: tManagerUi('evening') } as Record<string, string>)[student.shift] ?? student.shift} {tManagerUi('shift_dbd79b')}</div>
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
            <input id={`eng-attendance-in-${student.id}`} type="time" className="eng-time-input" value={student.inTime} aria-label={`${tManagerUi('in')} — ${student.name}`} onChange={(event) => onFieldChange(student.id, 'inTime', event.target.value)} />
          </div>
          {student.status === 'present' && (
            <div className="eng-time-field">
              <label className="eng-label eng-label--no-margin" htmlFor={`eng-attendance-out-${student.id}`}>{tManagerUi('out')}</label>
              <input id={`eng-attendance-out-${student.id}`} type="time" className="eng-time-input" value={student.outTime} aria-label={`${tManagerUi('out')} — ${student.name}`} onChange={(event) => onFieldChange(student.id, 'outTime', event.target.value)} />
            </div>
          )}
        </div>
      )}
      {isAlert && (
        <div className="eng-att-alert">
          <span className="eng-badge eng-badge--warning">⚠️ {student.consecutiveAbsent} {tManagerUi('days_consecutive')}</span>
          <button type="button" disabled title={tManagerUi('parent_alert_unavailable_verified_messaging_contract_not_500034')} className="eng-btn eng-btn--ghost eng-btn--sm cursor-not-allowed">
            <Bell size={12} aria-hidden="true"/> {tManagerUi('alert_unavailable')}
          </button>
        </div>
      )}
    </div>
  );
}
