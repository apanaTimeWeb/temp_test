// RESPONSIBILITY: Render the localized sample income/expense chart with theme-token tooltip styling.
'use client';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { useLocale, useTranslations } from 'next-intl';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/utils/SuperadminAccountingFinancialReportsFormatters';
import { formatSuperadminAccountingCompactMetric } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/utils/SuperadminAccountingFinancialReportsFormatters';
import type { SuperadminAccountingMonthlyEntry, SuperadminAccountingPeriod } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/types/superadmin_accounting_financial_reports.types';
const SuperadminAccountingApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
type Props = { visibleMonths: readonly SuperadminAccountingMonthlyEntry[]; period: SuperadminAccountingPeriod };
export default function SuperadminAccountingFinancialReportsIncomeExpenseChart({ visibleMonths, period }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  const locale = useLocale();
  const monthLabels: Record<string, string> = { Oct: tCopy('COPY.MONTH_OCT'), Nov: tCopy('COPY.MONTH_NOV'), Dec: tCopy('COPY.MONTH_DEC'), Jan: tCopy('COPY.MONTH_JAN'), Feb: tCopy('COPY.MONTH_FEB'), Mar: tCopy('COPY.MONTH_MAR'), Apr: tCopy('COPY.MONTH_APR') };
  const periodLabel = tCopy(`COPY.${period.toUpperCase()}`);
  return <section className="acct-card p-6" aria-labelledby="income-expense-chart-title">
    <style jsx global>{`
      .accounting-financial-reports-tooltip { background: var(--chart-tooltip-bg) !important; color: var(--text-primary) !important; border-color: var(--chart-grid) !important; }
      .accounting-financial-reports-tooltip .apexcharts-tooltip-title { background: var(--bg-popover) !important; color: var(--text-primary) !important; border-color: var(--chart-grid) !important; }
      .accounting-financial-reports-tooltip .apexcharts-tooltip-text { color: var(--text-primary) !important; }
    `}</style>
    <h2 id="income-expense-chart-title" className="acct-section-label mb-4">{tCopy('COPY.INCOME_VS_EXPENSE')} {periodLabel}</h2>
    <div role="img" aria-label={tCopy('COPY.SAMPLE_FINANCIAL_VALUES_PERIOD_ARIA_LABEL', { period: periodLabel })} className="h-56 w-full min-w-0">
      <SuperadminAccountingApexChart type="bar" height="100%" width="100%" options={{
        chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: '48%', borderRadius: 3 } },
        dataLabels: { enabled: false },
        xaxis: { categories: visibleMonths.map((entry) => monthLabels[entry.month] ?? tCopy('COPY.MONTH_LABEL')), labels: { style: { colors: 'var(--text-secondary)' } } },
        yaxis: { labels: { style: { colors: 'var(--text-secondary)' }, formatter: (value) => formatSuperadminAccountingCompactMetric(value, locale) } },
        grid: { borderColor: 'var(--chart-grid)' },
        legend: { position: 'bottom', labels: { colors: 'var(--text-secondary)' } },
        tooltip: { cssClass: 'accounting-financial-reports-tooltip', y: { formatter: (value) => formatSuperadminAccountingMajorPreviewCurrency(value, 'INR', locale) } },
        colors: ['var(--chart-success)', 'var(--chart-danger)'],
      } satisfies ApexOptions} series={[{ name: tCopy('COPY.INCOME'), data: visibleMonths.map((entry) => entry.income) }, { name: tCopy('COPY.EXPENSES'), data: visibleMonths.map((entry) => entry.expense) }]} />
    </div>
  </section>;
}
