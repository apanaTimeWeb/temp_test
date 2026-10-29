import { ManagerDashboardOverviewEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/ManagerDashboardOverviewEmptyState';
import { useTranslations } from 'next-intl';
import { Users, CalendarCheck, Phone, Armchair, type LucideIcon } from 'lucide-react';

import { getManagerDashboardTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewTrend';
import type { ManagerDashboardOverviewKpiGridProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';



const iconMap: Record<string, LucideIcon> = {
  Users, CalendarCheck, Phone, Armchair,
};

export function ManagerDashboardOverviewKpiGrid({ kpiData }: ManagerDashboardOverviewKpiGridProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const localizeKnownTitle = (title: string) => {
    switch (title) {
      case 'Total Students': return tManagerUi('dashboard_kpi_total_students');
      case 'Attendance Today': return tManagerUi('dashboard_kpi_attendance_today');
      case 'New Enquiries': return tManagerUi('dashboard_kpi_new_enquiries');
      case 'Occupied Seats': return tManagerUi('dashboard_kpi_occupied_seats');
      default: return title;
    }
  };
  if (!kpiData || kpiData.length === 0) return <ManagerDashboardOverviewEmptyState className="mgr-card p-6 text-sm text-secondary" testId="manager-dashboard-kpi-empty">{tManagerUi('no_dashboard_kpis_available')}</ManagerDashboardOverviewEmptyState>;

  return (
    <div className="mgr-kpi-grid mgr-section-gap">
      {kpiData.map((kpi) => {
        const Icon = iconMap[kpi.icon];
        return (
          <div key={kpi.title} className="mgr-kpi-card">
            <div className="mgr-kpi-top-row">
              <div className={`mgr-kpi-icon ${kpi.iconClass}`}>
                {Icon && <Icon size={18} />}
              </div>
              <span className={`mgr-trend-${getManagerDashboardTrendTone(kpi.trend)}`}>{kpi.trend}</span>
            </div>
            <div>
              <p className="mgr-kpi-label">{localizeKnownTitle(kpi.title)}</p>
              <p className="mgr-kpi-value">{kpi.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
