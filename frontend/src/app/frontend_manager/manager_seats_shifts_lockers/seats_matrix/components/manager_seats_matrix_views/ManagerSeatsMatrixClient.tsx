'use client';
import { useTranslations } from 'next-intl';

import { CalendarDays } from 'lucide-react';
import { useManagerSeatsMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/hooks/useManagerSeatsMatrixSeatMatrix';
import { SHIFT_TABS, LEGEND_ITEMS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import { ManagerSeatsMatrixModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixModal';

// RESPONSIBILITY: Main Client view for Seat Matrix. Glues data hook to UI. It does not own backend persistence or cross-feature business logic.

export function ManagerSeatsMatrixClient() {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const shiftLabels: Record<string, string> = { Morning: tManagerUi('morning'), Evening: tManagerUi('evening'), 'Full Day': tManagerUi('full_day') };
  const shiftLabel = (value?: string) => value ? (shiftLabels[value] ?? value) : '';
  const {
    isError, isPending, isFetching, refetch, visible, freeCount,
    activeTab, setActiveTab,
    selectedSeat, setSelectedSeat,
  } = useManagerSeatsMatrix();

  if (isError) {
    return (
      <section className="ss-page p-8" role="alert" aria-live="assertive">
        <p className="text-danger font-semibold">{tManagerUi('unable_to_load_the_seat_matrix')}</p>
        <p className="text-secondary mt-2">{tManagerUi('check_your_connection_and_try_again')}</p>
        <button type="button" className="mgr-btn-primary mt-4" onClick={() => { void refetch(); }} disabled={isFetching}>
          {isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}
        </button>
      </section>
    );
  }

  return (
    <div className="ss-page">
      {/* ── Filter bar ── */}
      <div className="ss-matrix-filter-bar flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="ss-tab-group flex bg-floating p-1 rounded-lg border border-border">
          {SHIFT_TABS.map(({ value, labelKey }) => (
            <button type="button"
              key={value}
              onClick={() => setActiveTab(value)}
              className={`px-4 py-2 text-sm font-medium rounded-md motion-safe:transition-colors ${activeTab === value ? 'bg-card text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
            >
              {tManagerUi(labelKey)}
            </button>
          ))}
        </div>
        <div
          className="ss-date-btn flex items-center gap-2 bg-card border border-border px-3 py-2 rounded-lg text-secondary"
          aria-describedby="manager-seat-matrix-date-filter-help"
          title={tManagerUi('date_filtering_is_unavailable_because_the_supplied_seat_8f003e')}
        >
          <CalendarDays size={15} aria-hidden="true" />
          <span className="text-sm">{tManagerUi('date_filter_unavailable')}</span>
        </div>
      </div>
      <p id="manager-seat-matrix-date-filter-help" className="text-secondary text-xs mb-4" role="status">
        {tManagerUi('date_based_filtering_is_disabled_until_an_authoritative_a5c22e')}
      </p>

      {/* ── Legend ── */}
      <div className="ss-legend-card flex flex-wrap gap-6 mb-6 p-4 bg-card border border-border rounded-lg">
        {LEGEND_ITEMS.map(({ cls, labelKey }) => (
          <div key={labelKey} className="ss-legend-item flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${cls === 'ss-legend-dot--success' ? 'bg-success' : cls === 'ss-legend-dot--danger' ? 'bg-danger' : cls === 'ss-legend-dot--warning' ? 'bg-warning' : 'bg-surface-highlight'}`} />
            <span className="text-sm text-secondary">{tManagerUi(labelKey)}</span>
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="ss-card ss-card--p-lg ss-locker-grid-card bg-card border border-border rounded-xl p-6">
        <div className="ss-matrix-grid-header flex justify-between items-end mb-6 border-b border-border pb-4">
          <h2 className="text-xl font-bold text-primary">{tManagerUi('a_wing_floor_plan')}</h2>
          <span className="text-sm text-success font-medium">{isPending ? '…' : freeCount} {tManagerUi('seats_free_41c53c')}</span>
        </div>
        
        {isPending ? (
          <div className="flex items-center justify-center py-24 text-secondary">{tManagerUi('loading_seat_matrix')}</div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {visible.map((seat, index) => (
              <button type="button"
                key={seat.uuid || seat.id}
                className={`h-12 rounded-lg text-sm font-semibold flex items-center justify-center motion-safe:transition-transform hover:scale-105 active:scale-95 ${
                  seat.status === 'free' ? 'bg-floating border border-success text-success hover:bg-success hover:text-primary' :
                  seat.status === 'occupied' ? 'bg-danger text-on-danger border-transparent opacity-90' :
                  seat.status === 'expiring' ? 'bg-warning text-on-warning border-transparent' :
                  'bg-floating text-secondary border-transparent opacity-50 cursor-not-allowed'
                }`}
                disabled={seat.status === 'unknown'}
                onClick={() => setSelectedSeat(seat)}
                title={
                  seat.student
                    ? `${seat.student} · ${shiftLabel(seat.shift)} · ${tManagerUi('expires')} ${seat.expiry}`
                    : seat.status === 'maintenance' ? tManagerUi('under_maintenance') : seat.status === 'unknown' ? tManagerUi('unknown_status') : tManagerUi('available')
                }
              >
                {seat.id}
              </button>
            ))}
          </div>
        )}
      </div>

      <ManagerSeatsMatrixModal selectedSeat={selectedSeat} onClose={() => setSelectedSeat(null)} />
    </div>
  );
}
