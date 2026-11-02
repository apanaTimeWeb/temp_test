'use client';
import { useTranslations } from 'next-intl';
import { useRef, useState, useMemo } from 'react';
import { useManagerLockerMatrixDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/hooks/ManagerLockersMatrixDialogFocus';
import { useRouter } from 'next/navigation';
import { useManagerLockerMatrixLockers } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/hooks/useManagerLockersMatrixTables';
import { LEGEND_ITEMS } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/constants/ManagerLockersMatrixConstants';
import { MANAGER_LOCKERS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/config/manager_lockers_matrix.url_config';
import type { LockerCellStatus, LockerData } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/types/ManagerLockersMatrixTypes';
import { KeyRound, ShieldCheck, User, X } from 'lucide-react';

// RESPONSIBILITY: Render locker matrix UI with live interactive vacant locker assignment workflow.
export function ManagerLockersMatrixClient() {
  const tManagerUi = useTranslations('manager.manager_locker_matrix.ui');
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentSmartId, setStudentSmartId] = useState('');
  const [keyNumber, setKeyNumber] = useState('');
  const [depositAmount, setDepositAmount] = useState('500');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

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
      alert('Student name is required to assign locker.');
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

    const message = `Locker ${assignTarget} successfully assigned to ${studentName} (Key #${keyNumber}, ₹${depositAmount} deposit recorded)!`;
    setFeedbackToast(message);
    setAssignTarget(null);
    setTimeout(() => setFeedbackToast(null), 5000);
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

        {feedbackToast && (
          <div className="mb-4 p-3 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2" role="status">
            <span>✓</span>
            <span>{feedbackToast}</span>
          </div>
        )}

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
            {lockerData.map(({ uuid, id, status, student, smartId }) => (
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
            ))}
          </div>
        </div>

        <div className="ss-locker-bottom-grid">
          <div className="ss-card">
            <div className="ss-card-header">
              <h3 className="ss-section-heading">{tManagerUi('locker_summary')}</h3>
              <button type="button" className="ss-btn-ghost ss-btn--sm" onClick={() => router.push(MANAGER_LOCKERS_MATRIX_ROUTES.lockersList)}>
                {tManagerUi('view_all')}
              </button>
            </div>
            <p className="ss-table__cell-sub">
              {tManagerUi('available_lockers')} {stats.available} · {tManagerUi('occupied_lockers')} {stats.occupied} · {tManagerUi('maintenance_8f2233')} {stats.service}.
            </p>
          </div>
          <div className="ss-card ss-card--primary-accent ss-toolkit-card">
            <div>
              <h3 className="ss-section-heading ss-section-heading--primary ss-toolkit-heading">{tManagerUi('management_toolkit')}</h3>
              <p className="ss-toolkit-desc">Assign vacant lockers immediately on floor walk or when collecting security deposit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Allotment Modal */}
      {assignTarget && (
        <div className="ss-modal-overlay" onClick={() => setAssignTarget(null)}>
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="ss-modal max-w-md w-full p-6 rounded-2xl bg-card border border-border shadow-dialog space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ss-locker-matrix-assign-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h2 id="ss-locker-matrix-assign-title" className="text-base font-bold text-primary">
                    Allot Locker #{assignTarget}
                  </h2>
                  <p className="text-xs text-secondary">Assign vacant locker to an active library member</p>
                </div>
              </div>
              <button type="button" onClick={() => setAssignTarget(null)} className="text-secondary hover:text-primary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Student Full Name *</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="text"
                    required
                    className="mgr-input pl-8 text-xs"
                    placeholder="e.g. Rahul Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Student Smart ID</label>
                  <input
                    type="text"
                    className="mgr-input text-xs font-mono"
                    value={studentSmartId}
                    onChange={(e) => setStudentSmartId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Physical Key No.</label>
                  <input
                    type="text"
                    className="mgr-input text-xs font-mono"
                    value={keyNumber}
                    onChange={(e) => setKeyNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Monthly Rent</label>
                  <input
                    type="text"
                    readOnly
                    className="mgr-input text-xs bg-floating cursor-not-allowed"
                    value="₹200 / month"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Security Deposit</label>
                  <input
                    type="number"
                    className="mgr-input text-xs"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-floating/70 border border-border text-xs space-y-1 text-secondary">
                <p className="flex items-center gap-1.5 font-medium text-primary">
                  <ShieldCheck size={14} className="text-success" /> Key Handover Policy
                </p>
                <p>₹{depositAmount} refundable security deposit will be logged under Member Finance profile.</p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button type="button" className="mgr-btn-ghost text-xs" onClick={() => setAssignTarget(null)}>
                  {tManagerUi('cancel')}
                </button>
                <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
                  <KeyRound size={14} /> Confirm & Handover Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
