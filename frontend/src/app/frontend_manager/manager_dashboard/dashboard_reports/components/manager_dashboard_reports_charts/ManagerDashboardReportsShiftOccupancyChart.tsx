'use client';
// RESPONSIBILITY: Render the chart visualization for components using supplied feature data. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { ManagerDashboardReportsChartDataTable } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsChartDataTable.tsx';
import type { ManagerDashboardReportsSeriesPoint } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function ManagerDashboardReportsShiftOccupancyChart({ data }: { data: ManagerDashboardReportsSeriesPoint[] }) {
  const tManagerUi = useTranslations('manager.manager_reports.ui');
  const options: ApexOptions = {
    chart: { type: 'donut', background: 'transparent' },
    labels: data.map((item) => item.name ?? ''),
    colors: ['var(--chart-primary)', 'var(--chart-success)', 'var(--chart-warning)', 'var(--chart-danger)'],
    legend: { labels: { colors: 'var(--text-secondary)' } },
  };
  return (
    <div className="mgr-chart-card">
      <h3 className="mgr-chart-title">{tManagerUi('shift_wise_occupancy')}</h3>
      {data.length === 0 ? <p className="p-6 text-sm text-secondary" role="status">{tManagerUi('no_report_data_available')}</p> : <>
        <Chart type="donut" height={260} options={options} series={data.map((item) => item.value)} />
        <ManagerDashboardReportsChartDataTable caption={tManagerUi('shift_wise_occupancy')} rows={data.map((item) => ({ label: item.name ?? item.date ?? item.day ?? '', value: String(item.value) }))} />
      </>}
    </div>
  );
}
