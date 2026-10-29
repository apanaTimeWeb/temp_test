'use client';
import { ManagerDashboardOverviewEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/ManagerDashboardOverviewEmptyState';
import { useTranslations } from 'next-intl';

import { useRouter } from 'next/navigation';

import { SEAT_CLASS } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/constants/ManagerDashboardOverviewConstants';
import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';
import type { ManagerDashboardOverviewSeatMatrixProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';



export function ManagerDashboardOverviewSeatMatrix({ seatData }: ManagerDashboardOverviewSeatMatrixProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const router = useRouter();

  if (!seatData || seatData.length === 0) return <ManagerDashboardOverviewEmptyState className="mgr-card p-6 text-sm text-secondary" testId="manager-dashboard-seat-matrix-empty">{tManagerUi('no_seat_data_available')}</ManagerDashboardOverviewEmptyState>;

  return (
    <div className="mgr-card">
      <div className="mgr-card-header">
        <h2 className="mgr-section-title">{tManagerUi('mini_seat_matrix_today_apos_s_shifts')}</h2>
      </div>
      <div className="mgr-card-body">
        <div className="mgr-seat-grid">
          {seatData.map((seat) => (
            <button
              key={seat.id}
              type="button"
              className={`mgr-seat-cell mgr-seat-cell-button ${SEAT_CLASS[seat.status] || ''}`}
              onClick={() => router.push(`${MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS}?seat=${encodeURIComponent(seat.id)}`)}
              aria-label={tManagerUi('open_students_filtered_by_seat_named', { seat: seat.id })}
            >
              {seat.id}
            </button>
          ))}
        </div>
        <div className="mgr-seat-legend">
          <div className="mgr-seat-legend-item">
            <div className="mgr-seat-legend-dot mgr-seat-legend-dot--available" />
            {tManagerUi('available')}
          </div>
          <div className="mgr-seat-legend-item">
            <div className="mgr-seat-legend-dot mgr-seat-legend-dot--occupied" />
            {tManagerUi('occupied')}
          </div>
          <div className="mgr-seat-legend-item">
            <div className="mgr-seat-legend-dot mgr-seat-legend-dot--expiring" />
            {tManagerUi('expiring_soon')}
          </div>
        </div>
      </div>
    </div>
  );
}
