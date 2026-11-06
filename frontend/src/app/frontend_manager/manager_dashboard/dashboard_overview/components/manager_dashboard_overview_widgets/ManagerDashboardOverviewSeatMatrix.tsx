'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Armchair, ArrowUpRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { ManagerDashboardOverviewEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/ManagerDashboardOverviewEmptyState';
import { SEAT_CLASS } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/constants/ManagerDashboardOverviewConstants';
import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';
import type { ManagerDashboardOverviewSeatMatrixProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';

export function ManagerDashboardOverviewSeatMatrix({
  seatData,
  timeRangeLabel,
}: ManagerDashboardOverviewSeatMatrixProps & { timeRangeLabel?: string }) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const router = useRouter();

  if (!seatData || seatData.length === 0) {
    return (
      <ManagerDashboardOverviewEmptyState
        className="mgr-card p-6 text-sm text-secondary"
        testId="manager-dashboard-seat-matrix-empty"
      >
        {tManagerUi('no_seat_data_available')}
      </ManagerDashboardOverviewEmptyState>
    );
  }

  const availableCount = seatData.filter((s) => s.status === 'available').length;
  const occupiedCount = seatData.filter((s) => s.status === 'occupied').length;
  const expiringCount = seatData.filter((s) => s.status === 'expiring').length;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-highlight border border-border text-primary flex items-center justify-center font-bold">
              <Armchair size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  {tManagerUi('mini_seat_matrix_today_apos_s_shifts')}
                </h2>
                {timeRangeLabel && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                    [{timeRangeLabel}]
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Current shift snapshot • Click seat to inspect allocated student
              </p>
            </div>
          </div>

          <Link
            href="/frontend_manager/manager_seats_shifts_lockers/seats_matrix"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline group"
          >
            <span>Full Matrix</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Seat Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {seatData.map((seat) => {
            const isAvailable = seat.status === 'available';
            const isOccupied = seat.status === 'occupied';
            const isExpiring = seat.status === 'expiring';

            return (
              <button
                key={seat.id}
                type="button"
                className={`mgr-seat-cell mgr-seat-cell-button ${SEAT_CLASS[seat.status] || ''} h-16 w-full rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer border-2 hover:scale-105 shadow-xs ${
                  isAvailable
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:border-emerald-500'
                    : isOccupied
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 hover:border-red-500'
                    : isExpiring
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:border-amber-500'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
                onClick={() =>
                  router.push(
                    `${MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS}?seat=${encodeURIComponent(seat.id)}`
                  )
                }
                aria-label={tManagerUi('open_students_filtered_by_seat_named', { seat: seat.id })}
              >
                <span className="font-extrabold text-sm">{seat.id}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                  {isAvailable ? 'Free' : isOccupied ? 'Occupied' : 'Expiring'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend with Counts */}
      <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} />
          <span>{tManagerUi('available')}:</span>
          <span className="font-bold">{availableCount}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle size={13} />
          <span>{tManagerUi('occupied')}:</span>
          <span className="font-bold">{occupiedCount}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <Clock size={13} />
          <span>{tManagerUi('expiring_soon')}:</span>
          <span className="font-bold">{expiringCount}</span>
        </div>
      </div>
    </div>
  );
}
