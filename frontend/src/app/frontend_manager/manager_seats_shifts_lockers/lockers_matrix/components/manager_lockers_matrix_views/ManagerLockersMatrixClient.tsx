'use client';
import { useTranslations } from 'next-intl';

import { useRef, useState } from 'react';
import { useManagerLockerMatrixDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/hooks/ManagerLockersMatrixDialogFocus';
import { useRouter } from 'next/navigation';
import { useManagerLockerMatrixLockers } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/hooks/useManagerLockersMatrixTables';
import { LEGEND_ITEMS } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/constants/ManagerLockersMatrixConstants';
import { MANAGER_LOCKERS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/config/manager_lockers_matrix.url_config';

// RESPONSIBILITY: Render locker matrix UI using mocked data It does not own backend persistence or cross-feature business logic.
export function ManagerLockersMatrixClient() {
  const tManagerUi = useTranslations('manager.manager_locker_matrix.ui');
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerLockerMatrixDialogFocus(dialogRef, () => setAssignTarget(null), Boolean(assignTarget));
  const lockersQuery = useManagerLockerMatrixLockers();
  const lockerData = lockersQuery.data ?? [];
  const router = useRouter();
  const stats = { total: lockerData.length, available: lockerData.filter((locker) => locker.status === 'free').length, occupied: lockerData.filter((locker) => locker.status === 'occupied').length, service: lockerData.filter((locker) => locker.status === 'maintenance').length };

  function handleCellClick(id: string, status: string, smartId?: string) {
    if (status === 'free') setAssignTarget(id);
    if (status === 'occupied' && smartId) {
      router.push(MANAGER_LOCKERS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(smartId));
    }
  }

  if (lockersQuery.isError) return <div className="ss-page"><div className="ss-empty-state"><p className="ss-empty-state__title">{tManagerUi('unable_to_load_lockers')}</p><button type="button" className="ss-btn-ghost" onClick={() => lockersQuery.refetch()}>{tManagerUi('retry')}</button></div></div>;
  if (lockersQuery.isPending) return <div className="ss-page"><div className="ss-empty-state"><p className="ss-empty-state__title">{tManagerUi('loading_lockers')}</p></div></div>;

  return (
    <>
    <div className="ss-page">
      <div className="ss-page-header">
        <div>
          <h1 className="ss-page-title">{tManagerUi('locker_matrix')}</h1>
          <p className="ss-page-subtitle">{tManagerUi('sample_locker_status_matrix_select_a_cell_to_preview_the_1f5b32')}</p>
          <p className="ss-page-subtitle" role="status" data-testid="manager-locker-matrix-contract-warning">{tManagerUi('locker_assignments_are_unavailable_until_the_host_assign_6050d0')}</p>
        </div>
        <div className="ss-card ss-card--p-sm">
          <div className="ss-legend-compact">
            {LEGEND_ITEMS.map(({ cls, labelKey }) => (
              <div key={labelKey} className="ss-legend-item">
                <span className={`ss-legend-dot ${cls}`} />
                <span className="ss-legend-label">{tManagerUi(labelKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ss-locker-stats">
        {[
          { labelKey: 'total_capacity', value: String(stats.total), border: 'ss-kpi-card__border-primary', valueClass: 'ss-kpi-card__value--primary' },
          { labelKey: 'available', value: String(stats.available), border: 'ss-kpi-card__border-success', valueClass: 'ss-kpi-card__value--success' },
          { labelKey: 'occupied', value: String(stats.occupied), border: 'ss-kpi-card__border-danger', valueClass: 'ss-kpi-card__value--danger' },
          { labelKey: 'service_required', value: String(stats.service).padStart(2, '0'), border: 'ss-kpi-card__border-warning', valueClass: 'ss-kpi-card__value--warning' },
        ].map(({ labelKey, value, border, valueClass }) => (
          <div key={labelKey} className={`ss-kpi-card ${border}`}>
            <span className="ss-kpi-card__label">{tManagerUi(labelKey)}</span>
            <span className={`ss-kpi-card__value ${valueClass}`}>{value}</span>
          </div>
        ))}
      </div>

      <div className="ss-card ss-card--p-lg ss-locker-grid-card">
        <div className="ss-locker-grid">
          {lockerData.map(({ uuid, id, status, smartId }, index) => (
            <button
              type="button"
              key={uuid || id}
              className={`ss-locker-cell ss-locker-cell--${status}`}
              onClick={() => handleCellClick(id, status, smartId)}
              disabled={status === 'maintenance' || status === 'unknown' || (status === 'occupied' && !smartId)}
              title={status === 'free' ? tManagerUi('available_click_to_assign') : status === 'occupied' ? smartId ? tManagerUi('occupied_click_to_view_student') : tManagerUi('occupied_student_identity_unavailable') : status === 'maintenance' ? tManagerUi('under_maintenance') : tManagerUi('unknown_status')}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div className="ss-locker-bottom-grid">
        <div className="ss-card">
          <div className="ss-card-header">
            <h3 className="ss-section-heading">{tManagerUi('locker_summary')}</h3>
            <button type="button" className="ss-btn-ghost ss-btn--sm" onClick={() => router.push(MANAGER_LOCKERS_MATRIX_ROUTES.lockersList)}>{tManagerUi('view_all')}</button>
          </div>
          <p className="ss-table__cell-sub">{tManagerUi('available_lockers')} {stats.available}{tManagerUi('occupied_lockers')} {stats.occupied}{tManagerUi('maintenance_8f2233')} {stats.service}.</p>
        </div>
        <div className="ss-card ss-card--primary-accent ss-toolkit-card">
          <div>
            <h3 className="ss-section-heading ss-section-heading--primary ss-toolkit-heading">{tManagerUi('management_toolkit')}</h3>
            <p className="ss-toolkit-desc">{tManagerUi('locker_bulk_management_and_grid_configuration_are_intent_bf2553')}</p>
          </div>
        </div>
      </div>
    </div>
    {assignTarget && (
      <div className="ss-modal-overlay" onClick={() => setAssignTarget(null)}>
        <div ref={dialogRef} tabIndex={-1} className="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-locker-matrix-assign-title" onClick={e => e.stopPropagation()}>
          <h2 id="ss-locker-matrix-assign-title" className="ss-modal-title">{tManagerUi('assign_locker')} {assignTarget}</h2>
          <p className="ss-modal-desc">{tManagerUi('locker_99c23e')} <strong>{assignTarget}</strong> {tManagerUi('is_available')}</p>
          <div className="ss-modal-footer">
            <button type="button" className="ss-btn-ghost" onClick={() => setAssignTarget(null)}>{tManagerUi('cancel')}</button>
            <button type="button" className="ss-btn-primary cursor-not-allowed" disabled title={tManagerUi('locker_assignment_unavailable_verified_host_mutation_con_03bf86')}>{tManagerUi('assign_student_unavailable')}</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
