'use client';
// RESPONSIBILITY: Render the complaints status donut chart visualization using supplied feature data. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { ManagerDashboardReportsChartDataTable } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsChartDataTable';
import { useManagerDashboardReportsChartTheme } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/hooks/useManagerDashboardReportsChartTheme';
import type { ManagerDashboardReportsComplaintPoint } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function ManagerDashboardReportsComplaintsChart({ data }: { data: ManagerDashboardReportsComplaintPoint[] }) {
  const tManagerUi = useTranslations('manager.manager_reports.ui');
  const chartTheme = useManagerDashboardReportsChartTheme();

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      fontFamily: 'inherit',
    },
    theme: {
      mode: chartTheme.isDark ? 'dark' : 'light',
    },
    labels: data.map((item) => item.name),
    colors: [chartTheme.danger, chartTheme.warning, chartTheme.info],
    stroke: {
      show: true,
      colors: [chartTheme.isDark ? '#111111' : '#FFFFFF'],
      width: 2,
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: chartTheme.textSecondary,
      },
    },
    tooltip: {
      theme: chartTheme.isDark ? 'dark' : 'light',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Number(val).toFixed(1)}%`,
    },
  };

  return (
    <div className="mgr-chart-card mgr-chart-full">
      <h3 className="mgr-chart-title">{tManagerUi('complaints_status')}</h3>
      {data.length === 0 ? (
        <p className="p-6 text-sm text-secondary" role="status">{tManagerUi('no_report_data_available')}</p>
      ) : (
        <>
          <Chart type="donut" height={240} options={options} series={data.map((item) => item.value)} />
          <ManagerDashboardReportsChartDataTable
            caption={tManagerUi('complaints_status')}
            rows={data.map((item) => ({ label: item.name, value: String(item.value) }))}
          />
        </>
      )}
    </div>
  );
}
