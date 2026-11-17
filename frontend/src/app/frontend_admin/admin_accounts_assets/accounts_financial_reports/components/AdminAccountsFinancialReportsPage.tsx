'use client';
// RESPONSIBILITY: AdminAccountsFinancialReportsPage component owned by admin_accounting; responsibility folder: admin_accounting_components_views.

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
            <button
              type="button"
              aria-pressed={period === nextPeriod}
              key={nextPeriod}
              onClick={() => setPeriod(nextPeriod)}
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                period === nextPeriod
                  ? 'border-primary bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                  : 'border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
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
          <p role="status" className="sr-only">{t('DEMO_PREVIEW')}</p>
          <AdminAccountsFinancialReportsDashboard period={period} />
        </>
      )}
    </div>
  );
}
