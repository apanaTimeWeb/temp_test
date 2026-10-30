// RESPONSIBILITY: AdminAccountsFinancialReportsPage component owned by admin_accounting; responsibility folder: admin_accounting_components_views.
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { AdminAccountsFinancialReportsDashboard } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/components/AdminAccountsFinancialReportsDashboard';
import type { AdminAccountingFinancialReportPeriod } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';

/** Presents report period controls and gates all sample report data behind explicit demo mode. */
export function AdminAccountsFinancialReportsPage() {
  const t = useTranslations('ADMIN_ACCOUNTING.FINANCIAL_REPORTS');
  const [period, setPeriod] = useState<AdminAccountingFinancialReportPeriod>('monthly');
  const isDemoMode = isFrontendDemoModeEnabled();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
          <p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
        </div>
        {isDemoMode && <div className="flex flex-wrap gap-2" aria-label={t('REPORT_PERIOD')}>
          {(['monthly', 'quarterly', 'yearly'] as const).map((nextPeriod) => (
            <button type="button" aria-pressed={period === nextPeriod} key={nextPeriod} onClick={() => setPeriod(nextPeriod)} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${period === nextPeriod ? 'border-primary bg-primary-subtle text-primary' : 'border-border bg-card text-text-secondary hover:bg-surface-hover'}`}>
              {t(`PERIOD_${nextPeriod.toUpperCase()}`)}
            </button>
          ))}
        </div>}
      </div>
      {!isDemoMode ? (
        <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6" aria-labelledby="accounting-report-unavailable-title">
          <h2 id="accounting-report-unavailable-title" className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('LIVE_TITLE')}</h2>
          <p className="text-warning-text" role="status">{t('LIVE_UNAVAILABLE')}</p>
        </section>
      ) : (
        <>
          <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('DEMO_PREVIEW')}</p>
          <AdminAccountsFinancialReportsDashboard period={period} />
        </>
      )}
    </div>
  );
}
