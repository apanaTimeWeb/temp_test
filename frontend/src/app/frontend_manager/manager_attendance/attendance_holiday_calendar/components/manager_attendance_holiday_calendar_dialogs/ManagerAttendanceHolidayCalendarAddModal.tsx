'use client';
// RESPONSIBILITY: Render the feature dialog/modal and its local interaction boundary for components. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { useManagerHolidayCalendarDialogFocus } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/hooks/ManagerAttendanceHolidayCalendarDialogFocus';

import { CalendarDays, X } from 'lucide-react';
import type { ManagerAttendanceHolidayCalendarAddModalProps } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/types/ManagerAttendanceHolidayCalendarTypes';

export function ManagerAttendanceHolidayCalendarAddModal({ show, form, onChange, onClose, onAdd }: ManagerAttendanceHolidayCalendarAddModalProps) {
  const tManagerUi = useTranslations('manager.manager_holiday_calendar.ui');
  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerHolidayCalendarDialogFocus(dialogRef, onClose, show);
  if (!show) return null;
  return (
<div className="eng-overlay">
          <div ref={dialogRef} tabIndex={-1} className="eng-modal eng-modal--sm" role="dialog" aria-modal="true" aria-labelledby="eng-add-holiday-title">
            <button type="button" onClick={onClose} className="eng-modal-close" aria-label={tManagerUi('close_add_holiday')}><X size={16}/></button>
            <h2 id="eng-add-holiday-title" className="eng-modal-title">{tManagerUi('add_holiday_57804b')}</h2>
            <p className="eng-modal-sub">{tManagerUi('mark_a_library_closure_or_holiday_in_the_calendar')}</p>

            <div className="eng-field">
              <label className="eng-label" htmlFor="eng-holiday-date">{tManagerUi('date')} <span className="eng-required">*</span></label>
              <input id="eng-holiday-date" type="date" className="eng-input" value={form.date}
                onChange={e => onChange({ ...form, date: e.target.value })} />
            </div>
            <div className="eng-field">
              <label className="eng-label" htmlFor="eng-holiday-name">{tManagerUi('event_name')} <span className="eng-required">*</span></label>
              <input id="eng-holiday-name" className="eng-input" placeholder={tManagerUi('e_g_diwali')} value={form.name}
                onChange={e => onChange({ ...form, name: e.target.value })} />
            </div>
            <div className="eng-field">
              <label className="eng-label" htmlFor="eng-holiday-type">{tManagerUi('type')}</label>
              <select id="eng-holiday-type" className="eng-select" value={form.type}
                onChange={e => onChange({ ...form, type: e.target.value })}>
                <option value="National">{tManagerUi('national')}</option>
                <option value="Religious">{tManagerUi('religious')}</option>
                <option value="Library">{tManagerUi('library')}</option>
              </select>
            </div>

            <div className="eng-modal-footer">
              <button type="button" onClick={onClose} className="eng-btn eng-btn--ghost">{tManagerUi('cancel')}</button>
              <button type="button" onClick={onAdd} disabled title={tManagerUi('holiday_changes_unavailable_host_mutation_contract_not_s_66076e')}
                className="eng-btn eng-btn--primary cursor-not-allowed">
                <CalendarDays size={14}/> {tManagerUi('add_holiday')}
              </button>
            </div>
          </div>
        </div>
  );
}
