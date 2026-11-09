'use client';
// RESPONSIBILITY: AdminLockersLockerMatrixPage component owned by admin_lockers; responsibility folder: admin_lockers_components_views.

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { KeyRound, Building2, ShieldAlert, LayoutGrid, List } from 'lucide-react';
import { useAdminLockersLockerMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/hooks/useAdminLockersMatrixLockerMatrix';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import AdminLockersLockerMatrixStats from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixLockerMatrixStats';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ALL_BRANCHES_ID } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import {
  AdminLockersMatrixDetailModal,
  ADMIN_LOCKER_MATRIX_STATUS_CLASS,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixDetailModal';

const LEGEND_ITEMS: Array<{ label: string; cls: string }> = [
  { cls: 'text-success-text', label: 'statusFree' },
  { cls: 'text-danger-text', label: 'statusOccupied' },
  { cls: 'text-warning-text', label: 'statusMaintenance' },
  { cls: 'min-w-0 rounded-lg border border-border bg-card p-3', label: 'statusUnknown' },
];

export function AdminLockersLockerMatrixPage() {
  const t = useTranslations('ADMIN_LOCKERS');
  const { branches, selectedBranchId, selectedBranch, setSelectedBranchId, isAllBranches } = useAdminBranch();
  const [selectedLocker, setSelectedLocker] = useState<AdminLockersLockerMatrixViewModel | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-section-title font-semibold text-text-primary">
            {selectedBranch ? `${selectedBranch.name} Lockers` : t('lockerMatrixTitle')}
          </h1>
          <p className="text-xs text-text-secondary">{t('lockerMatrixSubtitle')}</p>
        </div>
        <div className="inline-flex items-center gap-1 bg-surface-muted p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <LayoutGrid size={14} /> Grid View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            aria-pressed={viewMode === 'table'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <List size={14} /> Table View
          </button>
        </div>
      </div>

      {/* Multi-Branch Floor Filter Bar */}
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
            All Branches ({lockers.length})
          </button>
          {branches.map((branch) => {
            const count = lockers.filter((l) => !l.branchId || l.branchId === branch.id).length;
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
                {branch.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <AdminLockersLockerMatrixStats {...stats} />

      {/* Status Legend */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="inline-flex items-center gap-2 text-sm">
            <span className={`h-3 w-3 rounded-full border ${item.cls}`} aria-hidden="true" />
            <span className="text-xs text-text-secondary">{t(item.label)}</span>
          </div>
        ))}
      </div>

      {/* Locker Matrix Grid */}
      <div className="rounded-xl border border-border bg-card p-6">
        {isPending ? (
          <div className="py-12 text-center text-text-secondary" role="status">{t('loadingLockerMatrix')}</div>
        ) : errorMessage ? (
          <div className="py-12 text-center">
            <p className="mb-3 text-danger-text">{errorMessage}</p>
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
        ) : viewMode === 'grid' ? (
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
        ) : (
          <div className="border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-highlight border-b border-border text-left font-bold text-text-secondary uppercase">
                <tr>
                  <th className="p-3">Locker No</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Student</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Shift</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleLockers.map((locker) => (
                  <tr key={locker.uuid ?? locker.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td className="p-3 font-mono font-bold text-primary flex items-center gap-1.5">
                      <KeyRound size={13} className="text-secondary" /> #{locker.id}
                    </td>
                    <td className="p-3 text-text-secondary">{locker.branchName ?? selectedBranch?.name ?? 'Main Branch'}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${ADMIN_LOCKER_MATRIX_STATUS_CLASS[locker.status] ?? ''}`}>
                        {t(locker.status === 'free' ? 'statusFree' : locker.status === 'occupied' ? 'statusOccupied' : locker.status === 'maintenance' ? 'statusMaintenance' : 'statusUnknown')}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-text-primary">{locker.student ?? '— (Unallocated)'}</td>
                    <td className="p-3 text-text-secondary font-mono">{locker.phone ?? '—'}</td>
                    <td className="p-3 text-text-secondary">{locker.shift ?? '—'}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLocker(locker)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs font-semibold text-text-primary hover:bg-surface-hover"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Read-Only Administrative Inspection Dialog */}
      <AdminLockersMatrixDetailModal
        locker={selectedLocker}
        branchName={selectedBranch?.name}
        onClose={() => setSelectedLocker(null)}
      />

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
