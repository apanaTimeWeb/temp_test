// RESPONSIBILITY: Owns the primary income/expense and occupancy charts for the selected report dataset.
'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { BarChart2, PieChart, IndianRupee, TrendingUp, TrendingDown, Users, Wallet, type LucideIcon } from 'lucide-react';
import type { ApexOptions } from 'apexcharts';
import type { AdminDashboardReportsAnalyticsDataset, AdminDashboardReportsAnalyticsRange, AdminDashboardReportsAnalyticsKpi } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';
import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS, ADMIN_DASHBOARD_REPORTS_ANALYTICS_OCCUPANCY_LABEL_KEYS, ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_LABEL_KEYS, ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_SUB_KEYS, ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_TREND_KEYS } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';
import { adminDashboardReportsAnalyticsFormatCurrency, adminDashboardReportsAnalyticsFormatNumber } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters';
import { displayValue } from '@/lib/display_value';
import Card from '@/components/ui/card/Card';
import type { AdminDashboardReportsAnalyticsPrimaryChartsGridProps } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';

/** Accessible translated loading surface for the asynchronously loaded report charts. */
function AdminDashboardReportsAnalyticsChartLoadingState() {
  const t = useTranslations('ADMIN_REPORTS');
  return <div className="flex h-64 items-center justify-center rounded-md bg-skeleton-base" role="status" aria-busy="true"><span className="sr-only">{t('CHART_LOADING')}</span></div>;
}



const AdminDashboardReportsPrimaryApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <AdminDashboardReportsAnalyticsChartLoadingState />,
});

const ADMIN_DASHBOARD_REPORTS_KPI_ICONS: readonly LucideIcon[] = [IndianRupee, Wallet, TrendingUp, Users];

export default function AdminDashboardReportsAnalyticsPrimaryChartsGrid({ data, range, locale }: AdminDashboardReportsAnalyticsPrimaryChartsGridProps) {
  const t = useTranslations('ADMIN_REPORTS');
  const incomeExpense = data.incomeVsExpense[range];
  const incomeExpenseOptions: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
    colors: ['var(--chart-primary)', 'var(--chart-danger)'],
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 3 } },
    dataLabels: { enabled: false },
    xaxis: { categories: incomeExpense.map((point) => { const key = ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS[point.month as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS]; return key ? t(key) : point.month; }), labels: { style: { colors: 'var(--text-secondary)' } } },
    yaxis: { labels: { formatter: (value) => adminDashboardReportsAnalyticsFormatCurrency(Math.round(value), data.currencyCode, locale), style: { colors: 'var(--text-secondary)' } } },
    grid: { borderColor: 'var(--chart-grid)' },
    legend: { labels: { colors: 'var(--text-secondary)' } },
    tooltip: { y: { formatter: (value) => adminDashboardReportsAnalyticsFormatCurrency(Math.round(value), data.currencyCode, locale) } },
    noData: { text: t('CHART_NO_DATA'), style: { color: 'var(--text-secondary)' } },
  };
  const incomeExpenseSeries = [
    { name: t('SERIES_INCOME'), data: incomeExpense.map((point) => point.incomeMinor) },
    { name: t('SERIES_EXPENSES'), data: incomeExpense.map((point) => point.expenseMinor) },
  ];
  const occupancyOptions: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
    colors: data.shiftOccupancy.map((item) => `var(--${item.token})`),
    plotOptions: { bar: { horizontal: true, barHeight: '58%', borderRadius: 3 } },
    dataLabels: { enabled: true, formatter: (value) => `${Math.round(Number(value))}%`, style: { colors: ['var(--text-on-primary)'] } },
    xaxis: { categories: data.shiftOccupancy.map((point) => { const key = ADMIN_DASHBOARD_REPORTS_ANALYTICS_OCCUPANCY_LABEL_KEYS[point.name as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_OCCUPANCY_LABEL_KEYS]; return key ? t(key) : point.name; }), min: 0, max: 100, labels: { formatter: (value) => `${value}%`, style: { colors: 'var(--text-secondary)' } } },
    yaxis: { labels: { style: { colors: 'var(--text-secondary)' } } },
    grid: { borderColor: 'var(--chart-grid)' },
    tooltip: { y: { formatter: (value) => `${value}%` } },
    noData: { text: t('CHART_OCCUPANCY_NO_DATA'), style: { color: 'var(--text-secondary)' } },
  };
  const occupancySeries = [{ name: t('SERIES_OCCUPANCY'), data: data.shiftOccupancy.map((point) => Math.min(100, Math.max(0, point.value))) }];

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t('KPI_SECTION_LABEL')}>
        {data.kpis.map((card: AdminDashboardReportsAnalyticsKpi, index: number) => {
          const labelKey = card.label in ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_LABEL_KEYS ? ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_LABEL_KEYS[card.label as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_LABEL_KEYS] : undefined;
          const subKey = card.sub in ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_SUB_KEYS ? ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_SUB_KEYS[card.sub as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_SUB_KEYS] : undefined;
          const trendKey = card.trend.value in ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_TREND_KEYS ? ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_TREND_KEYS[card.trend.value as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_TREND_KEYS] : undefined;
          const value = displayValue(card.valueKind === 'currency' ? (card.amountMinor == null ? null : adminDashboardReportsAnalyticsFormatCurrency(card.amountMinor, data.currencyCode, locale)) : (card.count == null ? null : adminDashboardReportsAnalyticsFormatNumber(card.count, locale)));
          const Icon = ADMIN_DASHBOARD_REPORTS_KPI_ICONS[index] ?? TrendingUp;
          return (
            <Card key={card.label} className="border-border bg-card flex flex-col justify-between p-5 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle text-primary"><Icon size={18} strokeWidth={2} className="text-primary" aria-hidden="true" /></div>
                <span data-testid="admin_dashboard_reports-AdminDashboardReportsAnalyticsKpiCard-state-001" className={`flex items-center gap-1 text-badge font-bold px-2 py-0.5 rounded-full ${card.trend.up ? 'bg-success-bg text-success-text' : 'bg-danger-bg text-danger-text'}`}>
                  {card.trend.up ? <TrendingUp size={18} strokeWidth={2} aria-hidden="true" /> : <TrendingDown size={18} strokeWidth={2} aria-hidden="true" />}{trendKey ? t(trendKey) : card.trend.value}
                </span>
              </div>
              <div><p className="text-caption font-semibold text-text-secondary uppercase tracking-wider mt-1">{labelKey ? t(labelKey) : card.label}</p><p className="text-kpi font-bold text-text-primary mt-1">{value}</p><p className="text-caption text-text-secondary mt-1">{subKey ? t(subKey) : card.sub}</p></div>
            </Card>
          );
        })}
      </section>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <section className="admin-card min-w-0 p-5" aria-labelledby="admin-reports-income-expense-title">
        <div className="mb-4 flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-subtle"><BarChart2 size={18} className="text-primary" strokeWidth={2} aria-hidden="true" /></div><h2 id="admin-reports-income-expense-title" className="font-semibold text-text-primary">{t('INCOME_EXPENSE_TITLE')}</h2></div>
        <figure className="min-h-64" aria-labelledby="admin-reports-income-expense-chart-caption"><AdminDashboardReportsPrimaryApexChart type="bar" options={incomeExpenseOptions} series={incomeExpenseSeries} height={260} width="100%" /><figcaption id="admin-reports-income-expense-chart-caption" className="sr-only">{t('INCOME_EXPENSE_CHART_CAPTION')}</figcaption></figure>
      </section>
      <section className="admin-card min-w-0 p-5" aria-labelledby="admin-reports-occupancy-title">
        <div className="mb-4 flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-subtle"><PieChart size={18} className="text-primary" strokeWidth={2} aria-hidden="true" /></div><h2 id="admin-reports-occupancy-title" className="font-semibold text-text-primary">{t('OCCUPANCY_TITLE')}</h2></div>
        <figure className="min-h-64" aria-labelledby="admin-reports-occupancy-chart-caption"><AdminDashboardReportsPrimaryApexChart type="bar" options={occupancyOptions} series={occupancySeries} height={Math.max(180, data.shiftOccupancy.length * 44)} width="100%" /><figcaption id="admin-reports-occupancy-chart-caption" className="sr-only">{t('OCCUPANCY_CHART_CAPTION')}</figcaption></figure>
      </section>
      </div>
    </div>
  );
}


export type { AdminDashboardReportsAnalyticsPrimaryChartsGridProps };
