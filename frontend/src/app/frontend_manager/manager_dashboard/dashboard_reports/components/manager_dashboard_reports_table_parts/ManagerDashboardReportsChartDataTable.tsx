'use client';
// RESPONSIBILITY: Render the chart visualization for components using supplied feature data. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the chart visualization for components using supplied feature data. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import type { ManagerDashboardReportsChartDataRow, ManagerDashboardReportsChartDataTableProps } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsComponentTypes';
export type { ManagerDashboardReportsChartDataRow };




export function ManagerDashboardReportsChartDataTable({ caption, rows }: ManagerDashboardReportsChartDataTableProps) {
  const tManagerUi = useTranslations('manager.manager_reports.ui');
  if (rows.length === 0) return null;
  return (
    <details className="mgr-chart-data-details">
      <summary>{tManagerUi('view_chart_data')}</summary>
      <table className="mgr-chart-data-table">
        <caption className="sr-only">{caption}</caption>
        <thead><tr><th scope="col">{tManagerUi('chart_category')}</th><th scope="col">{tManagerUi('chart_value')}</th></tr></thead>
        <tbody>{rows.map((row, index) => <tr key={`${row.label}-${index}`}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody>
      </table>
    </details>
  );
}
