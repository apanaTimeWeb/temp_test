'use client';
// RESPONSIBILITY: AdminSeatMatrixSeatMatrixPage component owned by admin_seat_matrix; responsibility folder: admin_seat_matrix_components_views.

import { useTranslations } from 'next-intl';

import useAdminSeatMatrixDialogFocus from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/hooks/useAdminSeatsMatrixDialogFocus';

import { useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, User, Printer, Download, MessageSquare, Building2 } from 'lucide-react';
import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import { useAdminSeatMatrixSeatMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/hooks/useAdminSeatsMatrixSeatMatrix';
import { ADMIN_SEAT_MATRIX_SEAT_OCCUPANCY_STATUS_BADGE_CLASS, ADMIN_SEAT_MATRIX_SHIFT_BADGE_CLASS, ADMIN_SEAT_MATRIX_SHIFTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config';
import { buildAdminSeatMatrixSeatMatrixCsv, downloadAdminSeatMatrixCsv } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/utils/AdminSeatsMatrixExportUtils';
import { displayValue } from '@/lib/display_value';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ALL_BRANCHES_ID } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';

const ADMIN_SEAT_MATRIX_LEGEND_ITEMS = [
  { cls: 'text-success-text', label: 'statusFree' },
  { cls: 'text-danger-text', label: 'statusOccupied' },
  { cls: 'text-warning-text', label: 'statusExpiring' },
  { cls: 'min-w-0 rounded-lg border border-border bg-card p-3', label: 'statusMaintenance' },
] as const;

export function AdminSeatMatrixSeatMatrixPage() {
  const t = useTranslations('ADMIN_SEAT_MATRIX');
  const { branches, selectedBranchId, selectedBranch, setSelectedBranchId, isAllBranches } = useAdminBranch();
  const [activeTab, setActiveTab] = useState<(typeof ADMIN_SEAT_MATRIX_SHIFTS)[number]>('All');
  const [selectedSeat, setSelectedSeat] = useState<AdminSeatMatrixSeatMatrixViewModel | null>(null);
  const seatDetailDialogRef = useRef<HTMLDivElement>(null);
  useAdminSeatMatrixDialogFocus(Boolean(selectedSeat), () => setSelectedSeat(null), seatDetailDialogRef);
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const seatMatrixQuery = useAdminSeatMatrixSeatMatrix();
  const seats = seatMatrixQuery.data ?? [];
  const isPending = seatMatrixQuery.isPending;
  const errorMessage = seatMatrixQuery.isError && seatMatrixQuery.data === undefined
    ? t('seatMatrixLoadError')
    : null;

  const branchFilteredSeats = useMemo(() => {
    if (isAllBranches) return seats;
    return seats.filter(seat => !seat.branchId || seat.branchId === selectedBranchId);
  }, [isAllBranches, seats, selectedBranchId]);

  const visible = useMemo(() => {
    if (activeTab === 'All') return branchFilteredSeats;
    return branchFilteredSeats.filter(seat => seat.shift === activeTab || seat.status === 'free' || seat.status === 'maintenance' || seat.status === 'unknown');
  }, [activeTab, branchFilteredSeats]);

  const downloadCsv = () => {
    const rows = [[t('seat'), t('status'), t('student'), t('shift'), t('plan'), t('locker'), t('expires')], ...visible.map(seat => [seat.id, seat.status, displayValue(seat.student), displayValue(seat.shift), displayValue(seat.plan), displayValue(seat.locker), displayValue(seat.expiry)])];
    const csv = buildAdminSeatMatrixSeatMatrixCsv(rows);
    downloadAdminSeatMatrixCsv(`seat-matrix-${date}.csv`, csv);
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap gap-2 mb-4" aria-label={t('seatMatrixActions')}>
        <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-t-md border-b-2 border-transparent px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={downloadCsv}><Download size={18} strokeWidth={2}/>{t('exportMatrix')}</button>
        <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-t-md border-b-2 border-transparent px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => window.print()}><Printer size={18} strokeWidth={2}/>{t('printFloorPlan')}</button>
        <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-t-md border-b-2 border-transparent px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" disabled title={t('studentNotificationContract')}><MessageSquare size={18} strokeWidth={2}/>{t('notifyStudents')}</button>
      </div>

      {seatMatrixQuery.isError && seatMatrixQuery.data !== undefined && <p role="status" className="text-warning-text text-caption">{t('seatMatrixRefreshFailed')}</p>}

      {/* Multi-Branch Floor Plan Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <Building2 size={14} className="text-primary shrink-0" />
            {t('branch')}:
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
            {t('allBranches')}
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

      <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2 border-b border-border" role="tablist" aria-label={t('seatShifts')}>
          {ADMIN_SEAT_MATRIX_SHIFTS.map(tab => (
            <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} tabIndex={activeTab === tab ? 0 : -1} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const index = ADMIN_SEAT_MATRIX_SHIFTS.indexOf(tab); const next = event.key === "ArrowRight" ? (index + 1) % ADMIN_SEAT_MATRIX_SHIFTS.length : (index - 1 + ADMIN_SEAT_MATRIX_SHIFTS.length) % ADMIN_SEAT_MATRIX_SHIFTS.length; setActiveTab(ADMIN_SEAT_MATRIX_SHIFTS[next]); } }} onClick={() => setActiveTab(tab)} className={`inline-flex min-h-11 items-center justify-center rounded-t-md border-b-2 border-transparent px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeTab === tab ? 'border-primary text-primary' : 'text-text-secondary'}`}>{tab === 'All' ? t('allShifts') : tab === 'Morning' ? t('morning') : tab === 'Evening' ? t('evening') : t('fullDay')}</button>
          ))}
        </div>
        <label className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-surface-hover"><CalendarDays size={18} strokeWidth={2} className="size-4 shrink-0 text-text-secondary" /><span className="text-xs text-text-secondary">{t('csvFilenameDate')}</span><input aria-label={t('csvFilenameDate')} type="date" className="min-h-11 rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={date} onChange={event => setDate(event.target.value)} /></label>
      </div>

      <div className="rounded-xl border border-border bg-card p-4" aria-label={t('seatMatrixLegend')}>
        {ADMIN_SEAT_MATRIX_LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="inline-flex items-center gap-2 text-sm">
            <span className={`min-w-0 rounded-lg border border-border bg-card p-3 ${item.cls}`} aria-hidden="true" />
            <span className="text-xs text-text-secondary">{t(item.label)}</span>
          </div>
        ))}
      </div>

      <div className="min-w-0 rounded-xl border border-border bg-card p-6 rounded-lg p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4"><h1 className="text-section-title font-semibold text-text-primary">{selectedBranch ? `${selectedBranch.name} Floor Plan` : t('floorPlan')}</h1><span className="text-xs text-text-secondary">{t('seatsFree', { count: visible.filter(seat => seat.status === 'free').length })}</span></div>
        {isPending ? <div className="py-12 text-center text-text-secondary" role="status">{t('loadingSeatMatrix')}</div> : errorMessage ? <div className="py-12 text-center"><p className="text-danger-text mb-3">{errorMessage}</p><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { void seatMatrixQuery.refetch(); }}>{t('retry')}</button></div> : visible.length === 0 ? <div className="py-12 text-center text-text-secondary">{t('noSeatsMatch')}</div> : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {visible.map(seat => (
              <button key={seat.uuid ?? seat.id} type="button" data-testid={`admin_seat_matrix-seat-${seat.id}`} className={`inline-flex min-h-11 items-center justify-center rounded-lg border p-2 text-sm font-semibold motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${ADMIN_SEAT_MATRIX_SEAT_OCCUPANCY_STATUS_BADGE_CLASS[seat.status] ?? 'border-border bg-card text-text-primary'}`} onClick={() => setSelectedSeat(seat)} title={seat.student ? `${displayValue(seat.student)} · ${displayValue(seat.shift)} · ${t('expires')} ${displayValue(seat.expiry, t('notAvailable'))}` : seat.status === 'maintenance' ? t('seatUnderMaintenance') : seat.status === 'unknown' ? t('seatStatusUnknownDescription') : t('seatAvailable')} aria-label={t('seatAccessibleLabel', { id: seat.id, status: t(seat.status === 'free' ? 'statusFree' : seat.status === 'occupied' ? 'statusOccupied' : seat.status === 'expiring' ? 'statusExpiring' : seat.status === 'maintenance' ? 'statusMaintenance' : 'statusUnknown') })}>{seat.id}</button>
            ))}
          </div>
        )}
      </div>

      {selectedSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="presentation" onClick={() => setSelectedSeat(null)}>
          <div ref={seatDetailDialogRef} className="w-full max-w-lg rounded-xl border border-border bg-overlay p-5 shadow-dialog" role="dialog" aria-modal="true" aria-labelledby="seat-detail-title" tabIndex={-1} onClick={event => event.stopPropagation()}>
            <div id="seat-detail-title" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className={ADMIN_SEAT_MATRIX_SEAT_OCCUPANCY_STATUS_BADGE_CLASS[selectedSeat.status]}>{t(selectedSeat.status === 'free' ? 'statusFree' : selectedSeat.status === 'occupied' ? 'statusOccupied' : selectedSeat.status === 'expiring' ? 'statusExpiring' : selectedSeat.status === 'maintenance' ? 'statusMaintenance' : 'statusUnknown')}</span>
              <span className="text-section-title font-semibold text-primary">{t('seatDetail', { id: selectedSeat.id })}</span>
            </div>
            {selectedSeat.status === 'occupied' || selectedSeat.status === 'expiring' ? (
              <>
                <div className="flex shrink-0 items-center justify-center"><div className="min-w-0 rounded-lg border border-border bg-card p-3"><User size={18} className="text-text-secondary" strokeWidth={2}/></div><h2 className="text-sm font-semibold text-text-primary">{displayValue(selectedSeat.student, t('student'))}</h2><p className="font-mono text-xs text-text-secondary">{displayValue(selectedSeat.smartId)}</p></div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[{ label: t('branch'), value: selectedSeat.branchName ?? selectedBranch?.name ?? t('notAvailable') }, { label: t('shift'), value: selectedSeat.shift ?? t('notAvailable'), isShift: true }, { label: t('phone'), value: selectedSeat.phone ?? t('notAvailable') }, { label: t('plan'), value: selectedSeat.plan ?? t('notAvailable') }, { label: t('locker'), value: selectedSeat.locker ?? t('notAvailable') }, { label: t('validFrom'), value: selectedSeat.validFrom ?? t('notAvailable') }, { label: t('expires'), value: selectedSeat.expiry ?? t('notAvailable') }].map(({ label, value, isShift }) => <div key={label} className="min-w-0 rounded-lg border border-border bg-card p-3"><p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p><p className="mt-1 break-words text-sm font-semibold text-text-primary">{isShift ? <span className={ADMIN_SEAT_MATRIX_SHIFT_BADGE_CLASS[value as keyof typeof ADMIN_SEAT_MATRIX_SHIFT_BADGE_CLASS] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-border bg-surface-highlight text-text-secondary'}>{value === 'Morning' ? t('morning') : value === 'Evening' ? t('evening') : value === 'Full Day' ? t('fullDay') : value}</span> : value}</p></div>)}
                </div>
              </>
            ) : selectedSeat.status === 'unknown' ? <p className="text-text-secondary text-xs" role="status">{t('seatStatusUnknownDescription')}</p> : <p className="text-text-secondary text-xs">{t('seatUnassigned')}</p>}
            <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-border pt-4"><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => setSelectedSeat(null)}>{t('close')}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
