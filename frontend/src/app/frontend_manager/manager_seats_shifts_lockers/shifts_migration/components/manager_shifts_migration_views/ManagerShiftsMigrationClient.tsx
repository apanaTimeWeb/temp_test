'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { ManagerShiftsMigrationEmptyState } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/components/ManagerShiftsMigrationEmptyState';
import { useTranslations } from 'next-intl';

import { useManagerSeatsCurrencyFormatter } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/hooks/ManagerShiftsMigrationFormattingHook';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useManagerShiftsMigrationConfirm } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/hooks/useManagerShiftsMigrationConfirm';
import { useManagerShiftsMigrationUnsavedChangesGuard } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/hooks/useManagerShiftsMigrationUnsavedChangesGuard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerSeatsShiftMigrationDraftSchema } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/schemas/ManagerShiftsMigrationDraftSchemas';
import { ArrowLeft, Search, ChevronDown, Clock } from 'lucide-react';
import { ManagerShiftsMigrationStepper } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/components/manager_shifts_migration_views/ManagerShiftsMigrationStepper.tsx';
import { ManagerShiftsMigrationSummary } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/components/manager_shifts_migration_sections/ManagerShiftsMigrationSummary.tsx';
import { ManagerShiftsMigrationReview } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/components/manager_shifts_migration_views/ManagerShiftsMigrationReview.tsx';
import { MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_STUDENTS, MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_SHIFTS, type ManagerShiftsMigrationSampleMigrationStudent as Student } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/mocks/manager_shifts_migration_fixtures/ManagerShiftsMigrationSampleFixtures';
import type { PayMode } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationComponentTypes';
import { MANAGER_SHIFTS_MIGRATION_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/constants/ManagerShiftsMigrationConstants';



function daysRemaining(validTill: string): number {
  const diff = new Date(validTill).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export function ManagerShiftsMigrationClient() {
  const tManagerUi = useTranslations('manager.manager_shift_migration.ui');
  const router = useRouter();
  const { confirm, dialog: unsavedConfirmDialog } = useManagerShiftsMigrationConfirm();
  const shiftLabel = (value: string) => ({ Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Evening: tManagerUi('evening'), Night: tManagerUi('night'), 'Full Day': tManagerUi('full_day') } as Record<string, string>)[value] ?? value;
  const formatManagerSeatsCurrency = useManagerSeatsCurrencyFormatter();
  const [step, setStep]                         = useState(1);
  const [search, setSearch]                     = useState('');
  const [debouncedSearch, setDebouncedSearch]   = useState(search);
  // Dependency rationale: debounce student lookup text and cancel stale timers before filtering the migration candidates.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), MANAGER_SHIFTS_MIGRATION_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [search]);
  const [selectedStudent, setSelectedStudent]   = useState<Student | null>(null);
  const [showCustomSlot, setShowCustomSlot]     = useState(false);
  const { watch, setValue, trigger, formState } = useForm({ resolver: zodResolver(managerSeatsShiftMigrationDraftSchema), defaultValues: { selectedStudentId: '', newShift: '', newSeat: '', customStart: '', customEnd: '', payMode: 'Cash' as PayMode, txnId: '', remark: '' }, mode: 'onChange' });
  const newShift = watch('newShift');
  const newSeat = watch('newSeat');
  const customStart = watch('customStart');
  const customEnd = watch('customEnd');
  const payMode = watch('payMode');
  const txnId = watch('txnId');
  const remark = watch('remark');
  const setNewShift = (value: string) => setValue('newShift', value, { shouldDirty: true, shouldValidate: true });
  const setNewSeat = (value: string) => setValue('newSeat', value, { shouldDirty: true, shouldValidate: true });
  const setCustomStart = (value: string) => setValue('customStart', value, { shouldDirty: true, shouldValidate: true });
  const setCustomEnd = (value: string) => setValue('customEnd', value, { shouldDirty: true, shouldValidate: true });
  const setPayMode = (value: PayMode) => setValue('payMode', value, { shouldDirty: true, shouldValidate: true });
  const setTxnId = (value: string) => setValue('txnId', value, { shouldDirty: true, shouldValidate: true });
  const setRemark = (value: string) => setValue('remark', value, { shouldDirty: true, shouldValidate: true });

  const migrationInProgress = step > 1 || Boolean(selectedStudent || formState.isDirty || newShift || newSeat || customStart || customEnd || txnId || remark);
  useManagerShiftsMigrationUnsavedChangesGuard({ isDirty: migrationInProgress, confirm, router, tManagerUi });

  const filteredStudents = MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.smartId.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const daysLeft       = selectedStudent ? daysRemaining(selectedStudent.validTill) : 0;
  const selectedShiftData = MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_SHIFTS.find(s => s.name === newShift);
  const newRate        = selectedShiftData?.rate ?? 0;
  const oldRate        = selectedStudent?.dailyRate ?? 0;
  const adjustment     = (newRate - oldRate) * daysLeft;
  const isPaying       = adjustment > 0;


  return (
    <>
      {unsavedConfirmDialog}
      <div className="ss-page ss-page--with-footer">
        <div className="ss-page-header-center">
          <h1 className="ss-page-title ss-page-title--lg">{tManagerUi('shift_migration_wizard')}</h1>
          <p className="ss-page-subtitle ss-page-subtitle--mt">{tManagerUi('review_a_sample_shift_migration_and_fee_adjustment_previ_8b36bd')}</p>
          <p className="ss-page-subtitle" role="status" data-testid="manager-shift-migration-contract-warning">{tManagerUi('sample_data_only_migration_and_fee_adjustment_are_unavai_fd63d6')}</p>
        </div>

        <ManagerShiftsMigrationStepper step={step} />

        <div className="ss-migration-layout">
          <div className="ss-migration-main">
            {step === 1 && (
              <div className="ss-card">
                <h3 className="ss-card-section-heading">
                  <Search size={18} className="ss-text-primary-brand" />
                  {tManagerUi('select_student')}
                </h3>
                <div className="ss-filter-bar__input-wrap">
                  <Search size={14} className="ss-input-icon" />
                  <input
                    aria-label={tManagerUi('search_by_name_or_smart_id')}
                    className="ss-input"
                    placeholder={tManagerUi('search_by_name_or_smart_id')}
                    value={search}
                    onChange={e => { setSearch(e.target.value); setSelectedStudent(null); setValue('selectedStudentId', '', { shouldDirty: true, shouldValidate: true }); }}
                  />
                </div>
                {debouncedSearch && (
                  <div className="ss-search-results">
                    {filteredStudents.length === 0 ? (
                      <ManagerShiftsMigrationEmptyState className="ss-text-secondary ss-text-caption" testId="manager-shift-migration-student-search-empty">{tManagerUi('no_students_found')}</ManagerShiftsMigrationEmptyState>
                    ) : filteredStudents.map(s => (
                      <button type="button"
                        key={s.id}
                        className={`ss-search-result-item${selectedStudent?.id === s.id ? ' ss-search-result-item--active' : ''}`}
                        onClick={() => {
                          setSelectedStudent(s);
                          setValue('selectedStudentId', s.id, { shouldDirty: true, shouldValidate: true });
                          setNewShift(s.currentShift);
                          setNewSeat(s.currentSeat);
                        }}
                      >
                        <p className="ss-cell-name">{s.name}</p>
                        <p className="ss-table__cell-sub">{s.smartId} · {s.currentShift}</p>
                      </button>
                    ))}
                  </div>
                )}
                {selectedStudent && (
                  <div className="ss-info-box ss-info-box--mt">
                    <div>
                      <p className="ss-info-box__title">{tManagerUi('current_details')} {selectedStudent.name}</p>
                      <p className="ss-info-box__desc">
                        {tManagerUi('shift')} <strong>{shiftLabel(selectedStudent.currentShift)}</strong> {tManagerUi('seat_857e61')} <strong>{selectedStudent.currentSeat}</strong> {tManagerUi('valid_till')} <strong>{selectedStudent.validTill}</strong> {tManagerUi('plan')} <strong>{selectedStudent.plan}</strong> {tManagerUi('days_left_037ac7')} <strong>{daysLeft}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="ss-card">
                <h3 className="ss-card-section-heading">
                  <ChevronDown size={18} className="ss-text-primary-brand" />
                  {tManagerUi('choose_new_slot')}
                </h3>
                <div className="ss-migration-form-grid">
                  <div>
                    <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmigrationclient-133">{tManagerUi('new_shift')} <span className="ss-text-danger">*</span></label>
                    <div className="ss-select-wrap">
                      <select id="rbg4-managerseatsshiftslockersshiftmigrationclient-133" aria-label={tManagerUi('new_shift')} aria-invalid={Boolean(formState.errors.newShift)} className="ss-select" value={newShift} onChange={e => { setNewShift(e.target.value); setNewSeat(''); }}>
                        <option value="">{tManagerUi('select_shift')}</option>
                        {MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_SHIFTS.map(s => (
                          <option key={s.name} value={s.name}>{shiftLabel(s.name)} ({s.seats} {tManagerUi('seats_free')}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="ss-select-icon" />
                    </div>
                  </div>
                  <div>
                    <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmigrationclient-145">{tManagerUi('new_seat')} <span className="ss-text-danger">*</span></label>
                    <div className="ss-select-wrap">
                      <select id="rbg4-managerseatsshiftslockersshiftmigrationclient-145" aria-label={tManagerUi('new_seat')} aria-invalid={Boolean(formState.errors.newSeat)} className="ss-select" value={newSeat} onChange={e => setNewSeat(e.target.value)} disabled={!newShift}>
                        <option value="">{tManagerUi('select_seat')}</option>
                        {newShift && ['B-01', 'B-02', 'B-03', 'B-04'].map(seat => (
                          <option key={seat}>{seat}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="ss-select-icon" />
                    </div>
                  </div>
                  {formState.errors.newShift?.message && <p className="ss-error" role="alert">{tManagerUi(formState.errors.newShift.message)}</p>}
                  {formState.errors.newSeat?.message && <p className="ss-error" role="alert">{tManagerUi(formState.errors.newSeat.message)}</p>}
                </div>

                <div className="ss-custom-slot-toggle">
                  <button type="button"
                    className={`ss-btn-ghost ss-btn--sm ss-custom-slot-toggle__btn`}
                    onClick={() => setShowCustomSlot(v => !v)}
                  >
                    <Clock size={13} />
                    {showCustomSlot ? tManagerUi('remove_custom_slot') : tManagerUi('add_custom_time_slot_optional')}
                  </button>
                </div>
                {showCustomSlot && (
                  <div className="ss-migration-form-grid ss-custom-slot-fields">
                    <div>
                      <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmigrationclient-170">{tManagerUi('custom_start_time')}</label>
                      <input id="rbg4-managerseatsshiftslockersshiftmigrationclient-170" type="time" className="ss-input ss-input--no-icon" value={customStart} onChange={e => setCustomStart(e.target.value)} />
                    </div>
                    <div>
                      <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmigrationclient-174">{tManagerUi('custom_end_time')}</label>
                      <input id="rbg4-managerseatsshiftslockersshiftmigrationclient-174" type="time" aria-invalid={Boolean(formState.errors.customEnd)} className="ss-input ss-input--no-icon" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
                      {formState.errors.customEnd?.message && <p className="ss-error" role="alert">{tManagerUi(formState.errors.customEnd.message)}</p>}
                    </div>
                  </div>
                )}

                {newShift && (
                  <div className="ss-info-box ss-info-box--mt">
                    <div>
                      <p className="ss-info-box__title">{tManagerUi('availability')}</p>
                      <p className="ss-info-box__desc">
                        {selectedShiftData?.seats} {tManagerUi('seats_available_in')} {newShift} {tManagerUi('shift_rate')} {formatManagerSeatsCurrency(newRate)}{tManagerUi('day')}
                        {showCustomSlot && customStart && customEnd && (
                          <> {tManagerUi('custom_slot')} <strong>{customStart} – {customEnd}</strong>.</>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <ManagerShiftsMigrationReview
                oldRate={oldRate}
                newRate={newRate}
                daysLeft={daysLeft}
                adjustment={adjustment}
                isPaying={isPaying}
                payMode={payMode}
                txnId={txnId}
                remark={remark}
                onPayModeChange={setPayMode}
                onTxnIdChange={setTxnId}
                onRemarkChange={setRemark}
              />
            )}
          </div>

          {selectedStudent && (
            <ManagerShiftsMigrationSummary
              student={selectedStudent}
              daysLeft={daysLeft}
              newShift={newShift}
              newSeat={newSeat}
              showCustomSlot={showCustomSlot}
              customStart={customStart}
              customEnd={customEnd}
            />
          )}
        </div>

        <div className="ss-sticky-footer">
          <div className="ss-sticky-footer__inner">
            <button type="button" className="ss-btn-ghost ss-footer-prev" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
              <ArrowLeft size={15} />{tManagerUi('back')}
            </button>
            <div className="ss-sticky-footer__right">
              {step < 3 ? (
                <button type="button"
                  className="ss-btn-primary ss-footer-confirm"
                  disabled={step === 1 ? !selectedStudent : !newShift || !newSeat}
                  onClick={() => setStep(s => s + 1)}
                >
                  {tManagerUi('next')}
                </button>
              ) : (
                <button type="button" className="ss-btn-primary ss-footer-confirm cursor-not-allowed" disabled title={tManagerUi('shift_migration_unavailable_verified_host_mutation_contr_4d2507')}>
                  {tManagerUi('migration_unavailable')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
