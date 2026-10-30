'use client';
// RESPONSIBILITY: AdminShiftsShiftMigrationPageView component owned by admin_shifts; responsibility folder: admin_shifts_components_views.

import { useTranslations } from 'next-intl';

import { useRef } from 'react';

import useAdminShiftsDialogFocus from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/hooks/useAdminShiftsMigrationDialogFocus';
import useShiftMigrationPage from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/hooks/useAdminShiftsMigrationShiftMigrationPage';
import AdminShiftsShiftMigrationPageViewStepperSection from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/components/AdminShiftsMigrationShiftMigrationPageViewStepperSection';
import type { AdminShiftsShiftMigrationPageViewProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/types/AdminShiftsMigrationComponentTypes';


export default function AdminShiftsShiftMigrationPageView({ model }: AdminShiftsShiftMigrationPageViewProps) {
  const t = useTranslations('ADMIN_SHIFTS');
  const { selectedStudent, newShift, newSeat, showCustomSlot, customStart, customEnd, showConfirm, setShowConfirm, isPaying, adjustment, handleConfirmMigration } = model;
  const migrationDialogRef = useRef<HTMLDivElement>(null);
  useAdminShiftsDialogFocus(showConfirm, () => setShowConfirm(false), migrationDialogRef);
  return (
    <>
      <p role="status" className="mx-4 mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{model.isDemoMode ? t('migrationDemoNotice') : t('migrationLiveNotice')}</p>
      <AdminShiftsShiftMigrationPageViewStepperSection model={model} />

      {/* Confirm Modal */}
      {showConfirm && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="presentation" onClick={() => setShowConfirm(false)}>
          <div ref={migrationDialogRef} className="w-full max-w-lg rounded-xl border border-border bg-overlay p-5 shadow-dialog" role="dialog" aria-modal="true" aria-labelledby="shift-migration-confirm-title" tabIndex={-1} onClick={e => e.stopPropagation()} onKeyDown={event => { if (event.key === 'Escape') setShowConfirm(false); }}>
            <h2 id="shift-migration-confirm-title" className="text-section-title font-semibold text-text-primary">{t('reviewMigrationPreview')}</h2>
            <p className="mt-1 text-sm text-text-secondary">{t('proposedPreviewOnly')}<strong>{selectedStudent.currentSeat}</strong> ({selectedStudent.currentShift}) → <strong>{newSeat}</strong> ({newShift}). {t('migrationNoRecordChanged')}
              {showCustomSlot && customStart && customEnd && <> {t('migrationCustomSlotPreview', { start: customStart, end: customEnd })}</>}
              {' '}{t('estimatedFeeAdjustment')}: <strong>{isPaying ? '+' : ''}₹{Math.abs(adjustment)}</strong>{t('migrationBlocked')}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
              <button data-testid="admin_shifts-AdminShiftsShiftMigrationPageView-control-003" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => setShowConfirm(false)}>{t('cancel')}</button>
              <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={handleConfirmMigration}>{t('attemptMigrationBlocked')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export type { AdminShiftsShiftMigrationPageViewProps };
