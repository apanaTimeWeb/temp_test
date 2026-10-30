'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ManagerDashboardReportsKpiGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_sections/ManagerDashboardReportsKpiGrid';
import { ManagerDashboardReportsChartsGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_charts/ManagerDashboardReportsChartsGrid';
import { ManagerDashboardReportsTablesGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsTablesGrid';
import { MANAGER_REPORTS_DATE_RANGES } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/constants/ManagerDashboardReportsConstants';
import { useManagerReports } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/hooks/useManagerDashboardReports';
import { ManagerDashboardReportsContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/api/manager_dashboard_reports.api';
import type { ManagerDashboardReportsDateRange } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';

export default function ManagerDashboardReportsPage() {
  const tManagerUi = useTranslations('manager.manager_reports.ui');
  const [dateRange, setDateRange] = useState<ManagerDashboardReportsDateRange>('This Month');
  const query = useManagerReports(dateRange);

  if (query.isPending) {
    return (
      <div className="mgr-page mgr-reports-theme" role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">{tManagerUi('loading_reports')}</span>
        <div aria-hidden="true" className="motion-safe:animate-pulse motion-reduce:animate-none">
          <div className="mgr-page-header"><div><div className="mgr-skeleton mgr-skeleton-title" /><div className="mgr-skeleton mgr-skeleton-line" /></div><div className="mgr-skeleton mgr-skeleton-action" /></div>
          <div className="mgr-kpi-grid mgr-section-gap">{[1, 2, 3, 4].map((item) => <div key={item} className="mgr-kpi-card"><div className="mgr-skeleton mgr-skeleton-line" /><div className="mgr-skeleton mgr-skeleton-value" /></div>)}</div>
          <div className="mgr-chart-grid"><div className="mgr-card h-64"><div className="mgr-skeleton mgr-skeleton-line" /></div><div className="mgr-card h-64"><div className="mgr-skeleton mgr-skeleton-line" /></div></div>
        </div>
      </div>
    );
  }

  if (query.isError) {
    const contractBlocked = query.error instanceof ManagerDashboardReportsContractBlockedError;
    return <div className="mgr-page-state mgr-reports-theme" role={contractBlocked ? 'status' : 'alert'} data-testid="manager-reports-contract-state"><p className="mgr-page-subtitle">{contractBlocked ? tManagerUi('reports_api_contract_not_supplied') : tManagerUi('unable_to_load_reports')}</p>{!contractBlocked && <button type="button" className="mgr-btn mgr-btn--secondary" onClick={() => void query.refetch()}>{tManagerUi('retry')}</button>}</div>;
  }

  const data = query.data;
  if (!data) {
    return <div className="mgr-page-state mgr-reports-theme" role="status">{tManagerUi('no_report_data_available')}</div>;
  }

  const hasReportData = data.kpiCards.length + data.occupancyData.length + data.growthData.length + data.attendanceData.length + data.absenteesChartData.length + data.complaintsData.length + data.absenteeRows.length + data.conversionRows.length + data.seatRows.length + data.lockerRows.length + data.maintenanceRows.length > 0;

  return (
    <div className="mgr-page mgr-reports-theme">
      <div className="mgr-page-header">
        <div><p className="mgr-breadcrumb">{tManagerUi('manager_reports')}</p><h1 className="mgr-page-title">{tManagerUi('reports')}</h1><p className="mgr-page-subtitle">{tManagerUi('operational_overview_finance_reports_blocked')}</p></div>
      </div>
      <div className="mgr-report-filters">
        <div className="mgr-filter-item"><label className="mgr-label" htmlFor="manager-reports-date-range">{tManagerUi('date_range')}</label><select id="manager-reports-date-range" className="mgr-select" value={dateRange} onChange={(event) => setDateRange(event.target.value as ManagerDashboardReportsDateRange)}>{MANAGER_REPORTS_DATE_RANGES.map((range) => <option key={range} value={range}>{range === 'This Week' ? tManagerUi('range_this_week') : range === 'This Month' ? tManagerUi('range_this_month') : tManagerUi('range_last_30_days')}</option>)}</select></div>
      </div>
      {!hasReportData ? <p className="mgr-card p-6 text-sm text-secondary" role="status">{tManagerUi('no_report_data_available')}</p> : <><ManagerDashboardReportsKpiGrid cards={data.kpiCards} /><ManagerDashboardReportsChartsGrid data={data} /><ManagerDashboardReportsTablesGrid data={data} /></>}
    </div>
  );
}
