'use client';
// RESPONSIBILITY: Owns the primary income/expense and occupancy charts for the selected report dataset.

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

const REPORT_KPI_PALETTES = [
  { iconColor: '#34d399', bg: 'rgba(52, 211, 153, 0.14)', border: 'rgba(52, 211, 153, 0.25)' }, // Revenue / Mint Emerald
  { iconColor: '#f87171', bg: 'rgba(248, 113, 113, 0.14)', border: 'rgba(248, 113, 113, 0.25)' }, // Expenses / Rose
  { iconColor: '#818cf8', bg: 'rgba(129, 140, 248, 0.14)', border: 'rgba(129, 140, 248, 0.25)' }, // Net Profit / Indigo
  { iconColor: '#22d3ee', bg: 'rgba(34, 211, 238, 0.14)', border: 'rgba(34, 211, 238, 0.25)' }, // Students / Cyan
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
          const palette = REPORT_KPI_PALETTES[index % REPORT_KPI_PALETTES.length] ?? REPORT_KPI_PALETTES[0];
          return (
            <article
              key={card.label}
              className="rounded-2xl border border-indigo-500/20 bg-card p-5 shadow-card hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: palette.bg,
                    border: `1px solid ${palette.border}`,
                    color: palette.iconColor,
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} style={{ color: palette.iconColor }} aria-hidden="true" />
                </div>
                <span
                  data-testid="admin_dashboard_reports-AdminDashboardReportsAnalyticsKpiCard-state-001"
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    card.trend.up
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {card.trend.up ? <TrendingUp size={13} strokeWidth={2.5} aria-hidden="true" /> : <TrendingDown size={13} strokeWidth={2.5} aria-hidden="true" />}
                  {trendKey ? t(trendKey) : card.trend.value}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{labelKey ? t(labelKey) : card.label}</p>
                <p className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight mt-1">{value}</p>
                <p className="text-xs text-slate-400 mt-1.5">{subKey ? t(subKey) : card.sub}</p>
              </div>
            </article>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-6 shadow-card min-w-0" aria-labelledby="admin-reports-income-expense-title">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
              <BarChart2 size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <h2 id="admin-reports-income-expense-title" className="text-base font-bold text-white tracking-tight">{t('INCOME_EXPENSE_TITLE')}</h2>
          </div>
          <figure className="min-h-64" aria-labelledby="admin-reports-income-expense-chart-caption">
            <AdminDashboardReportsPrimaryApexChart type="bar" options={incomeExpenseOptions} series={incomeExpenseSeries} height={260} width="100%" />
            <figcaption id="admin-reports-income-expense-chart-caption" className="sr-only">{t('INCOME_EXPENSE_CHART_CAPTION')}</figcaption>
          </figure>
        </section>

        <section className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-6 shadow-card min-w-0" aria-labelledby="admin-reports-occupancy-title">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400">
              <PieChart size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <h2 id="admin-reports-occupancy-title" className="text-base font-bold text-white tracking-tight">{t('OCCUPANCY_TITLE')}</h2>
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
