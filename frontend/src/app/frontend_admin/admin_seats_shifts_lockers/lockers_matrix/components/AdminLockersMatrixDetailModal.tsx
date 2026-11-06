'use client';
// Responsibility: Modal dialog for inspecting locker status, student assignment, and HQ administrative policy.

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { User, KeyRound, Info } from 'lucide-react';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import { displayValue } from '@/lib/display_value';

export const ADMIN_LOCKER_MATRIX_STATUS_CLASS = {
  free: 'border-success-text bg-success-bg text-success-text',
  occupied: 'border-danger-text bg-danger-bg text-danger-text',
  maintenance: 'border-warning-text bg-warning-bg text-warning-text',
  unknown: 'border-border bg-card text-text-secondary',
} as const;

interface AdminLockersMatrixDetailModalProps {
  locker: AdminLockersLockerMatrixViewModel | null;
  branchName?: string;
  onClose: () => void;
}

export function AdminLockersMatrixDetailModal({
  locker,
  branchName,
  onClose,
}: AdminLockersMatrixDetailModalProps) {
  const t = useTranslations('ADMIN_LOCKERS');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!locker) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [locker, onClose]);

  if (!locker) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-xl border border-border bg-overlay p-6 shadow-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="locker-inspect-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary-subtle p-2 text-primary">
              <KeyRound size={20} />
            </div>
            <div>
              <h3 id="locker-inspect-title" className="text-base font-semibold text-text-primary">
                Locker Inspection — #{locker.id}
              </h3>
              <p className="text-xs text-text-secondary">
                {locker.branchName ?? branchName ?? 'Branch Asset'}
              </p>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ADMIN_LOCKER_MATRIX_STATUS_CLASS[locker.status]}`}>
            {t(locker.status === 'free' ? 'statusFree' : locker.status === 'occupied' ? 'statusOccupied' : locker.status === 'maintenance' ? 'statusMaintenance' : 'statusUnknown')}
          </span>
        </div>

        <div className="my-4 space-y-4 text-sm">
          {locker.status === 'occupied' ? (
            <>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <div className="rounded-full bg-surface-highlight p-2 text-text-secondary">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">{displayValue(locker.student, 'Assigned Student')}</h4>
                  <p className="font-mono text-xs text-text-secondary">ID: {displayValue(locker.smartId, '—')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-2.5">
                  <span className="text-text-secondary">Phone</span>
                  <p className="mt-0.5 font-medium text-text-primary">{displayValue(locker.phone, '—')}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-2.5">
                  <span className="text-text-secondary">Shift</span>
                  <p className="mt-0.5 font-medium text-text-primary">{displayValue(locker.shift, 'Full Day')}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-2.5">
                  <span className="text-text-secondary">Allotted By</span>
                  <p className="mt-0.5 font-medium text-text-primary">{displayValue(locker.allottedByManager, 'Branch Desk Manager')}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-2.5">
                  <span className="text-text-secondary">Expiry Date</span>
                  <p className="mt-0.5 font-medium text-text-primary">{displayValue(locker.expiry, 'Active')}</p>
                </div>
              </div>
            </>
          ) : locker.status === 'free' ? (
            <div className="rounded-lg border border-border bg-success-bg p-3.5 text-xs text-success-text">
              <p className="font-semibold">Locker #{locker.id} is Vacant & Available</p>
              <p className="mt-1 opacity-90">
                Physical key is stored in the branch key rack. Allocation is performed directly at the counter by the Branch Manager upon student enrollment.
              </p>
            </div>
          ) : locker.status === 'maintenance' ? (
            <div className="rounded-lg border border-border bg-warning-bg p-3.5 text-xs text-warning-text">
              <p className="font-semibold">Locker #{locker.id} Under Maintenance</p>
              <p className="mt-1 opacity-90">
                Key lock mechanism or door hinge inspection required. Work order logged with Branch Maintenance.
              </p>
            </div>
          ) : (
            <p className="text-xs text-text-secondary">{t('lockerOccupancyUnknown')}</p>
          )}

          {/* Administrative Policy Notice */}
          <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-highlight p-3 text-xs text-text-secondary">
            <Info size={15} className="mt-0.5 shrink-0 text-primary" />
            <span>
              Admin HQ Oversight: Physical keys are handled exclusively on-site by Branch Managers. Central Admin monitors occupancy rates, capacity planning, and branch asset audits.
            </span>
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

