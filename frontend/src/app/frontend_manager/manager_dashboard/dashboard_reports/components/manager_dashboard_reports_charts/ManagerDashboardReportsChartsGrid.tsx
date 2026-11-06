'use client';
// RESPONSIBILITY: Render the chart visualization grid for components using supplied feature data. It does not own backend persistence or cross-feature business logic.
import type { ManagerDashboardReportsData } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
import { ManagerDashboardReportsShiftOccupancyChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsShiftOccupancyChart';
import { ManagerDashboardReportsGrowthChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsGrowthChart';
import { ManagerDashboardReportsAttendanceChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsAttendanceChart';
import { ManagerDashboardReportsAbsenteesChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsAbsenteesChart';
import { ManagerDashboardReportsComplaintsChart } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsComplaintsChart';

export function ManagerDashboardReportsChartsGrid({
  data,
  dateRange = 'This Month',
}: {
  data: ManagerDashboardReportsData;
  dateRange?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Analytics & Trend Trajectories
        </h2>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary border border-border">
          Active Scope: {dateRange}
        </span>
      </div>
      <div className="mgr-chart-grid mgr-section-gap">
        <ManagerDashboardReportsShiftOccupancyChart data={data.occupancyData} />
        <ManagerDashboardReportsGrowthChart data={data.growthData} />
        <ManagerDashboardReportsAttendanceChart data={data.attendanceData} />
        <ManagerDashboardReportsAbsenteesChart data={data.absenteesChartData} />
        <ManagerDashboardReportsComplaintsChart data={data.complaintsData} />
      </div>
    </div>
  );
}
