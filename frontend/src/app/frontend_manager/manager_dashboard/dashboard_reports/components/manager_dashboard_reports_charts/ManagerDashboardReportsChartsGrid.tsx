'use client';
// RESPONSIBILITY: Render the chart visualization grid for components using supplied feature data. It does not own backend persistence or cross-feature business logic.
import type { ManagerDashboardReportsData } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
import { ManagerDashboardReportsShiftOccupancyChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsShiftOccupancyChart';
import { ManagerDashboardReportsGrowthChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsGrowthChart';
import { ManagerDashboardReportsAttendanceChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsAttendanceChart';
import { ManagerDashboardReportsAbsenteesChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsAbsenteesChart';
import { ManagerDashboardReportsComplaintsChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsComplaintsChart';

export function ManagerDashboardReportsChartsGrid({ data }: { data: ManagerDashboardReportsData }) {
  return (
    <div className="mgr-chart-grid mgr-section-gap">
      <ManagerDashboardReportsShiftOccupancyChart data={data.occupancyData} />
      <ManagerDashboardReportsGrowthChart data={data.growthData} />
      <ManagerDashboardReportsAttendanceChart data={data.attendanceData} />
      <ManagerDashboardReportsAbsenteesChart data={data.absenteesChartData} />
      <ManagerDashboardReportsComplaintsChart data={data.complaintsData} />
    </div>
  );
}
