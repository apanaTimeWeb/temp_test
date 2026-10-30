// RESPONSIBILITY: AdminAccountsFinancialReportsMonthlyChart component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.
'use client';

import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import AdminAccountsFinancialReportsChartLoadingState from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsChartLoadingState';
import type { ApexOptions } from 'apexcharts';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsFormatCurrency';
import type { AdminAccountingFinancialReportPeriodRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';
import type { AdminAccountsFinancialReportsMonthlyChartProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';


const AdminAccountsFinancialReportsApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <AdminAccountsFinancialReportsChartLoadingState />,
});

/** Renders the feature-owned income/expense chart with ApexCharts and currency values stored in paise. */
export function AdminAccountsFinancialReportsMonthlyChart({ rows }: AdminAccountsFinancialReportsMonthlyChartProps) {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  const options: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
    colors: ['var(--chart-success)', 'var(--chart-danger)'],
    plotOptions: { bar: { horizontal: false, columnWidth: '52%', borderRadius: 3 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 1, colors: ['transparent'] },
    xaxis: { categories: rows.map((row) => row.month), labels: { style: { colors: 'var(--text-secondary)' } } },
    yaxis: { labels: { formatter: (value) => formatAdminAccountingCurrency(value, locale), style: { colors: 'var(--text-secondary)' } } },
    grid: { borderColor: 'var(--chart-grid)' },
    legend: { labels: { colors: 'var(--text-secondary)' } },
    tooltip: { y: { formatter: (value) => formatAdminAccountingCurrency(value, locale) } },
    noData: { text: t('CHART_NO_DATA'), style: { color: 'var(--text-secondary)' } },
  };
  const series = [
    { name: t('SERIES_INCOME'), data: rows.map((row) => row.incomeMinor) },
    { name: t('SERIES_EXPENSE'), data: rows.map((row) => row.expenseMinor) },
  ];

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-6" aria-labelledby="accounting-income-expense-chart-title">
      <h2 id="accounting-income-expense-chart-title" className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary mb-4">{t('CHART_TITLE')}</h2>
      <div role="img" aria-label={t('CHART_ARIA')} className="min-h-64">
        <AdminAccountsFinancialReportsApexChart type="bar" options={options} series={series} height={260} width="100%" />
      </div>
      <p className="mt-2 text-caption text-text-secondary">{t('CHART_PAISE_NOTE')}</p>
    </section>
  );
}


export type { AdminAccountsFinancialReportsMonthlyChartProps };
