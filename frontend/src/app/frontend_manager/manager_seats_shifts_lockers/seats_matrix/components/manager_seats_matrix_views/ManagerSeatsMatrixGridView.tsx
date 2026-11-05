'use client';
import { useTranslations } from 'next-intl';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { LEGEND_ITEMS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';

interface ManagerSeatsMatrixGridViewProps {
  visibleGridSeats: SeatData[];
  isPending: boolean;
  freeCount: number;
  onSelectSeat: (seat: SeatData) => void;
  shiftLabel: (val?: string) => string;
}

export function ManagerSeatsMatrixGridView({
  visibleGridSeats,
  isPending,
  freeCount,
  onSelectSeat,
  shiftLabel,
}: ManagerSeatsMatrixGridViewProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');

  return (
    <>
      {/* ── Legend ── */}
      <div className="ss-legend-card flex flex-wrap gap-6 mb-6 p-4 bg-card border border-border rounded-lg">
        {LEGEND_ITEMS.map(({ cls, labelKey }) => (
          <div key={labelKey} className="ss-legend-item flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                cls === 'ss-legend-dot--success'
                  ? 'bg-success'
                  : cls === 'ss-legend-dot--danger'
                  ? 'bg-danger'
                  : cls === 'ss-legend-dot--warning'
                  ? 'bg-warning'
                  : 'bg-surface-highlight'
              }`}
            />
            <span className="text-sm text-secondary">{tManagerUi(labelKey)}</span>
          </div>
        ))}
      </div>

      <div className="ss-card ss-card--p-lg ss-locker-grid-card bg-card border border-border rounded-xl p-6">
        <div className="ss-matrix-grid-header flex justify-between items-end mb-6 border-b border-border pb-4">
          <h2 className="text-xl font-bold text-primary">{tManagerUi('a_wing_floor_plan')}</h2>
          <span className="text-sm text-success font-medium">
            {isPending ? '…' : freeCount} {tManagerUi('seats_free_41c53c')}
          </span>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-24 text-secondary">
            {tManagerUi('loading_seat_matrix')}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {visibleGridSeats.map((seat) => (
              <button
                type="button"
                key={seat.uuid || seat.id}
                className={`h-12 rounded-lg text-sm font-semibold flex items-center justify-center motion-safe:transition-transform hover:scale-105 active:scale-95 ${
                  seat.status === 'free'
                    ? 'bg-floating border border-success text-success hover:bg-success hover:text-primary'
                    : seat.status === 'occupied'
                    ? 'bg-danger text-on-danger border-transparent opacity-90'
                    : seat.status === 'expiring'
                    ? 'bg-warning text-on-warning border-transparent'
                    : 'bg-floating text-secondary border-transparent opacity-50 cursor-not-allowed'
                }`}
                disabled={seat.status === 'unknown'}
                onClick={() => onSelectSeat(seat)}
                title={
                  seat.student
                    ? `${seat.student} · ${shiftLabel(seat.shift)} · ${tManagerUi('expires')} ${seat.expiry}`
                    : seat.status === 'maintenance'
                    ? tManagerUi('under_maintenance')
                    : seat.status === 'unknown'
                    ? tManagerUi('unknown_status')
                    : tManagerUi('available')
                }
              >
                {seat.id}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

