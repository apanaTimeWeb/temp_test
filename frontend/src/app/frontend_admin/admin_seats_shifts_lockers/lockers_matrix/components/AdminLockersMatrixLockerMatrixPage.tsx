// RESPONSIBILITY: AdminLockersLockerMatrixPage component owned by admin_lockers; responsibility folder: admin_lockers_components_views.
'use client';

import { useTranslations } from 'next-intl';

import { useMemo } from 'react';
import { User, KeyRound } from 'lucide-react';
import { useAdminLockersLockerMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/hooks/useAdminLockersMatrixLockerMatrix';
import { toast } from 'sonner';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import AdminLockersLockerMatrixStats from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixLockerMatrixStats';

const LEGEND_ITEMS: Array<{ label: string; cls: string }> = [
  { cls: 'text-success-text', label: 'statusFree' },
  { cls: 'text-danger-text', label: 'statusOccupied' },
  { cls: 'text-warning-text', label: 'statusMaintenance' },
  { cls: 'min-w-0 rounded-lg border border-border bg-card p-3', label: 'statusUnknown' },
];

export function AdminLockersLockerMatrixPage() {
  const t = useTranslations('ADMIN_LOCKERS');
  const lockerMatrixQuery = useAdminLockersLockerMatrix();
  const lockers = lockerMatrixQuery.data ?? [];
  const isPending = lockerMatrixQuery.isPending;
  const errorMessage = lockerMatrixQuery.isError && lockerMatrixQuery.data === undefined
    ? t('lockerMatrixLoadError')
    : null;

  const stats = useMemo(() => ({
    total: lockers.length,
    free: lockers.filter(locker => locker.status === 'free').length,
    occupied: lockers.filter(locker => locker.status === 'occupied').length,
    maintenance: lockers.filter(locker => locker.status === 'maintenance').length,
    unknown: lockers.filter(locker => locker.status === 'unknown').length,
  }), [lockers]);

  const handleCellClick = (locker: AdminLockersLockerMatrixViewModel) => {
    if (locker.status === 'free') toast.info(t('lockerAssignmentBlocked'), { id: 'admin_seats_shifts_lockers-lockers_matrix-components-AdminLockersMatrixLockerMatrixPage-toast-38-1' });
    else if (locker.status === 'occupied') toast.info(t('lockerProfileContract', { id: locker.id }));
    else if (locker.status === 'maintenance') toast.info(t('underMaintenance'), { id: 'admin_seats_shifts_lockers-lockers_matrix-components-AdminLockersMatrixLockerMatrixPage-toast-40-2' });
    else if (locker.status === 'unknown') toast.info(t('lockerOccupancyUnknown'), { id: 'admin_seats_shifts_lockers-lockers_matrix-components-AdminLockersMatrixLockerMatrixPage-toast-41-3' });
  };

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

      {lockerMatrixQuery.isError && lockerMatrixQuery.data !== undefined && <p role="status" className="text-warning-text text-caption">{t('lockerMatrixRefreshFailed')}</p>}

      <AdminLockersLockerMatrixStats {...stats} />

      <div className="min-w-0 rounded-xl border border-border bg-card p-6 rounded-lg p-3">
        {isPending ? (
          <div className="py-12 text-center text-text-secondary" role="status">{t('loadingLockers')}</div>
        ) : errorMessage ? (
          <div className="py-12 text-center">
            <p className="text-danger-text mb-3">{errorMessage}</p>
            <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { void lockerMatrixQuery.refetch(); }}>{t('retry')}</button>
          </div>
        ) : lockers.length === 0 ? (
          <div className="py-12 text-center text-text-secondary">{t('noLockersFound')}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {lockers.map(locker => (
              <button
                key={locker.uuid ?? locker.id}
                type="button"
                data-testid={`admin_lockers-locker-${locker.id}`}
                className={`text-sm text-primary${locker.status}`}
                onClick={() => handleCellClick(locker)}
                title={locker.status === 'free' ? t('lockerFreeTitle') : locker.status === 'occupied' ? t('lockerOccupiedTitle') : locker.status === 'maintenance' ? t('underMaintenance') : t('lockerUnknownTitle')}
                aria-label={`${t('locker')} ${locker.id}, ${t(locker.status === 'free' ? 'statusFree' : locker.status === 'occupied' ? 'statusOccupied' : locker.status === 'maintenance' ? 'statusMaintenance' : 'statusUnknown')}`}
              >
                {locker.id}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="min-w-0 rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-1 border-b border-border p-4">
          <h2 className="text-section-title font-semibold text-text-primary">{t('management')}</h2>
        </div>
        <p className="text-text-secondary text-xs">{t('lockerAssignmentBlocked')}</p>
      </div>
    </div>
  );
}
