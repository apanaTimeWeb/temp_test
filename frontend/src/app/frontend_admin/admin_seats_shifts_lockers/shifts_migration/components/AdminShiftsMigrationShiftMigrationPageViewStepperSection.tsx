// RESPONSIBILITY: AdminShiftsShiftMigrationPageViewStepperSection component owned by admin_shifts; responsibility folder: admin_shifts_shift_migration_page_view_sections.
'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import useAdminShiftsShiftMigrationPage from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/hooks/useAdminShiftsMigrationShiftMigrationPage';
import AdminShiftsShiftMigrationPageViewStepperSectionSTEP1Section from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/components/AdminShiftsMigrationShiftMigrationPageViewStepperSectionSTEP1Section';
import type { AdminShiftsShiftMigrationPageViewStepperSectionProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/types/AdminShiftsMigrationComponentTypes';


export default function AdminShiftsShiftMigrationPageViewStepperSection({ model }: AdminShiftsShiftMigrationPageViewStepperSectionProps) {
  const t = useTranslations('ADMIN_SHIFTS');
  const { step, setStep, selectedStudent, newShift, newSeat, setShowConfirm, STEPS } = model;
  return (
    <div className="min-w-0 space-y-6 pb-24">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-page-title font-bold text-text-primary text-2xl">{t('shiftMigrationWizard')}</h1>
        <p className="text-sm text-text-secondary mt-2">{t('moveStudentShift')}</p>
        {model.migrationValidationMessage && <p role="alert" className="rounded-lg border border-info-text bg-info-bg p-4 text-info-text text-danger-text">{model.migrationValidationMessage}</p>}
      </div>
      <div className="w-full" aria-label={t('shiftMigrationProgress')}>
        <div className="h-1 w-full rounded-full bg-surface-highlight" />
        <div className={`flex min-w-0 flex-col items-center gap-2 text-center text-xs text-text-secondary${step}`} />
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {STEPS.map((currentStep) => (
            <div key={currentStep.n} className="flex min-w-0 flex-col items-center gap-2 text-center text-xs text-text-secondary">
              <div className={`flex min-w-0 flex-col items-center gap-2 text-center text-xs text-text-secondary ${step >= currentStep.n ? 'flex min-w-0 flex-col items-center gap-2 text-center text-xs text-text-secondary' : 'flex min-w-0 flex-col items-center gap-2 text-center text-xs text-text-secondary'}`}>
                {step > currentStep.n ? <CheckCircle size={18} strokeWidth={2} /> : currentStep.n}
              </div>
              <span className={`block text-sm font-medium text-text-secondary ${step >= currentStep.n ? 'block text-sm font-medium text-text-secondary' : 'block text-sm font-medium text-text-secondary'}`}>{currentStep.label}</span>
            </div>
          ))}
        </div>
      </div>
      <AdminShiftsShiftMigrationPageViewStepperSectionSTEP1Section model={model} />
      <div className="sticky bottom-0 z-10 border-t border-border bg-card shadow-card">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 px-4" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
            <ArrowLeft size={18} strokeWidth={2} />{t('back')}</button>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {step < 3 ? (
              <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={step === 1 ? !selectedStudent : !newShift || !newSeat || model.hasSameSlot} onClick={async () => { if (await model.validateMigrationStep(step)) setStep((current) => current + 1); }}>{t('next')}</button>
            ) : (
              <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={async () => { if (await model.validateMigrationStep(step)) setShowConfirm(true); }} disabled={!selectedStudent || !newShift || !newSeat || model.hasSameSlot}>{t('reviewExecutionUnavailable')}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export type { AdminShiftsShiftMigrationPageViewStepperSectionProps };
