'use client';
// RESPONSIBILITY: Render the top absentees horizontal bar chart visualization using supplied feature data. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { ManagerDashboardReportsChartDataTable } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsChartDataTable';
import { useManagerDashboardReportsChartTheme } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/hooks/useManagerDashboardReportsChartTheme';
import type { ManagerDashboardReportsAbsenteeChartPoint } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function ManagerDashboardReportsAbsenteesChart({ data }: { data: ManagerDashboardReportsAbsenteeChartPoint[] }) {
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
        horizontal: true,
        borderRadius: 4,
        barHeight: '50%',
      },
    },
    xaxis: {
      categories: data.map((item) => item.name),
      labels: { style: { colors: chartTheme.textSecondary } },
      axisBorder: { color: chartTheme.grid },
      axisTicks: { color: chartTheme.grid },
    },
    yaxis: {
      labels: { style: { colors: chartTheme.textSecondary } },
    },
    grid: {
      borderColor: chartTheme.grid,
      strokeDashArray: 4,
    },
    colors: [chartTheme.danger],
    dataLabels: { enabled: false },
    tooltip: {
      theme: chartTheme.isDark ? 'dark' : 'light',
    },
  };

  return (
    <div className="mgr-chart-card">
      <h3 className="mgr-chart-title">{tManagerUi('top_absentees_in_selected_range')}</h3>
      {data.length === 0 ? (
        <p className="p-6 text-sm text-secondary" role="status">{tManagerUi('no_report_data_available')}</p>
      ) : (
        <>
          <Chart
            type="bar"
            height={260}
            options={options}
            series={[{ name: tManagerUi('absent_days'), data: data.map((item) => item.absences) }]}
          />
          <ManagerDashboardReportsChartDataTable
            caption={tManagerUi('top_absentees_in_selected_range')}
            rows={data.map((item) => ({ label: item.name, value: `${item.absences} ${tManagerUi('absent_days')}` }))}
          />
        </>
      )}
    </div>
  );
}
