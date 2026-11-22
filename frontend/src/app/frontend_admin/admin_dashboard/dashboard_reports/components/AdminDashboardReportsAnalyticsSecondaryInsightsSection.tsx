'use client';
// RESPONSIBILITY: Owns secondary report insights: revenue trend, student growth, and responsive branch summary.

import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS,ADMIN_DASHBOARD_REPORTS_ANALYTICS_RANGE_LABEL_KEYS } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';
import type { AdminDashboardReportsAnalyticsBranchSummary as AdminDashboardReportsAnalyticsBranchSummaryRow,AdminDashboardReportsAnalyticsSecondaryInsightsSectionProps } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';
import { adminDashboardReportsAnalyticsFormatCurrency,adminDashboardReportsAnalyticsFormatNumber } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import type { ApexOptions } from 'apexcharts';
import { Activity,ArrowDown,ArrowUp,ArrowUpDown,Building2,Trophy,Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo,useState } from 'react';

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
    colors: ['#10b981'], stroke: { curve: 'smooth', width: 3 }, markers: { size: 5, strokeColors: '#030712', strokeWidth: 2 }, dataLabels: { enabled: false },
    xaxis: { categories: revenue.map((point) => { const key = ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS[point.month as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS]; return key ? t(key) : point.month; }), labels: { style: { colors: '#94a3b8' } } },
    yaxis: { labels: { formatter: (value) => adminDashboardReportsAnalyticsFormatCurrency(Math.round(value), data.currencyCode, locale), style: { colors: '#94a3b8' } }, min: 0 },
    grid: { borderColor: 'rgba(99, 102, 241, 0.12)' }, tooltip: { y: { formatter: (value) => adminDashboardReportsAnalyticsFormatCurrency(Math.round(value ?? 0), data.currencyCode, locale) }, theme: 'dark' },
    noData: { text: t('CHART_REVENUE_NO_DATA'), style: { color: '#94a3b8' } },
  };
  const revenueSeries = [{ name: t('SERIES_REVENUE'), data: revenue.map((point) => point.revenueMinor) }];
  const growth = data.studentGrowth[range];
  const growthOptions: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
    colors: ['#22d3ee', '#f87171'], plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } }, dataLabels: { enabled: false },
    xaxis: { categories: growth.map((point) => { const key = ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS[point.month as keyof typeof ADMIN_DASHBOARD_REPORTS_ANALYTICS_PERIOD_LABEL_KEYS]; return key ? t(key) : point.month; }), labels: { style: { colors: '#94a3b8' } } },
    yaxis: { min: 0, labels: { formatter: (value) => adminDashboardReportsAnalyticsFormatNumber(Math.round(value), locale), style: { colors: '#94a3b8' } } },
    grid: { borderColor: 'rgba(99, 102, 241, 0.12)' }, legend: { labels: { colors: '#cbd5e1' } },
    tooltip: { y: { formatter: (value) => adminDashboardReportsAnalyticsFormatNumber(Math.round(value ?? 0), locale) }, theme: 'dark' },
    noData: { text: t('CHART_STUDENT_GROWTH_NO_DATA'), style: { color: '#94a3b8' } },
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
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1 -mx-1 transition-colors cursor-pointer"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-indigo-400 font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-indigo-400 font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-slate-400 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-6 shadow-card min-w-0" aria-labelledby="admin-reports-revenue-trend-title">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
              <Activity size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <h2 id="admin-reports-revenue-trend-title" className="text-base font-bold text-white tracking-tight">{t('REVENUE_TREND_TITLE', { range: selectedRangeLabel })}</h2>
          </div>
          <figure className="min-h-64" aria-labelledby="admin-reports-revenue-chart-caption">
            <AdminDashboardReportsSecondaryInsightsApexChart type="line" options={revenueOptions} series={revenueSeries} height={260} width="100%" />
            <figcaption id="admin-reports-revenue-chart-caption" className="sr-only">{t('REVENUE_CHART_CAPTION')}</figcaption>
          </figure>
        </section>

        <section className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-6 shadow-card min-w-0" aria-labelledby="admin-reports-student-growth-title">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-400">
              <Users size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <h2 id="admin-reports-student-growth-title" className="text-base font-bold text-white tracking-tight">{t('STUDENT_GROWTH_TITLE')}</h2>
          </div>
          <figure className="min-h-64" aria-labelledby="admin-reports-student-growth-chart-caption">
            <AdminDashboardReportsSecondaryInsightsApexChart type="bar" options={growthOptions} series={growthSeries} height={260} width="100%" />
            <figcaption id="admin-reports-student-growth-chart-caption" className="sr-only">{t('STUDENT_GROWTH_CHART_CAPTION')}</figcaption>
          </figure>
        </section>
      </div>

      <section className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-6 shadow-card" aria-labelledby="admin-reports-branch-summary-title">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-indigo-500/15">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
              <Building2 size={18} strokeWidth={2.2} />
            </div>
            <h2 id="admin-reports-branch-summary-title" className="text-base font-bold text-white tracking-tight">{t('BRANCH_SUMMARY_TITLE')}</h2>
          </div>
          <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2.5 py-1 w-fit">Cross-Branch Executive Leaderboard</span>
        </div>

        {branches.length === 0 ? <AdminEmptyState title={t('BRANCH_SUMMARY_EMPTY_TITLE')} description={t('BRANCH_SUMMARY_EMPTY_DESCRIPTION')} /> : (
          <>
            <div className="grid gap-3 md:hidden">
              {sortedBranches.map((row: AdminDashboardReportsAnalyticsBranchSummaryRow, index: number) => (
                <article key={`mobile-${row.branch}`} className="rounded-xl border border-indigo-500/20 bg-slate-900/50 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">{row.branch}</h3>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold border ${
                      index === 0
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : index === 1
                        ? 'bg-slate-300/20 text-slate-200 border-slate-300/40'
                        : index === 2
                        ? 'bg-amber-600/20 text-amber-400 border-amber-600/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {index === 0 ? <Trophy size={11} className="text-amber-300" /> : null}
                      #{index + 1}
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    <div><dt className="text-slate-400 font-medium">{t('TABLE_REVENUE')}</dt><dd className="font-semibold text-white mt-0.5">{adminDashboardReportsAnalyticsFormatCurrency(row.revenueMinor, data.currencyCode, locale)}</dd></div>
                    <div><dt className="text-slate-400 font-medium">{t('TABLE_EXPENSES')}</dt><dd className="font-semibold text-slate-300 mt-0.5">{adminDashboardReportsAnalyticsFormatCurrency(row.expenseMinor, data.currencyCode, locale)}</dd></div>
                    <div><dt className="text-slate-400 font-medium">{t('TABLE_NET_PROFIT')}</dt><dd className="font-bold text-emerald-400 mt-0.5">{adminDashboardReportsAnalyticsFormatCurrency(row.revenueMinor - row.expenseMinor, data.currencyCode, locale)}</dd></div>
                    <div><dt className="text-slate-400 font-medium">{t('TABLE_STUDENTS')}</dt><dd className="font-semibold text-white mt-0.5">{adminDashboardReportsAnalyticsFormatNumber(row.students, locale)}</dd></div>
                    <div className="sm:col-span-2"><dt className="text-slate-400 font-medium">{t('TABLE_OCCUPANCY')}</dt><dd className="font-bold text-cyan-300 mt-0.5">{adminDashboardReportsAnalyticsFormatNumber(row.occupancy, locale)}%</dd></div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block rounded-xl border border-indigo-500/15">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="h-11 bg-slate-900/70 uppercase text-[11px] text-slate-300 font-bold border-b border-indigo-500/20">
                    {renderSortableHeader('branch', t('TABLE_BRANCH'))}
                    {renderSortableHeader('revenueMinor', t('TABLE_REVENUE'))}
                    {renderSortableHeader('expenseMinor', t('TABLE_EXPENSES'))}
                    {renderSortableHeader('profit', t('TABLE_NET_PROFIT'))}
                    {renderSortableHeader('students', t('TABLE_STUDENTS'))}
                    {renderSortableHeader('occupancy', t('TABLE_OCCUPANCY'))}
                  </tr>
                </thead>
                <tbody>{sortedBranches.map((row: AdminDashboardReportsAnalyticsBranchSummaryRow, index: number) => {
                  const profit = row.revenueMinor - row.expenseMinor;
                  return (
                    <tr key={row.branch} className="h-12 border-b border-indigo-500/10 text-slate-200 hover:bg-indigo-500/10 transition-colors">
                      <th scope="row" className="p-3 font-medium text-white">
                        <div className="flex items-center gap-2.5">
                          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold border ${
                            index === 0
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm'
                              : index === 1
                              ? 'bg-slate-300/20 text-slate-200 border-slate-300/40'
                              : index === 2
                              ? 'bg-amber-600/20 text-amber-400 border-amber-600/40'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                          }`}>
                            {index === 0 ? <Trophy size={11} className="text-amber-300" /> : null}
                            #{index + 1}
                          </span>
                          <span className="font-bold text-white">{row.branch}</span>
                        </div>
                      </th>
                      <td className="p-3 font-semibold text-slate-200">{adminDashboardReportsAnalyticsFormatCurrency(row.revenueMinor, data.currencyCode, locale)}</td>
                      <td className="p-3 font-medium text-slate-400">{adminDashboardReportsAnalyticsFormatCurrency(row.expenseMinor, data.currencyCode, locale)}</td>
                      <td className="p-3 font-bold text-emerald-400">{adminDashboardReportsAnalyticsFormatCurrency(profit, data.currencyCode, locale)}</td>
                      <td className="p-3 font-semibold text-white">{adminDashboardReportsAnalyticsFormatNumber(row.students, locale)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 min-w-24 flex-1 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                              style={{ width: `${Math.min(100, Math.max(0, Math.round(row.occupancy)))}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-cyan-300 tabular-nums">{adminDashboardReportsAnalyticsFormatNumber(row.occupancy, locale)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}


export type { AdminDashboardReportsAnalyticsSecondaryInsightsSectionProps };
