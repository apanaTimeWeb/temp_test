'use client';
// RESPONSIBILITY: Owns the primary income/expense and occupancy charts for the selected report dataset.

import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_LABEL_KEYS,ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_SUB_KEYS,ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_TREND_KEYS,ADMIN_DASHBOARD_REPORTS_ANALYTICS_OCCUPANCY_LABEL_KEYS,ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';
import type { AdminDashboardReportsAnalyticsKpi,AdminDashboardReportsAnalyticsPrimaryChartsGridProps } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';
import { adminDashboardReportsAnalyticsFormatCurrency,adminDashboardReportsAnalyticsFormatNumber } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters';
import { displayValue } from '@/lib/display_value';
import type { ApexOptions } from 'apexcharts';
import { BarChart2,IndianRupee,PieChart,TrendingDown,TrendingUp,Users,Wallet,type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

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

const REPORT_KPI_THEMES = [
  {
    cardBorderBg: 'border-border bg-card',
    iconBox: 'bg-success-bg border-success text-success-text',
    strokeColor: 'var(--chart-success)',
    sparkline: 'M0,32 Q15,22 55,26 T95,14 T130,18 T150,6',
  },
  {
    cardBorderBg: 'border-border bg-card',
    iconBox: 'bg-danger-bg border-danger text-danger-text',
    strokeColor: 'var(--chart-danger)',
    sparkline: 'M0,15 Q25,28 65,22 T105,32 T135,24 T150,35',
  },
  {
    cardBorderBg: 'border-border bg-card',
    iconBox: 'bg-primary-subtle border-border-focus text-primary',
    strokeColor: 'var(--chart-primary)',
    sparkline: 'M0,32 Q15,18 55,24 T95,14 T130,20 T150,8',
  },
  {
    cardBorderBg: 'border-border bg-card',
    iconBox: 'bg-info-bg border-info text-info-text',
    strokeColor: 'var(--chart-info)',
    sparkline: 'M0,30 Q20,16 60,20 T100,12 T130,16 T150,8',
  },
];

export default function AdminDashboardReportsAnalyticsPrimaryChartsGrid({ data, range, locale }: AdminDashboardReportsAnalyticsPrimaryChartsGridProps) {
  const t = useTranslations('ADMIN_REPORTS');
  const incomeExpense = data.incomeVsExpense[range];
  const incomeExpenseOptions: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
    colors: ['#6366f1', '#f87171'],
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
    dataLabels: { enabled: false },
    xaxis: { categories: incomeExpense.map((point) => { const key = ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS[point.month as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS]; return key ? t(key) : point.month; }), labels: { style: { colors: '#94a3b8' } } },
    yaxis: { labels: { formatter: (value) => adminDashboardReportsAnalyticsFormatCurrency(Math.round(value), data.currencyCode, locale), style: { colors: '#94a3b8' } } },
    grid: { borderColor: 'rgba(99, 102, 241, 0.12)' },
    legend: { labels: { colors: '#cbd5e1' } },
    tooltip: { y: { formatter: (value) => adminDashboardReportsAnalyticsFormatCurrency(Math.round(value ?? 0), data.currencyCode, locale) }, theme: 'dark' },
    noData: { text: t('CHART_NO_DATA'), style: { color: '#94a3b8' } },
  };
  const incomeExpenseSeries = [
    { name: t('SERIES_INCOME'), data: incomeExpense.map((point) => point.incomeMinor) },
    { name: t('SERIES_EXPENSES'), data: incomeExpense.map((point) => point.expenseMinor) },
  ];
  const occupancyOptions: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
    colors: ['#22d3ee', '#38bdf8', '#818cf8', '#a78bfa'],
    plotOptions: { bar: { horizontal: true, barHeight: '58%', borderRadius: 4 } },
    dataLabels: { enabled: true, formatter: (value) => `${Math.round(Number(value))}%`, style: { colors: ['#ffffff'] } },
    xaxis: { categories: data.shiftOccupancy.map((point) => { const key = ADMIN_DASHBOARD_REPORTS_ANALYTICS_OCCUPANCY_LABEL_KEYS[point.name as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_OCCUPANCY_LABEL_KEYS]; return key ? t(key) : point.name; }), min: 0, max: 100, labels: { formatter: (value) => `${value}%`, style: { colors: '#94a3b8' } } },
    yaxis: { labels: { style: { colors: '#94a3b8' } } },
    grid: { borderColor: 'rgba(99, 102, 241, 0.12)' },
    tooltip: { y: { formatter: (value) => `${value}%` }, theme: 'dark' },
    noData: { text: t('CHART_OCCUPANCY_NO_DATA'), style: { color: '#94a3b8' } },
  };
  const occupancySeries = [{ name: t('SERIES_OCCUPANCY'), data: data.shiftOccupancy.map((point) => Math.min(100, Math.max(0, point.value))) }];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t('KPI_SECTION_LABEL')}>
        {data.kpis.map((card: AdminDashboardReportsAnalyticsKpi, index: number) => {
          const labelKey = card.label in ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_LABEL_KEYS ? ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_LABEL_KEYS[card.label as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_LABEL_KEYS] : undefined;
          const subKey = card.sub in ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_SUB_KEYS ? ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_SUB_KEYS[card.sub as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_SUB_KEYS] : undefined;
          const trendKey = card.trend.value in ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_TREND_KEYS ? ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_TREND_KEYS[card.trend.value as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_KPI_TREND_KEYS] : undefined;
          const value = displayValue(card.valueKind === 'currency' ? (card.amountMinor == null ? null : adminDashboardReportsAnalyticsFormatCurrency(card.amountMinor, data.currencyCode, locale)) : (card.count == null ? null : adminDashboardReportsAnalyticsFormatNumber(card.count, locale)));
          const Icon = ADMIN_DASHBOARD_REPORTS_KPI_ICONS[index] ?? TrendingUp;
          const theme = REPORT_KPI_THEMES[index % REPORT_KPI_THEMES.length] ?? REPORT_KPI_THEMES[0];
          return (
            <article
              key={card.label}
              className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-card motion-safe:transition-shadow motion-safe:duration-slow hover:shadow-popover flex flex-col justify-between h-full ${theme.cardBorderBg}`}
            >
              <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-surface-highlight blur-2xl motion-safe:transition-colors motion-safe:duration-xslow group-hover:bg-surface-hover" />
              <svg aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible motion-safe:transition-opacity motion-safe:duration-slow group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
                <path d={theme.sparkline} fill="none" stroke={theme.strokeColor} strokeWidth="2.5" strokeLinecap="round" />
              </svg>

              <div className="relative z-10 flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${theme.iconBox}`}>
                  <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
                </div>
                <span
                  data-testid="admin_dashboard_reports-AdminDashboardReportsAnalyticsKpiCard-state-001"
                  className={`inline-flex items-center gap-1 text-badge font-bold px-2.5 py-1 rounded-full border ${
                    card.trend.up
                      ? 'bg-success-bg text-success-text border-success'
                      : 'bg-danger-bg text-danger-text border-danger'
                  }`}
                >
                  {card.trend.up ? <TrendingUp size={13} strokeWidth={2.5} aria-hidden="true" /> : <TrendingDown size={13} strokeWidth={2.5} aria-hidden="true" />}
                  {trendKey ? t(trendKey) : card.trend.value}
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{labelKey ? t(labelKey) : card.label}</p>
                <p className="text-2xl sm:text-3xl font-black text-text-primary tabular-nums tracking-tight mt-1">{value}</p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary">
                  <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-text-secondary bg-surface-highlight border-border">
                    {subKey ? t(subKey) : card.sub}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card min-w-0" aria-labelledby="admin-reports-income-expense-title">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-subtle border border-border-focus text-primary">
              <BarChart2 size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <h2 id="admin-reports-income-expense-title" className="text-base font-bold text-text-primary tracking-tight">{t('INCOME_EXPENSE_TITLE')}</h2>
          </div>
          <figure className="min-h-64" aria-labelledby="admin-reports-income-expense-chart-caption">
            <AdminDashboardReportsPrimaryApexChart type="bar" options={incomeExpenseOptions} series={incomeExpenseSeries} height={260} width="100%" />
            <figcaption id="admin-reports-income-expense-chart-caption" className="sr-only">{t('INCOME_EXPENSE_CHART_CAPTION')}</figcaption>
          </figure>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card min-w-0" aria-labelledby="admin-reports-occupancy-title">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-info-bg border border-info text-info-text">
              <PieChart size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <h2 id="admin-reports-occupancy-title" className="text-base font-bold text-text-primary tracking-tight">{t('OCCUPANCY_TITLE')}</h2>
          </div>
          <figure className="min-h-64" aria-labelledby="admin-reports-occupancy-chart-caption">
            <AdminDashboardReportsPrimaryApexChart type="bar" options={occupancyOptions} series={occupancySeries} height={Math.max(180, data.shiftOccupancy.length * 44)} width="100%" />
            <figcaption id="admin-reports-occupancy-chart-caption" className="sr-only">{t('OCCUPANCY_CHART_CAPTION')}</figcaption>
          </figure>
        </section>
      </div>
    </div>
  );
}


export type { AdminDashboardReportsAnalyticsPrimaryChartsGridProps };
