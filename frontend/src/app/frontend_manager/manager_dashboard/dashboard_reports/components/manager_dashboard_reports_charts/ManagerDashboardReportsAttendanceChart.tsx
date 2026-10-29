'use client';
// RESPONSIBILITY: Render the chart visualization for components using supplied feature data. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { ManagerDashboardReportsChartDataTable } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsChartDataTable.tsx';
import type { ManagerDashboardReportsAttendancePoint } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function ManagerDashboardReportsAttendanceChart({ data }: { data: ManagerDashboardReportsAttendancePoint[] }) {
  const tManagerUi = useTranslations('manager.manager_reports.ui');
  const options: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    plotOptions: { bar: { borderRadius: 4 } },
    xaxis: { categories: data.map((item) => item.day), labels: { style: { colors: 'var(--text-secondary)' } } },
    yaxis: { labels: { style: { colors: 'var(--text-secondary)' } } },
    grid: { borderColor: 'var(--chart-grid)' },
    colors: ['var(--chart-success)'],
    dataLabels: { enabled: false },
  };
  return (
    <div className="mgr-chart-card">
      <h3 className="mgr-chart-title">{tManagerUi('daily_attendance_trend')}</h3>
      {data.length === 0 ? <p className="p-6 text-sm text-secondary" role="status">{tManagerUi('no_report_data_available')}</p> : <>
        <Chart type="bar" height={260} options={options} series={[{ name: tManagerUi('attendance_percentage'), data: data.map((item) => item.avg) }]} />
        <ManagerDashboardReportsChartDataTable caption={tManagerUi('daily_attendance_trend')} rows={data.map((item) => ({ label: item.day, value: String(item.avg) }))} />
      </>}
    </div>
  );
}
