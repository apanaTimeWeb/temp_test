'use client';
// RESPONSIBILITY: Render the daily attendance trend bar chart visualization using supplied feature data. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { ManagerDashboardReportsChartDataTable } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsChartDataTable';
import { useManagerDashboardReportsChartTheme } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/hooks/useManagerDashboardReportsChartTheme';
import type { ManagerDashboardReportsAttendancePoint } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function ManagerDashboardReportsAttendanceChart({ data }: { data: ManagerDashboardReportsAttendancePoint[] }) {
  const tManagerUi = useTranslations('manager.manager_reports.ui');
  const chartTheme = useManagerDashboardReportsChartTheme();

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'inherit',
    },
    theme: {
      mode: chartTheme.isDark ? 'dark' : 'light',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: data.map((item) => item.day),
      labels: { style: { colors: chartTheme.textSecondary } },
      axisBorder: { color: chartTheme.grid },
      axisTicks: { color: chartTheme.grid },
    },
    yaxis: {
      max: 100,
      labels: {
        style: { colors: chartTheme.textSecondary },
        formatter: (val) => `${val}%`,
      },
    },
    grid: {
      borderColor: chartTheme.grid,
      strokeDashArray: 4,
    },
    colors: [chartTheme.primary],
    dataLabels: { enabled: false },
    tooltip: {
      theme: chartTheme.isDark ? 'dark' : 'light',
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  return (
    <div className="mgr-chart-card">
      <h3 className="mgr-chart-title">{tManagerUi('daily_attendance_trend')}</h3>
      {data.length === 0 ? (
        <p className="p-6 text-sm text-secondary" role="status">{tManagerUi('no_report_data_available')}</p>
      ) : (
        <>
          <Chart
            type="bar"
            height={260}
            options={options}
            series={[{ name: tManagerUi('attendance_percentage'), data: data.map((item) => item.avg) }]}
          />
          <ManagerDashboardReportsChartDataTable
            caption={tManagerUi('daily_attendance_trend')}
            rows={data.map((item) => ({ label: item.day, value: `${item.avg}%` }))}
          />
        </>
      )}
    </div>
  );
}
