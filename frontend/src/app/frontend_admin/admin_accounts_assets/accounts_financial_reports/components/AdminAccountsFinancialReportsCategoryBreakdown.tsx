'use client';
// RESPONSIBILITY: AdminAccountsFinancialReportsCategoryBreakdown component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.

import { ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/mocks/AdminAccountsFinancialReportsFixtures';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsFormatCurrency';
import { useTranslations, useLocale } from 'next-intl';

const CATEGORY_TRANSLATION_KEY: Record<string, string> = { Electricity: 'CATEGORY_ELECTRICITY', Maintenance: 'CATEGORY_MAINTENANCE', Internet: 'CATEGORY_INTERNET', Salary: 'CATEGORY_SALARY', Miscellaneous: 'CATEGORY_MISCELLANEOUS' };

/** Shows clearly demo-scoped category fixture values; production categories require an API contract. */
export function AdminAccountsFinancialReportsCategoryBreakdown() {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-6" aria-labelledby="accounting-category-breakdown-title">
      <h2 id="accounting-category-breakdown-title" className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary mb-4">{t('CATEGORY_BREAKDOWN')}</h2>
      <div className="space-y-3">
        {ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CATEGORY_FIXTURES.map((category) => {
          const pct = Math.min(100, Math.max(0, Math.round(category.pct)));
          return (
            <div key={category.category}>
              <div className="mb-1 flex justify-between gap-4">
                <span className="text-body text-text-primary">{CATEGORY_TRANSLATION_KEY[category.category] ? t(CATEGORY_TRANSLATION_KEY[category.category]) : category.category}</span>
                <span className="text-caption text-text-secondary">{formatAdminAccountingCurrency(category.amountMinor, locale)} ({pct}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-highlight" role="progressbar" aria-label={t('CATEGORY_SHARE_ARIA', { category: CATEGORY_TRANSLATION_KEY[category.category] ? t(CATEGORY_TRANSLATION_KEY[category.category]) : category.category })} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                <div className={`admin-dynamic-width-${pct} h-full rounded-full bg-primary`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
