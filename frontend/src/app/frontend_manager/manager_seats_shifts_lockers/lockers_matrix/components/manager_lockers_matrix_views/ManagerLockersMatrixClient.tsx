'use client';

import { useRef, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { useManagerLockerMatrixDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/hooks/ManagerLockersMatrixDialogFocus';
import { useManagerLockerMatrixLockers } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/hooks/useManagerLockersMatrixTables';
import { LEGEND_ITEMS } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/constants/ManagerLockersMatrixConstants';
import { MANAGER_LOCKERS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/config/manager_lockers_matrix.url_config';
import type { LockerCellStatus, LockerData } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/types/ManagerLockersMatrixTypes';
import { ManagerLockersMatrixAllotModal } from './ManagerLockersMatrixAllotModal';

// RESPONSIBILITY: Render locker matrix UI with live interactive vacant locker assignment workflow.
export function ManagerLockersMatrixClient() {
  const tManagerUi = useTranslations('manager.manager_locker_matrix.ui');
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentSmartId, setStudentSmartId] = useState('');
  const [keyNumber, setKeyNumber] = useState('');
  const [depositAmount, setDepositAmount] = useState('500');

  // Local overrides for newly assigned lockers
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, { status: LockerCellStatus; student: string; smartId: string }>
  >({});

  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerLockerMatrixDialogFocus(dialogRef, () => setAssignTarget(null), Boolean(assignTarget));

  const lockersQuery = useManagerLockerMatrixLockers();
  const rawLockers = lockersQuery.data ?? [];

  const lockerData: LockerData[] = useMemo(() => {
    return rawLockers.map((locker) => {
      const override = localOverrides[locker.id];
      if (override) {
        return {
          ...locker,
          status: override.status,
          student: override.student,
          smartId: override.smartId,
        };
      }
      return locker;
    });
  }, [rawLockers, localOverrides]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'occupied' | 'maintenance'>('all');

  const filteredLockers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lockerData.filter((locker) => {
      if (statusFilter !== 'all' && locker.status !== statusFilter) return false;
      if (!q) return true;
      const matchesId = locker.id.toLowerCase().includes(q);
      const matchesStudent = locker.student?.toLowerCase().includes(q) ?? false;
      const matchesSmartId = locker.smartId?.toLowerCase().includes(q) ?? false;
      return matchesId || matchesStudent || matchesSmartId;
    });
  }, [lockerData, searchQuery, statusFilter]);

  const router = useRouter();
  const stats = {
    total: lockerData.length,
    available: lockerData.filter((locker) => locker.status === 'free').length,
    occupied: lockerData.filter((locker) => locker.status === 'occupied').length,
    service: lockerData.filter((locker) => locker.status === 'maintenance').length,
  };

  function handleCellClick(id: string, status: string, smartId?: string) {
    if (status === 'free') {
      setAssignTarget(id);
      setKeyNumber(`KEY-${id}`);
      setStudentName('');
      setStudentSmartId(`LIB-${Math.floor(1000 + Math.random() * 9000)}`);
    }
    if (status === 'occupied' && smartId) {
      router.push(MANAGER_LOCKERS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(smartId));
    }
  }

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTarget) return;
    if (!studentName.trim()) {
      toast.error('Student name is required to assign locker.');
      return;
    }

    setLocalOverrides((prev) => ({
      ...prev,
      [assignTarget]: {
        status: 'occupied',
        student: studentName.trim(),
        smartId: studentSmartId.trim() || 'LIB-TEMP',
      },
    }));

    toast.success(
      `Locker ${assignTarget} successfully assigned to ${studentName} (Key #${keyNumber}, ₹${depositAmount} deposit recorded)!`
    );
    setAssignTarget(null);
  };

  if (lockersQuery.isError)
    return (
      <div className="ss-page">
        <div className="ss-empty-state">
          <p className="ss-empty-state__title">{tManagerUi('unable_to_load_lockers')}</p>
          <button type="button" className="ss-btn-ghost" onClick={() => lockersQuery.refetch()}>
            {tManagerUi('retry')}
          </button>
        </div>
      </div>
    );
  if (lockersQuery.isPending)
    return (
      <div className="ss-page">
        <div className="ss-empty-state">
          <p className="ss-empty-state__title">{tManagerUi('loading_lockers')}</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">{tManagerUi('locker_matrix')}</h1>
            <p className="ss-page-subtitle">Interactive floor locker matrix with instant vacant locker allotment</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/frontend_manager/manager_seats_shifts_lockers/lockers_management')}
              className="mgr-btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-lg"
            >
              Unified Lockers View →
            </button>
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

        {/* ── Locker Search & Status Filter Bar ── */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locker by number, student, or ID..."
              className="mgr-input pl-9 text-xs sm:text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['all', 'free', 'occupied', 'maintenance'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-highlight text-secondary hover:text-primary'
                }`}
              >
                {status === 'all'
                  ? 'All Lockers'
                  : status === 'free'
                  ? 'Available'
                  : status === 'occupied'
                  ? 'Occupied'
                  : 'Maintenance'}
              </button>
            ))}
          </div>
        </div>

        <div className="ss-card ss-card--p-lg ss-locker-grid-card">
          <div className="ss-locker-grid">
            {filteredLockers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-secondary">
                No lockers matching current filter criteria.
              </div>
            ) : (
              filteredLockers.map(({ uuid, id, status, student, smartId }) => (
                <button
                  type="button"
                  key={uuid || id}
                  className={`ss-locker-cell ss-locker-cell--${status}`}
                  onClick={() => handleCellClick(id, status, smartId)}
                  disabled={status === 'maintenance' || status === 'unknown'}
                  title={
                    status === 'free'
                      ? `Locker ${id} is Available. Click to Assign Student.`
                      : status === 'occupied'
                      ? `${student || 'Student'} (${smartId || 'ID'}) · Locker ${id}`
                      : status === 'maintenance'
                      ? tManagerUi('under_maintenance')
                      : tManagerUi('unknown_status')
                  }
                >
                  {id}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="ss-locker-bottom-grid">
          <div className="ss-card">
            <div className="ss-card-header">
              <h3 className="ss-section-heading">{tManagerUi('locker_summary')}</h3>
              <button
                type="button"
                className="ss-btn-ghost ss-btn--sm"
                onClick={() => router.push(MANAGER_LOCKERS_MATRIX_ROUTES.lockersList)}
              >
                {tManagerUi('view_all')}
              </button>
            </div>
            <p className="ss-table__cell-sub">
              {tManagerUi('available_lockers')} {stats.available} · {tManagerUi('occupied_lockers')} {stats.occupied} ·{' '}
              {tManagerUi('maintenance_8f2233')} {stats.service}.
            </p>
          </div>
          <div className="ss-card ss-card--primary-accent ss-toolkit-card">
            <div>
              <h3 className="ss-section-heading ss-section-heading--primary ss-toolkit-heading">
                {tManagerUi('management_toolkit')}
              </h3>
              <p className="ss-toolkit-desc">
                Assign vacant lockers immediately on floor walk or when collecting security deposit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Allotment Modal */}
      {assignTarget && (
        <ManagerLockersMatrixAllotModal
          assignTarget={assignTarget} dialogRef={dialogRef}
          studentName={studentName} setStudentName={setStudentName}
          studentSmartId={studentSmartId} setStudentSmartId={setStudentSmartId}
          keyNumber={keyNumber} setKeyNumber={setKeyNumber}
          depositAmount={depositAmount} setDepositAmount={setDepositAmount}
          onClose={() => setAssignTarget(null)} onSubmit={handleConfirmAssignment}
        />
      )}
    </>
  );
}
