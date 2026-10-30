// RESPONSIBILITY: Owns secondary report insights: revenue trend, student growth, and responsive branch summary.
'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Activity, Users } from 'lucide-react';
import type { ApexOptions } from 'apexcharts';
import type { AdminDashboardReportsAnalyticsDataset, AdminDashboardReportsAnalyticsRange, AdminDashboardReportsAnalyticsBranchSummary as AdminDashboardReportsAnalyticsBranchSummaryRow } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';
import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS, ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_LABEL_KEYS } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';
import { adminDashboardReportsAnalyticsFormatCurrency, adminDashboardReportsAnalyticsFormatNumber } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters';
import type { AdminDashboardReportsAnalyticsSecondaryInsightsSectionProps } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';

/** Accessible translated loading surface for the asynchronously loaded report charts. */
function AdminDashboardReportsAnalyticsChartLoadingState() {
  const t = useTranslations('ADMIN_REPORTS');
  return <div className="flex h-64 items-center justify-center rounded-md bg-skeleton-base" role="status" aria-busy="true"><span className="sr-only">{t('CHART_LOADING')}</span></div>;
}



const AdminDashboardReportsSecondaryInsightsApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <AdminDashboardReportsAnalyticsChartLoadingState />,
});

export default function AdminDashboardReportsAnalyticsSecondaryInsightsSection({ data, range, locale, branches }: AdminDashboardReportsAnalyticsSecondaryInsightsSectionProps) {
  const t = useTranslations('ADMIN_REPORTS');
  const selectedRangeLabel = t(ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_LABEL_KEYS[range]);
  const revenue = data.revenueTrend[range];
  const revenueOptions: ApexOptions = {
    chart: { type: 'line', toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
    colors: ['var(--chart-success)'], stroke: { curve: 'smooth', width: 3 }, markers: { size: 4 }, dataLabels: { enabled: false },
    xaxis: { categories: revenue.map((point) => { const key = ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS[point.month as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS]; return key ? t(key) : point.month; }), labels: { style: { colors: 'var(--text-secondary)' } } },
    yaxis: { labels: { formatter: (value) => adminDashboardReportsAnalyticsFormatCurrency(Math.round(value), data.currencyCode, locale), style: { colors: 'var(--text-secondary)' } }, min: 0 },
    grid: { borderColor: 'var(--chart-grid)' }, tooltip: { y: { formatter: (value) => adminDashboardReportsAnalyticsFormatCurrency(Math.round(value), data.currencyCode, locale) } },
    noData: { text: t('CHART_REVENUE_NO_DATA'), style: { color: 'var(--text-secondary)' } },
  };
  const revenueSeries = [{ name: t('SERIES_REVENUE'), data: revenue.map((point) => point.revenueMinor) }];
  const growth = data.studentGrowth[range];
  const growthOptions: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
    colors: ['var(--chart-info)', 'var(--chart-danger)'], plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 3 } }, dataLabels: { enabled: false },
    xaxis: { categories: growth.map((point) => { const key = ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS[point.month as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS]; return key ? t(key) : point.month; }), labels: { style: { colors: 'var(--text-secondary)' } } },
    yaxis: { min: 0, labels: { formatter: (value) => adminDashboardReportsAnalyticsFormatNumber(Math.round(value), locale), style: { colors: 'var(--text-secondary)' } } },
    grid: { borderColor: 'var(--chart-grid)' }, legend: { labels: { colors: 'var(--text-secondary)' } },
    tooltip: { y: { formatter: (value) => adminDashboardReportsAnalyticsFormatNumber(Math.round(value), locale) } },
    noData: { text: t('CHART_STUDENT_GROWTH_NO_DATA'), style: { color: 'var(--text-secondary)' } },
  };
  const growthSeries = [
    { name: t('SERIES_JOINED'), data: growth.map((point) => point.joined) },
    { name: t('SERIES_EXITED'), data: growth.map((point) => point.exited) },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <section className="admin-card min-w-0 p-5" aria-labelledby="admin-reports-revenue-trend-title">
        <div className="mb-4 flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-subtle"><Activity size={18} className="text-primary" strokeWidth={2} aria-hidden="true" /></div><h2 id="admin-reports-revenue-trend-title" className="font-semibold text-text-primary">{t('REVENUE_TREND_TITLE', { range: selectedRangeLabel })}</h2></div>
        <figure className="min-h-64" aria-labelledby="admin-reports-revenue-chart-caption"><AdminDashboardReportsSecondaryInsightsApexChart type="line" options={revenueOptions} series={revenueSeries} height={260} width="100%" /><figcaption id="admin-reports-revenue-chart-caption" className="sr-only">{t('REVENUE_CHART_CAPTION')}</figcaption></figure>
      </section>
      <section className="admin-card min-w-0 p-5" aria-labelledby="admin-reports-student-growth-title">
        <div className="mb-4 flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-subtle"><Users size={18} className="text-primary" strokeWidth={2} aria-hidden="true" /></div><h2 id="admin-reports-student-growth-title" className="font-semibold text-text-primary">{t('STUDENT_GROWTH_TITLE')}</h2></div>
        <figure className="min-h-64" aria-labelledby="admin-reports-student-growth-chart-caption"><AdminDashboardReportsSecondaryInsightsApexChart type="bar" options={growthOptions} series={growthSeries} height={260} width="100%" /><figcaption id="admin-reports-student-growth-chart-caption" className="sr-only">{t('STUDENT_GROWTH_CHART_CAPTION')}</figcaption></figure>
      </section>
      </div>
      <section className="admin-card p-5" aria-labelledby="admin-reports-branch-summary-title">
        <div className="admin-card-header mb-3"><h2 id="admin-reports-branch-summary-title" className="admin-section-title">{t('BRANCH_SUMMARY_TITLE')}</h2></div>
        {branches.length === 0 ? <AdminEmptyState title={t('BRANCH_SUMMARY_EMPTY_TITLE')} description={t('BRANCH_SUMMARY_EMPTY_DESCRIPTION')} /> : (
          <>
            <div className="grid gap-3 md:hidden">
              {branches.map((row: AdminDashboardReportsAnalyticsBranchSummaryRow) => <article key={`mobile-${row.branch}`} className="rounded-lg border border-border p-4">
                <h3 className="font-semibold text-text-primary">{row.branch}</h3>
                <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="text-text-secondary">{t('TABLE_REVENUE')}</dt><dd>{adminDashboardReportsAnalyticsFormatCurrency(row.revenueMinor, data.currencyCode, locale)}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_EXPENSES')}</dt><dd>{adminDashboardReportsAnalyticsFormatCurrency(row.expenseMinor, data.currencyCode, locale)}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_NET_PROFIT')}</dt><dd>{adminDashboardReportsAnalyticsFormatCurrency(row.revenueMinor - row.expenseMinor, data.currencyCode, locale)}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_STUDENTS')}</dt><dd>{adminDashboardReportsAnalyticsFormatNumber(row.students, locale)}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_OCCUPANCY')}</dt><dd>{adminDashboardReportsAnalyticsFormatNumber(row.occupancy, locale)}%</dd></div>
                </dl>
              </article>)}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead><tr><th scope="col">{t('TABLE_BRANCH')}</th><th scope="col">{t('TABLE_REVENUE')}</th><th scope="col">{t('TABLE_EXPENSES')}</th><th scope="col">{t('TABLE_NET_PROFIT')}</th><th scope="col">{t('TABLE_STUDENTS')}</th><th scope="col">{t('TABLE_OCCUPANCY')}</th></tr></thead>
                <tbody>{branches.map((row: AdminDashboardReportsAnalyticsBranchSummaryRow) => { const profit = row.revenueMinor - row.expenseMinor; return (
                  <tr key={row.branch}>
                    <th scope="row" className="text-left">{row.branch}</th>
                    <td>{adminDashboardReportsAnalyticsFormatCurrency(row.revenueMinor, data.currencyCode, locale)}</td>
                    <td>{adminDashboardReportsAnalyticsFormatCurrency(row.expenseMinor, data.currencyCode, locale)}</td>
                    <td>{adminDashboardReportsAnalyticsFormatCurrency(profit, data.currencyCode, locale)}</td>
                    <td>{adminDashboardReportsAnalyticsFormatNumber(row.students, locale)}</td>
                    <td><div className="flex items-center gap-2"><div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-surface-highlight"><div className={`h-full rounded-full bg-chart-primary admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(row.occupancy)))}`} /></div><span className="text-caption text-text-secondary">{adminDashboardReportsAnalyticsFormatNumber(row.occupancy, locale)}%</span></div></td>
                  </tr>
                ); })}</tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}


export type { AdminDashboardReportsAnalyticsSecondaryInsightsSectionProps };
