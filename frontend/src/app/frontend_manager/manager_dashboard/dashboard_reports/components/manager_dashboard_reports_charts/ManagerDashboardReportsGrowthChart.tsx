'use client';
// RESPONSIBILITY: Render the chart visualization for components using supplied feature data. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { ManagerDashboardReportsChartDataTable } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsChartDataTable.tsx';
import type { ManagerDashboardReportsGrowthPoint } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
import { useLocale } from 'next-intl';
import { formatManagerReportsDateLabel } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/utils/ManagerDashboardReportsDateFormatting';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function ManagerDashboardReportsGrowthChart({ data }: { data: ManagerDashboardReportsGrowthPoint[] }) {
  const tManagerUi = useTranslations('manager.manager_reports.ui');
  const locale = useLocale();
  const options: ApexOptions = {
    chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: data.map((item) => formatManagerReportsDateLabel(item.date, locale)), labels: { style: { colors: 'var(--text-secondary)' } } },
    yaxis: { labels: { style: { colors: 'var(--text-secondary)' } } },
    grid: { borderColor: 'var(--chart-grid)' },
    colors: ['var(--chart-primary)', 'var(--chart-danger)'],
  };
  return (
    <div className="mgr-chart-card">
      <h3 className="mgr-chart-title">{tManagerUi('student_growth_trend')}</h3>
      {data.length === 0 ? <p className="p-6 text-sm text-secondary" role="status">{tManagerUi('no_report_data_available')}</p> : <>
        <Chart type="line" height={260} options={options} series={[{ name: tManagerUi('joined'), data: data.map((item) => item.joined) }, { name: tManagerUi('exited'), data: data.map((item) => item.exited) }]} />
        <ManagerDashboardReportsChartDataTable caption={tManagerUi('student_growth_trend')} rows={data.map((item) => ({ label: formatManagerReportsDateLabel(item.date, locale), value: `${tManagerUi('joined')}: ${item.joined}; ${tManagerUi('exited')}: ${item.exited}` }))} />
      </>}
    </div>
  );
}
