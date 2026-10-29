'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerSeatsShiftDraftSchema } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/schemas/ManagerShiftsManagementDraftSchemas';
import { useManagerShiftsDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/hooks/ManagerShiftsManagementDialogFocus';
import { Plus, Edit, PowerOff, Zap, ChevronDown } from 'lucide-react';
import { MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SHIFTS, type ManagerShiftsManagementSampleShift as Shift } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/mocks/manager_shifts_management_fixtures/ManagerShiftsManagementSampleFixtures';
import { ManagerShiftsManagementEmptyState } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/components/manager_shifts_management_empty_states/ManagerShiftsManagementEmptyState';


const EMPTY_FORM = { name: '', startTime: '', endTime: '', active: true };

export function ManagerShiftsManagementShiftManagementClient() {
  const tManagerUi = useTranslations('manager.manager_shifts.ui');
  const displayShiftName = (value: string) => ({ Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Evening: tManagerUi('evening'), Night: tManagerUi('night'), 'Full Day': tManagerUi('full_day') } as Record<string, string>)[value] ?? value;
  const shifts = MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SHIFTS;
  const [showModal, setShowModal]       = useState(false);
  const [editShift, setEditShift]       = useState<Shift | null>(null);
  const { watch, setValue, reset, clearErrors, formState } = useForm({ resolver: zodResolver(managerSeatsShiftDraftSchema), defaultValues: EMPTY_FORM, mode: 'onChange' });
  const form = watch();
  const errors = formState.errors;
  const [deactivateTarget, setDeactivateTarget] = useState<Shift | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const activeDialog = showModal ? 'edit-shift' : deactivateTarget ? 'deactivate-shift' : false;
  useManagerShiftsDialogFocus(dialogRef, () => { setShowModal(false); setDeactivateTarget(null); }, activeDialog);

  function openAdd() {
    setEditShift(null);
    reset(EMPTY_FORM);
    clearErrors();
    setShowModal(true);
  }

  function openEdit(shift: Shift) {
    setEditShift(shift);
    reset({ name: shift.name, startTime: shift.startTime, endTime: shift.endTime, active: shift.active });
    clearErrors();
    setShowModal(true);
  }

  

  return (
    <>
      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">{tManagerUi('shifts')}</h1>
            <p className="ss-page-subtitle">{tManagerUi('define_active_hours_and_availability_windows')}</p>
            <p className="ss-page-subtitle" role="status" data-testid="manager-seats-contract-warning">{tManagerUi('sample_data_only_writes_are_disabled_until_the_verified_8ca5b6')}</p>
          </div>
          <button type="button" className="ss-btn-primary ss-btn-start" onClick={openAdd}>
            <Plus size={16} />{tManagerUi('add_shift_db4f97')}
          </button>
        </div>

        {shifts.length === 0 ? (
          <ManagerShiftsManagementEmptyState className="ss-empty-state">
            <p className="ss-empty-state__icon">🕐</p>
            <p className="ss-empty-state__title">{tManagerUi('no_shifts_defined')}</p>
            <p className="ss-empty-state__sub">{tManagerUi('use_setup_wizard_or_add_manually')}</p>
            <button type="button" className="ss-btn-primary" onClick={openAdd}><Plus size={15} />{tManagerUi('add_shift_db4f97')}</button>
          </ManagerShiftsManagementEmptyState>
        ) : (
          <div className="ss-shift-cards-grid">
            {shifts.map(shift => (
              <div key={shift.id} className={`ss-shift-card${!shift.active ? ' ss-shift-card--inactive' : ''}`}>
                <div className="ss-shift-card__body">
                  <div className="ss-shift-card__header">
                    <h3 className="ss-section-heading">{displayShiftName(shift.name)}</h3>
                    <span className={`ss-badge ${shift.active ? 'ss-badge--success' : 'ss-badge--inactive'}`}>
                      {shift.active ? tManagerUi('active') : tManagerUi('inactive')}
                    </span>
                  </div>

                  <div className="ss-shift-card__time-section">
                    <p className={`ss-shift-time${!shift.active ? ' ss-shift-time--inactive' : ''}`}>
                      {shift.startTime} → {shift.endTime}
                    </p>
                  </div>

                  <div className="ss-shift-occupancy">
                    <div>
                      <p className="ss-shift-occupancy__label">{tManagerUi('occupancy')}</p>
                      <p className="ss-shift-occupancy__value">
                        {shift.occupancy} {tManagerUi('students')}
                        <span className="ss-shift-occupancy__fraction"> / {shift.capacity}</span>
                      </p>
                    </div>
                    <div className="ss-occupancy-bar">
                      <div className={`ss-occupancy-bar__fill ss-progress-w-${Math.min(100, Math.round((shift.occupancy / shift.capacity) * 100 / 5) * 5)}`} />
                    </div>
                  </div>

                  <div className="ss-shift-card__footer">
                    <button type="button" aria-label={`${tManagerUi('edit')} ${shift.name}`} className="ss-btn-ghost" onClick={() => openEdit(shift)}>
                      <Edit size={14} />{tManagerUi('edit')}
                    </button>
                    {shift.active ? (
                      <button type="button" aria-label={`${tManagerUi('deactivate')} ${shift.name}`} className="ss-btn-danger" onClick={() => setDeactivateTarget(shift)}>
                        <PowerOff size={14} />{tManagerUi('deactivate')}
                      </button>
                    ) : (
                      <button type="button" className="ss-btn-primary cursor-not-allowed" disabled title={tManagerUi('activation_unavailable_host_mutation_contract_not_suppli_62a28c')}>
                        <Zap size={14} />{tManagerUi('activate')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="ss-modal-overlay" onClick={() => setShowModal(false)}>
          <div ref={dialogRef} tabIndex={-1} className="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-shift-dialog-title" onClick={e => e.stopPropagation()}>
            <h2 id="ss-shift-dialog-title" className="ss-modal-title">{editShift ? tManagerUi('edit_shift') : tManagerUi('add_shift')}</h2>
            <div className="ss-form-grid">
              <div className="ss-form-field ss-form-field--full">
                <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmanagementclient-129">{tManagerUi('shift_name')} <span className="ss-text-danger">*</span></label>
                <input id="rbg4-managerseatsshiftslockersshiftmanagementclient-129" className={`ss-input ss-input--no-icon${errors.name ? ' ss-input--error' : ''}`} placeholder={tManagerUi('morning_evening_custom_1')} value={form.name} onChange={e => setValue('name', e.target.value, { shouldDirty: true, shouldValidate: true })} />
                {errors.name && <p className="ss-error">{errors.name?.message ? tManagerUi(errors.name.message) : null}</p>}
              </div>
              <div className="ss-form-field">
                <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmanagementclient-134">{tManagerUi('start_time')} <span className="ss-text-danger">*</span></label>
                <input id="rbg4-managerseatsshiftslockersshiftmanagementclient-134" type="time" className={`ss-input ss-input--no-icon${errors.startTime ? ' ss-input--error' : ''}`} value={form.startTime} onChange={e => setValue('startTime', e.target.value, { shouldDirty: true, shouldValidate: true })} />
                {errors.startTime && <p className="ss-error">{errors.startTime?.message ? tManagerUi(errors.startTime.message) : null}</p>}
              </div>
              <div className="ss-form-field">
                <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmanagementclient-139">{tManagerUi('end_time')} <span className="ss-text-danger">*</span></label>
                <input id="rbg4-managerseatsshiftslockersshiftmanagementclient-139" type="time" className={`ss-input ss-input--no-icon${errors.endTime ? ' ss-input--error' : ''}`} value={form.endTime} onChange={e => setValue('endTime', e.target.value, { shouldDirty: true, shouldValidate: true })} />
                {errors.endTime && <p className="ss-error">{errors.endTime?.message ? tManagerUi(errors.endTime.message) : null}</p>}
              </div>
              <div className="ss-form-field ss-form-field--full">
                <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmanagementclient-144">{tManagerUi('active')}</label>
                <div className="ss-select-wrap">
                  <select id="rbg4-managerseatsshiftslockersshiftmanagementclient-144" aria-label={tManagerUi('active_status')} className="ss-select" value={form.active ? 'yes' : 'no'} onChange={e => setValue('active', e.target.value === 'yes', { shouldDirty: true, shouldValidate: true })}>
                    <option value="yes">{tManagerUi('yes')}</option>
                    <option value="no">{tManagerUi('no')}</option>
                  </select>
                  <ChevronDown size={14} className="ss-select-icon" />
                </div>
              </div>
            </div>
            <div className="ss-modal-footer">
              <button type="button" className="ss-btn-ghost" onClick={() => setShowModal(false)}>{tManagerUi('cancel')}</button>
              <button type="button" className="ss-btn-primary cursor-not-allowed" disabled title={tManagerUi('save_unavailable_host_mutation_contract_not_supplied')}>{tManagerUi('save_unavailable')}</button>
            </div>
          </div>
        </div>
      )}

      {deactivateTarget && (
        <div className="ss-modal-overlay" onClick={() => setDeactivateTarget(null)}>
          <div ref={dialogRef} tabIndex={-1} className="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-shift-deactivate-title" onClick={e => e.stopPropagation()}>
            <h2 id="ss-shift-deactivate-title" className="ss-modal-title">{tManagerUi('deactivate_shift')}</h2>
            <p className="ss-modal-desc">
              {tManagerUi('deactivate')} <strong>{displayShiftName(deactivateTarget.name)}</strong>{tManagerUi('existing_students_are_unaffected_but_new_admissions_cann_6492a4')}
            </p>
            <div className="ss-modal-footer">
              <button type="button" className="ss-btn-ghost" onClick={() => setDeactivateTarget(null)}>{tManagerUi('cancel')}</button>
              <button type="button" className="ss-btn-danger cursor-not-allowed" disabled title={tManagerUi('deactivation_unavailable_host_mutation_contract_not_supp_17d6e3')}>{tManagerUi('deactivate_unavailable')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
