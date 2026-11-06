'use client';
// RESPONSIBILITY: AdminSeatMatrixSeatMatrixPage component owned by admin_seat_matrix; responsibility folder: admin_seat_matrix_components_views.

import { useTranslations } from 'next-intl';
import useAdminSeatMatrixDialogFocus from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/hooks/useAdminSeatsMatrixDialogFocus';
import { useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, User, Printer, Download, MessageSquare, Building2, Search, Sparkles } from 'lucide-react';
import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import { useAdminSeatMatrixSeatMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/hooks/useAdminSeatsMatrixSeatMatrix';
import { ADMIN_SEAT_MATRIX_SEAT_OCCUPANCY_STATUS_BADGE_CLASS, ADMIN_SEAT_MATRIX_SHIFT_BADGE_CLASS, ADMIN_SEAT_MATRIX_SHIFTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config';
import { buildAdminSeatMatrixSeatMatrixCsv, downloadAdminSeatMatrixCsv } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/utils/AdminSeatsMatrixExportUtils';
import { displayValue } from '@/lib/display_value';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ALL_BRANCHES_ID } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';

const ADMIN_SEAT_MATRIX_LEGEND_ITEMS = [
  { cls: 'border-success-text bg-success-bg text-success-text', label: 'statusFree' },
  { cls: 'border-danger-text bg-danger-bg text-danger-text', label: 'statusOccupied' },
  { cls: 'border-warning-text bg-warning-bg text-warning-text', label: 'statusExpiring' },
  { cls: 'border-border bg-card text-text-secondary', label: 'statusMaintenance' },
] as const;

function computeShiftOccupancy(seat: AdminSeatMatrixSeatMatrixViewModel) {
  if (seat.status === 'free' || seat.status === 'maintenance') {
    return { morning: false, afternoon: false, evening: false, night: false };
  }
  const shiftStr = (seat.shift || '').toLowerCase();
  if (shiftStr.includes('full') || (seat.status === 'occupied' && !seat.shift)) {
    return { morning: true, afternoon: true, evening: true, night: true };
  }
  const m = shiftStr.includes('morning');
  const a = shiftStr.includes('afternoon');
  const e = shiftStr.includes('evening');
  const n = shiftStr.includes('night');
  return {
    morning: m || (!a && !e && !n),
    afternoon: a,
    evening: e,
    night: n,
  };
}

export function AdminSeatMatrixSeatMatrixPage() {
  const t = useTranslations('ADMIN_SEAT_MATRIX');
  const { branches, selectedBranchId, selectedBranch, setSelectedBranchId, isAllBranches } = useAdminBranch();
  const [activeTab, setActiveTab] = useState<(typeof ADMIN_SEAT_MATRIX_SHIFTS)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');
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
    let result = branchFilteredSeats;
    if (activeTab !== 'All') {
      result = result.filter(seat => seat.shift === activeTab || seat.status === 'free' || seat.status === 'maintenance' || seat.status === 'unknown');
    }
    return result;
  }, [activeTab, branchFilteredSeats]);

  const query = searchQuery.trim().toLowerCase();

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
              isAllBranches ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            {t('allBranches')} ({seats.length})
          </button>
          {branches.map((branch) => {
            const count = seats.filter((s) => !s.branchId || s.branchId === branch.id).length;
            const isSelected = selectedBranchId === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => setSelectedBranchId(branch.id)}
                className={`min-h-8 rounded-full px-3 py-1 text-xs font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {branch.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Shift Tabs & Real-Time Search Bar */}
      <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 border-b border-border pb-1" role="tablist" aria-label={t('seatShifts')}>
          {ADMIN_SEAT_MATRIX_SHIFTS.map(tab => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex min-h-10 items-center justify-center rounded-t-md border-b-2 px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
            >
              {tab === 'All' ? t('allShifts') : tab === 'Morning' ? t('morning') : tab === 'Afternoon' ? t('afternoon') : tab === 'Evening' ? t('evening') : tab === 'Night' ? t('night') : t('fullDay')}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Search seat, student, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-10 w-full rounded-md border border-border bg-input pl-9 pr-3 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <label className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-text-secondary">
            <CalendarDays size={14} className="shrink-0" />
            <input aria-label={t('csvFilenameDate')} type="date" className="rounded border-0 bg-transparent text-xs text-text-primary focus:outline-none" value={date} onChange={e => setDate(e.target.value)} />
          </label>
        </div>
      </div>

      {/* Legend & Shift LEDs Guide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {ADMIN_SEAT_MATRIX_LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="inline-flex items-center gap-1.5">
              <span className={`h-3 w-3 rounded border ${item.cls}`} aria-hidden="true" />
              <span className="text-text-secondary">{t(item.label)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-highlight border border-border text-xs">
          <Sparkles size={14} className="text-primary shrink-0" />
          <span className="font-semibold text-text-primary">Shift LEDs:</span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-success-bg text-success-text border border-success-text">M/A/E/N = Free</span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-danger-bg text-danger-text border border-danger-text">M/A/E/N = Booked</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="min-w-0 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-section-title font-semibold text-text-primary">{selectedBranch ? `${selectedBranch.name} Floor Plan` : t('floorPlan')}</h1>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-success-bg text-success-text border border-success-text">
            {t('seatsFree', { count: visible.filter(seat => seat.status === 'free').length })}
          </span>
        </div>

        {isPending ? (
          <div className="py-12 text-center text-text-secondary" role="status">{t('loadingSeatMatrix')}</div>
        ) : errorMessage ? (
          <div className="py-12 text-center">
            <p className="text-danger-text mb-3">{errorMessage}</p>
            <button type="button" className="admin-btn-primary" onClick={() => { void seatMatrixQuery.refetch(); }}>{t('retry')}</button>
          </div>
        ) : visible.length === 0 ? (
          <div className="py-12 text-center text-text-secondary">{t('noSeatsMatch')}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
            {visible.map(seat => {
              const dots = computeShiftOccupancy(seat);
              const isMatch = query && (
                seat.id.toLowerCase().includes(query) ||
                (seat.student && seat.student.toLowerCase().includes(query)) ||
                (seat.smartId && seat.smartId.toLowerCase().includes(query))
              );
              const isDimmed = Boolean(query && !isMatch);

              return (
                <button
                  key={seat.uuid ?? seat.id}
                  type="button"
                  data-testid={`admin_seat_matrix-seat-${seat.id}`}
                  onClick={() => setSelectedSeat(seat)}
                  className={`h-24 rounded-xl border p-2 flex flex-col justify-between text-xs font-semibold motion-safe:transition-all cursor-pointer relative ${
                    isMatch ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-105 z-10' : isDimmed ? 'opacity-30' : 'hover:scale-102'
                  } ${ADMIN_SEAT_MATRIX_SEAT_OCCUPANCY_STATUS_BADGE_CLASS[seat.status] ?? 'border-border bg-card text-text-primary'}`}
                  title={seat.student ? `${displayValue(seat.student)} · ${displayValue(seat.shift)} · Expires: ${displayValue(seat.expiry, t('notAvailable'))}` : `Seat #${seat.id} Available`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-bold">S-{seat.id}</span>
                    <span className="text-[10px] font-normal uppercase opacity-75">{seat.status}</span>
                  </div>

                  <div className="text-[11px] truncate w-full text-left font-normal">
                    {seat.student ? displayValue(seat.student) : <span className="text-success-text font-medium">Available</span>}
                  </div>

                  {/* 4 Shift Glowing LED Indicators (M, A, E, N) */}
                  <div className="flex items-center justify-between w-full pt-1 border-t border-border">
                    <span title={`Morning: ${dots.morning ? 'Booked' : 'Free'}`} className={`text-[9px] font-mono font-bold px-1 rounded ${dots.morning ? 'bg-danger-bg text-danger-text border border-danger-text' : 'bg-success-bg text-success-text border border-success-text'}`}>M</span>
                    <span title={`Afternoon: ${dots.afternoon ? 'Booked' : 'Free'}`} className={`text-[9px] font-mono font-bold px-1 rounded ${dots.afternoon ? 'bg-danger-bg text-danger-text border border-danger-text' : 'bg-success-bg text-success-text border border-success-text'}`}>A</span>
                    <span title={`Evening: ${dots.evening ? 'Booked' : 'Free'}`} className={`text-[9px] font-mono font-bold px-1 rounded ${dots.evening ? 'bg-danger-bg text-danger-text border border-danger-text' : 'bg-success-bg text-success-text border border-success-text'}`}>E</span>
                    <span title={`Night: ${dots.night ? 'Booked' : 'Free'}`} className={`text-[9px] font-mono font-bold px-1 rounded ${dots.night ? 'bg-danger-bg text-danger-text border border-danger-text' : 'bg-success-bg text-success-text border border-success-text'}`}>N</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Seat Detail Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="presentation" onClick={() => setSelectedSeat(null)}>
          <div ref={seatDetailDialogRef} className="w-full max-w-lg rounded-xl border border-border bg-overlay p-5 shadow-dialog" role="dialog" aria-modal="true" aria-labelledby="seat-detail-title" tabIndex={-1} onClick={e => e.stopPropagation()}>
            <div id="seat-detail-title" className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-base font-semibold text-primary">{t('seatDetail', { id: selectedSeat.id })}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${ADMIN_SEAT_MATRIX_SEAT_OCCUPANCY_STATUS_BADGE_CLASS[selectedSeat.status]}`}>{t(selectedSeat.status === 'free' ? 'statusFree' : selectedSeat.status === 'occupied' ? 'statusOccupied' : selectedSeat.status === 'expiring' ? 'statusExpiring' : selectedSeat.status === 'maintenance' ? 'statusMaintenance' : 'statusUnknown')}</span>
            </div>
            {selectedSeat.status === 'occupied' || selectedSeat.status === 'expiring' ? (
              <div className="my-4 space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <div className="rounded-full bg-surface-highlight p-2 text-text-secondary"><User size={18} strokeWidth={2}/></div>
                  <div><h2 className="text-sm font-semibold text-text-primary">{displayValue(selectedSeat.student, t('student'))}</h2><p className="font-mono text-xs text-text-secondary">{displayValue(selectedSeat.smartId)}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[{ label: t('branch'), value: selectedSeat.branchName ?? selectedBranch?.name ?? t('notAvailable') }, { label: t('shift'), value: selectedSeat.shift ?? t('notAvailable'), isShift: true }, { label: t('phone'), value: selectedSeat.phone ?? t('notAvailable') }, { label: t('plan'), value: selectedSeat.plan ?? t('notAvailable') }, { label: t('locker'), value: selectedSeat.locker ?? t('notAvailable') }, { label: t('validFrom'), value: selectedSeat.validFrom ?? t('notAvailable') }, { label: t('expires'), value: selectedSeat.expiry ?? t('notAvailable') }].map(({ label, value, isShift }) => (
                    <div key={label} className="rounded-lg border border-border bg-card p-2.5">
                      <p className="text-[11px] text-text-secondary uppercase">{label}</p>
                      <p className="mt-0.5 font-semibold text-text-primary break-words">{isShift ? <span className={ADMIN_SEAT_MATRIX_SHIFT_BADGE_CLASS[value as keyof typeof ADMIN_SEAT_MATRIX_SHIFT_BADGE_CLASS] ?? 'inline-block px-2 py-0.5 rounded text-xs'}>{value}</span> : value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="text-text-secondary text-xs my-4">{selectedSeat.status === 'maintenance' ? t('seatUnderMaintenance') : t('seatUnassigned')}</p>}
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <button type="button" className="admin-btn-ghost min-h-10" onClick={() => setSelectedSeat(null)}>{t('close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminSeatMatrixSeatMatrixPage;
