// RESPONSIBILITY: Render the localized sample expense-category breakdown.
'use client';
import { useLocale, useTranslations } from 'next-intl';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/utils/SuperadminAccountingFinancialReportsFormatters';
import type { SuperadminAccountingCategoryEntry } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/types/superadmin_accounting_financial_reports.types';
type Props = { categories: readonly SuperadminAccountingCategoryEntry[] };
export default function SuperadminAccountingFinancialReportsCategoryBreakdown({ categories }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  const locale = useLocale();
  const categoryLabels: Record<string, string> = { Electricity: tCopy('COPY.CATEGORY_ELECTRICITY'), Maintenance: tCopy('COPY.CATEGORY_MAINTENANCE'), Internet: tCopy('COPY.CATEGORY_INTERNET'), Salary: tCopy('COPY.CATEGORY_SALARY'), Miscellaneous: tCopy('COPY.CATEGORY_MISCELLANEOUS') };
  return <section className="acct-card p-6"><h2 className="acct-section-label mb-4">{tCopy('COPY.EXPENSE_CATEGORY_BREAKDOWN_SAMPLE')}</h2><div className="space-y-3">
    {categories.map((category) => { const label = categoryLabels[category.category] ?? tCopy('COPY.CATEGORY'); return <div key={category.category}><div className="mb-1 flex justify-between gap-3"><span className="acct-text-body">{label}</span><span className="acct-cell-subtext">{formatSuperadminAccountingMajorPreviewCurrency(category.amount, 'INR', locale)} ({category.pct}%)</span></div><div className="acct-progress-track"><progress className="acct-report-progress" max={100} value={category.pct} aria-label={tCopy('COPY.CATEGORY_BUDGET_SHARE_ARIA_LABEL', { category: label })}>{category.pct}%</progress></div></div>; })}
  </div></section>;
}
