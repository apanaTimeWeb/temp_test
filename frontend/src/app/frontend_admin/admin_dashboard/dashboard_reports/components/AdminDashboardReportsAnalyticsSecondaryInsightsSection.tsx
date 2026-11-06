'use client';
// RESPONSIBILITY: Owns secondary report insights: revenue trend, student growth, and responsive branch summary.

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Activity, Users, Building2, Trophy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
    grid: { borderColor: 'var(--chart-grid)' }, tooltip: { y: { formatter: (value) => adminDashboardReportsAnalyticsFormatCurrency(Math.round(value ?? 0), data.currencyCode, locale) } },
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
    tooltip: { y: { formatter: (value) => adminDashboardReportsAnalyticsFormatNumber(Math.round(value ?? 0), locale) } },
    noData: { text: t('CHART_STUDENT_GROWTH_NO_DATA'), style: { color: 'var(--text-secondary)' } },
  };
  const growthSeries = [
    { name: t('SERIES_JOINED'), data: growth.map((point) => point.joined) },
    { name: t('SERIES_EXITED'), data: growth.map((point) => point.exited) },
  ];
  type BranchSortField = 'branch' | 'revenueMinor' | 'expenseMinor' | 'profit' | 'students' | 'occupancy';
  const [sortField, setSortField] = useState<BranchSortField>('profit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleSort = (field: BranchSortField) => {
    if (sortField === field) setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    else { setSortField(field); setSortDirection('desc'); }
  };

  const sortedBranches = useMemo(() => {
    return [...branches].sort((a, b) => {
      let diff = 0;
      if (sortField === 'branch') {
        const cmp = a.branch.localeCompare(b.branch, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (sortField === 'revenueMinor') diff = a.revenueMinor - b.revenueMinor;
      else if (sortField === 'expenseMinor') diff = a.expenseMinor - b.expenseMinor;
      else if (sortField === 'profit') diff = (a.revenueMinor - a.expenseMinor) - (b.revenueMinor - b.expenseMinor);
      else if (sortField === 'students') diff = a.students - b.students;
      else if (sortField === 'occupancy') diff = a.occupancy - b.occupancy;
      return sortDirection === 'asc' ? diff : -diff;
    });
  }, [branches, sortField, sortDirection]);

  const renderSortableHeader = (field: BranchSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="p-3 whitespace-nowrap">
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

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
        <div className="admin-card-header mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-primary" />
            <h2 id="admin-reports-branch-summary-title" className="admin-section-title">{t('BRANCH_SUMMARY_TITLE')}</h2>
          </div>
          <span className="text-xs font-medium text-text-secondary">Cross-Branch Executive Leaderboard</span>
        </div>
        {branches.length === 0 ? <AdminEmptyState title={t('BRANCH_SUMMARY_EMPTY_TITLE')} description={t('BRANCH_SUMMARY_EMPTY_DESCRIPTION')} /> : (
          <>
            <div className="grid gap-3 md:hidden">
              {sortedBranches.map((row: AdminDashboardReportsAnalyticsBranchSummaryRow, index: number) => <article key={`mobile-${row.branch}`} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-text-primary">{row.branch}</h3>
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                    index === 0 ? 'bg-primary-subtle text-primary border border-border' : 'bg-surface text-text-secondary border border-border'
                  }`}>
                    {index === 0 ? <Trophy size={11} className="text-primary" /> : null}
                    #{index + 1}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="text-text-secondary">{t('TABLE_REVENUE')}</dt><dd>{adminDashboardReportsAnalyticsFormatCurrency(row.revenueMinor, data.currencyCode, locale)}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_EXPENSES')}</dt><dd>{adminDashboardReportsAnalyticsFormatCurrency(row.expenseMinor, data.currencyCode, locale)}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_NET_PROFIT')}</dt><dd className="font-semibold text-success-text">{adminDashboardReportsAnalyticsFormatCurrency(row.revenueMinor - row.expenseMinor, data.currencyCode, locale)}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_STUDENTS')}</dt><dd>{adminDashboardReportsAnalyticsFormatNumber(row.students, locale)}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_OCCUPANCY')}</dt><dd>{adminDashboardReportsAnalyticsFormatNumber(row.occupancy, locale)}%</dd></div>
                </dl>
              </article>)}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                    {renderSortableHeader('branch', t('TABLE_BRANCH'))}
                    {renderSortableHeader('revenueMinor', t('TABLE_REVENUE'))}
                    {renderSortableHeader('expenseMinor', t('TABLE_EXPENSES'))}
                    {renderSortableHeader('profit', t('TABLE_NET_PROFIT'))}
                    {renderSortableHeader('students', t('TABLE_STUDENTS'))}
                    {renderSortableHeader('occupancy', t('TABLE_OCCUPANCY'))}
                  </tr>
                </thead>
                <tbody>{sortedBranches.map((row: AdminDashboardReportsAnalyticsBranchSummaryRow, index: number) => { const profit = row.revenueMinor - row.expenseMinor; return (
                  <tr key={row.branch} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                    <th scope="row" className="p-3 font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                          index === 0 ? 'bg-primary-subtle text-primary border border-border' : 'bg-surface text-text-secondary border border-border'
                        }`}>
                          {index === 0 ? <Trophy size={12} className="text-primary" /> : null}
                          #{index + 1}
                        </span>
                        <span className="font-semibold">{row.branch}</span>
                      </div>
                    </th>
                    <td className="p-3">{adminDashboardReportsAnalyticsFormatCurrency(row.revenueMinor, data.currencyCode, locale)}</td>
                    <td className="p-3">{adminDashboardReportsAnalyticsFormatCurrency(row.expenseMinor, data.currencyCode, locale)}</td>
                    <td className="p-3 font-semibold text-success-text">{adminDashboardReportsAnalyticsFormatCurrency(profit, data.currencyCode, locale)}</td>
                    <td className="p-3">{adminDashboardReportsAnalyticsFormatNumber(row.students, locale)}</td>
                    <td className="p-3"><div className="flex items-center gap-2"><div className="h-2 min-w-20 flex-1 overflow-hidden rounded-full bg-surface-highlight"><div className={`h-full rounded-full bg-chart-primary admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(row.occupancy)))}`} /></div><span className="text-caption text-text-secondary">{adminDashboardReportsAnalyticsFormatNumber(row.occupancy, locale)}%</span></div></td>
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
