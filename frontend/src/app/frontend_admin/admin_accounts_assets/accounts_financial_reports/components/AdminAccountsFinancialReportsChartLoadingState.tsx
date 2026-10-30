// RESPONSIBILITY: AdminAccountsFinancialReportsChartLoadingState component owned by admin_accounting; responsibility folder: admin_accounts_financial_reports.
'use client';

import { useTranslations } from 'next-intl';

/** Localized loading placeholder for the accounting report chart. */
export default function AdminAccountsFinancialReportsChartLoadingState() {
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  return <div className="h-64 motion-safe:animate-pulse rounded-md bg-skeleton-base" aria-busy="true" role="status">{t('CHART_LOADING')}</div>;
}
