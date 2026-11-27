'use client';
// RESPONSIBILITY: AdminAccountsFinancialReportsCategoryBreakdown component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.

import { ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/config/admin_accounts_financial_reports.demo_data';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsFormatCurrency';
import { useLocale, useTranslations } from 'next-intl';

const CATEGORY_TRANSLATION_KEY: Record<string, string> = {
  Electricity: 'CATEGORY_ELECTRICITY',
  Maintenance: 'CATEGORY_MAINTENANCE',
  Internet: 'CATEGORY_INTERNET',
  Salary: 'CATEGORY_SALARY',
  Miscellaneous: 'CATEGORY_MISCELLANEOUS',
};

const CATEGORY_BAR_COLORS: Record<string, string> = {
  Electricity: 'bg-warning',
  Maintenance: 'bg-info',
  Internet: 'bg-primary',
  Salary: 'bg-danger',
  Miscellaneous: 'bg-success',
};

export function AdminAccountsFinancialReportsCategoryBreakdown() {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-6" aria-labelledby="accounting-category-breakdown-title">
      <h2 id="accounting-category-breakdown-title" className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary mb-4">
        {t('CATEGORY_BREAKDOWN')}
      </h2>
      <div className="space-y-4">
        {ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES.map((category) => {
          const pct = Math.min(100, Math.max(0, Math.round(category.pct)));
          const barColor = CATEGORY_BAR_COLORS[category.category] ?? 'bg-primary';
          const label = CATEGORY_TRANSLATION_KEY[category.category] ? t(CATEGORY_TRANSLATION_KEY[category.category]) : category.category;
          return (
            <div key={category.category} className="space-y-1.5">
              <div className="flex justify-between gap-4 text-xs">
                <span className="font-semibold text-text-primary">{label}</span>
                <span className="font-mono text-text-secondary">
                  {formatAdminAccountingCurrency(category.amountMinor, locale)}{' '}
                  <span className="font-bold text-text-primary">({pct}%)</span>
                </span>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-surface-highlight border border-border"
                role="progressbar"
                aria-label={t('CATEGORY_SHARE_ARIA', { category: label })}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div className={`admin-dynamic-width-${pct} h-full rounded-full ${barColor}`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default AdminAccountsFinancialReportsCategoryBreakdown;
