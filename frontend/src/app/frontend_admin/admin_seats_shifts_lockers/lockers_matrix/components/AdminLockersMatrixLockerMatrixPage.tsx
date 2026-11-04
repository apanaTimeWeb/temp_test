'use client';
// RESPONSIBILITY: AdminLockersLockerMatrixPage component owned by admin_lockers; responsibility folder: admin_lockers_components_views.

import { useTranslations } from 'next-intl';
import { useMemo, useState, useRef, useEffect } from 'react';
import { User, KeyRound, Building2, ShieldAlert, Info, X } from 'lucide-react';
import { useAdminLockersLockerMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/hooks/useAdminLockersMatrixLockerMatrix';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import AdminLockersLockerMatrixStats from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixLockerMatrixStats';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ALL_BRANCHES_ID } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import { displayValue } from '@/lib/display_value';

const LEGEND_ITEMS: Array<{ label: string; cls: string }> = [
  { cls: 'text-success-text', label: 'statusFree' },
  { cls: 'text-danger-text', label: 'statusOccupied' },
  { cls: 'text-warning-text', label: 'statusMaintenance' },
  { cls: 'min-w-0 rounded-lg border border-border bg-card p-3', label: 'statusUnknown' },
];

const ADMIN_LOCKER_MATRIX_STATUS_CLASS = {
  free: 'border-success-text bg-success-bg text-success-text',
  occupied: 'border-danger-text bg-danger-bg text-danger-text',
  maintenance: 'border-warning-text bg-warning-bg text-warning-text',
  unknown: 'border-border bg-card text-text-secondary',
} as const;

export function AdminLockersLockerMatrixPage() {
  const t = useTranslations('ADMIN_LOCKERS');
  const { branches, selectedBranchId, selectedBranch, setSelectedBranchId, isAllBranches } = useAdminBranch();
  const [selectedLocker, setSelectedLocker] = useState<AdminLockersLockerMatrixViewModel | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const lockerMatrixQuery = useAdminLockersLockerMatrix();
  const lockers = lockerMatrixQuery.data ?? [];
  const isPending = lockerMatrixQuery.isPending;
  const errorMessage = lockerMatrixQuery.isError && lockerMatrixQuery.data === undefined
    ? t('lockerMatrixLoadError')
    : null;

  // Filter lockers by active branch selection
  const visibleLockers = useMemo(() => {
    if (isAllBranches) return lockers;
    return lockers.filter(locker => !locker.branchId || locker.branchId === selectedBranchId);
  }, [isAllBranches, lockers, selectedBranchId]);

  const stats = useMemo(() => ({
    total: visibleLockers.length,
    free: visibleLockers.filter(locker => locker.status === 'free').length,
    occupied: visibleLockers.filter(locker => locker.status === 'occupied').length,
    maintenance: visibleLockers.filter(locker => locker.status === 'maintenance').length,
    unknown: visibleLockers.filter(locker => locker.status === 'unknown').length,
  }), [visibleLockers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedLocker) {
        setSelectedLocker(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLocker]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-page-title font-bold text-text-primary">{t('lockerMatrixTitle')}</h1>
          <p className="text-sm text-text-secondary">{t('lockerMatrixDescription')}</p>
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-card p-3">
          <div className="flex flex-wrap items-center gap-3">
            {LEGEND_ITEMS.map(item => (
              <div key={item.label} className="inline-flex items-center gap-2 text-sm">
                <span className={`min-w-0 rounded-lg border border-border bg-card p-3 ${item.cls}`} aria-hidden="true" />
                <span className="text-xs text-text-secondary">{t(item.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {lockerMatrixQuery.isError && lockerMatrixQuery.data !== undefined && (
        <p role="status" className="text-warning-text text-caption">{t('lockerMatrixRefreshFailed')}</p>
      )}

      {/* Multi-Branch Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <Building2 size={14} className="text-primary shrink-0" />
            Branch:
          </span>
          <button
            type="button"
            onClick={() => setSelectedBranchId(ALL_BRANCHES_ID)}
            className={`min-h-8 rounded-full px-3 py-1 text-xs font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isAllBranches
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            All Branches
          </button>
          {branches.map((branch) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => setSelectedBranchId(branch.id)}
                className={`min-h-8 rounded-full px-3 py-1 text-xs font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {branch.name} {branch.isMain ? '★' : ''}
              </button>
            );
          })}
        </div>
        {selectedBranch && (
          <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-highlight px-2.5 py-1 text-xs text-text-secondary">
            <span className="font-medium text-text-primary">{selectedBranch.name}</span>
            <span>({selectedBranch.code})</span>
            {selectedBranch.city && <span>· {selectedBranch.city}</span>}
          </div>
        )}
      </div>

      <AdminLockersLockerMatrixStats {...stats} />

      <div className="min-w-0 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-section-title font-semibold text-text-primary">
            {selectedBranch ? `${selectedBranch.name} Locker Grid` : 'All Branches Locker Inventory'}
          </h2>
          <span className="text-xs text-text-secondary">
            {t('available')}: {stats.free} / {stats.total}
          </span>
        </div>

        {isPending ? (
          <div className="py-12 text-center text-text-secondary" role="status">{t('loadingLockers')}</div>
        ) : errorMessage ? (
          <div className="py-12 text-center">
            <p className="text-danger-text mb-3">{errorMessage}</p>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => { void lockerMatrixQuery.refetch(); }}
            >
              {t('retry')}
            </button>
          </div>
        ) : visibleLockers.length === 0 ? (
          <div className="py-12 text-center text-text-secondary">{t('noLockersFound')}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {visibleLockers.map(locker => (
              <button
                key={locker.uuid ?? locker.id}
                type="button"
                data-testid={`admin_lockers-locker-${locker.id}`}
                className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border p-2 text-sm font-semibold motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${ADMIN_LOCKER_MATRIX_STATUS_CLASS[locker.status] ?? 'border-border bg-card text-text-secondary'}`}
                onClick={() => setSelectedLocker(locker)}
                title={`Locker #${locker.id} — Click to inspect occupancy and allocation audit`}
                aria-label={`${t('locker')} ${locker.id}, ${t(locker.status === 'free' ? 'statusFree' : locker.status === 'occupied' ? 'statusOccupied' : locker.status === 'maintenance' ? 'statusMaintenance' : 'statusUnknown')}`}
              >
                <KeyRound size={14} className="shrink-0 opacity-70" />
                <span>{locker.id}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Read-Only Administrative Inspection Dialog */}
      {selectedLocker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
          role="presentation"
          onClick={() => setSelectedLocker(null)}
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg rounded-xl border border-border bg-overlay p-6 shadow-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="locker-inspect-title"
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 id="locker-inspect-title" className="text-base font-semibold text-text-primary">
                    Locker Inspection — #{selectedLocker.id}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {selectedLocker.branchName ?? selectedBranch?.name ?? 'Branch Asset'}
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ADMIN_LOCKER_MATRIX_STATUS_CLASS[selectedLocker.status]}`}>
                {t(selectedLocker.status === 'free' ? 'statusFree' : selectedLocker.status === 'occupied' ? 'statusOccupied' : selectedLocker.status === 'maintenance' ? 'statusMaintenance' : 'statusUnknown')}
              </span>
            </div>

            <div className="my-4 space-y-4 text-sm">
              {selectedLocker.status === 'occupied' ? (
                <>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="rounded-full bg-surface-highlight p-2 text-text-secondary">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{displayValue(selectedLocker.student, 'Assigned Student')}</h4>
                      <p className="font-mono text-xs text-text-secondary">ID: {displayValue(selectedLocker.smartId, '—')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-border bg-card p-2.5">
                      <span className="text-text-secondary">Phone</span>
                      <p className="mt-0.5 font-medium text-text-primary">{displayValue(selectedLocker.phone, '—')}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-2.5">
                      <span className="text-text-secondary">Shift</span>
                      <p className="mt-0.5 font-medium text-text-primary">{displayValue(selectedLocker.shift, 'Full Day')}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-2.5">
                      <span className="text-text-secondary">Allotted By</span>
                      <p className="mt-0.5 font-medium text-text-primary">{displayValue(selectedLocker.allottedByManager, 'Branch Desk Manager')}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-2.5">
                      <span className="text-text-secondary">Expiry Date</span>
                      <p className="mt-0.5 font-medium text-text-primary">{displayValue(selectedLocker.expiry, 'Active')}</p>
                    </div>
                  </div>
                </>
              ) : selectedLocker.status === 'free' ? (
                <div className="rounded-lg border border-success/20 bg-success-bg p-3.5 text-xs text-success-text">
                  <p className="font-semibold">Locker #{selectedLocker.id} is Vacant & Available</p>
                  <p className="mt-1 opacity-90">
                    Physical key is stored in the branch key rack. Allocation is performed directly at the counter by the Branch Manager upon student enrollment.
                  </p>
                </div>
              ) : selectedLocker.status === 'maintenance' ? (
                <div className="rounded-lg border border-warning/20 bg-warning-bg p-3.5 text-xs text-warning-text">
                  <p className="font-semibold">Locker #{selectedLocker.id} Under Maintenance</p>
                  <p className="mt-1 opacity-90">
                    Key lock mechanism or door hinge inspection required. Work order logged with Branch Maintenance.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-text-secondary">{t('lockerOccupancyUnknown')}</p>
              )}

              {/* Administrative Policy Notice */}
              <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-highlight/50 p-3 text-xs text-text-secondary">
                <Info size={15} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  Admin HQ Oversight: Physical keys are handled exclusively on-site by Branch Managers. Central Admin monitors occupancy rates, capacity planning, and branch asset audits.
                </span>
              </div>
            </div>

            <div className="flex justify-end border-t border-border pt-3">
              <button
                type="button"
                onClick={() => setSelectedLocker(null)}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HQ Governance & Operational Invariants Note */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <ShieldAlert size={16} className="text-primary" />
          <span>HQ Asset Governance & Desk Operations Boundary</span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Lockers are physical branch assets governed by branch-level custody. Physical key handovers, locker allotment at admission, and key deposits are managed on-site by Branch Managers. Central Admin oversees network-wide inventory, branch utilization ratios, and scheduled maintenance audits.
        </p>
      </div>
    </div>
  );
}
export default AdminLockersLockerMatrixPage;
