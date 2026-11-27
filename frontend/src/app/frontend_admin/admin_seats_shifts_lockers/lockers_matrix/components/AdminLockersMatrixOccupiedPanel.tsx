'use client';

import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import { formatAdminLockersMatrixCurrency } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/utils/formatAdminLockersMatrixCurrency';
import { displayValue } from '@/lib/display_value';
import { CheckCircle2, IndianRupee, User, Wrench, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface AdminLockersMatrixOccupiedPanelProps {
  locker: AdminLockersLockerMatrixViewModel;
  onClose: () => void;
  onVacate?: () => void;
  onSetMaintenance?: (isMaintenance: boolean) => void;
}

export function AdminLockersMatrixOccupiedPanel({
  locker,
  onClose,
  onVacate,
  onSetMaintenance,
}: AdminLockersMatrixOccupiedPanelProps) {
  const t = useTranslations('ADMIN_LOCKERS');
  const locale = useLocale();
  if (locker.status === 'maintenance') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-warning bg-warning-bg p-4 text-warning-text space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Wrench size={16} aria-hidden="true" />
            <span>Locker #{locker.id} Under Maintenance</span>
          </div>
          <p className="text-xs opacity-90">
            Key lock mechanism or door hinge inspection logged. Physical unit is blocked from student allocation until repaired.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onSetMaintenance?.(false)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors cursor-pointer"
          >
            <CheckCircle2 size={15} aria-hidden="true" />
            Mark Repaired &amp; Available
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-3.5">
        <div className="rounded-xl border border-border-focus bg-primary-subtle p-3 text-primary shrink-0">
          <User size={22} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-text-primary truncate">{displayValue(locker.student, 'Assigned Student')}</h4>
          <p className="font-mono text-[11px] text-primary mt-0.5">ID: {displayValue(locker.smartId, 'SL-DT-1000')}</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-0.5 rounded-md border border-success bg-success-bg px-2 py-0.5 text-xs font-bold text-success-text">
            <IndianRupee size={11} aria-hidden="true" /> {t('lockerMonthlyRateBadge', { amount: formatAdminLockersMatrixCurrency(300, locale) })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="rounded-xl border border-border bg-surface-highlight p-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Contact Phone</span>
          <p className="mt-1 font-mono font-medium text-text-primary">{displayValue(locker.phone, '—')}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-highlight p-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Library Shift</span>
          <p className="mt-1 font-medium text-text-primary">{displayValue(locker.shift, 'Full Day Dedicated')}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-highlight p-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Allotted By</span>
          <p className="mt-1 font-medium text-text-secondary">{displayValue(locker.allottedByManager, 'Branch Desk Manager')}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-highlight p-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Key Tag &amp; Expiry</span>
          <p className="mt-1 font-mono text-success-text font-semibold">{displayValue(locker.expiry, 'Active (Valid)')}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 mt-2">
        <button
          type="button"
          onClick={() => onSetMaintenance?.(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-warning bg-warning-bg px-3 py-2 text-xs font-semibold text-warning-text hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
        >
          <Wrench size={13} aria-hidden="true" />
          Mark Maintenance
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onVacate}
            className="inline-flex items-center gap-1.5 rounded-xl border border-danger bg-danger-bg px-4 py-2 text-xs font-bold text-danger-text hover:opacity-90 motion-safe:transition-opacity shadow-card cursor-pointer"
          >
            <X size={14} aria-hidden="true" />
            Release Locker (Vacate)
          </button>
        </div>
      </div>
    </div>
  );
}
