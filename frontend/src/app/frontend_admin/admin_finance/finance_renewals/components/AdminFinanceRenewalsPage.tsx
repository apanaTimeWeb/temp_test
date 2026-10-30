'use client';
// RESPONSIBILITY: render the renewal integration state until a verified API/DTO contract is supplied.
import { useTranslations } from 'next-intl';
import { ADMIN_RENEWALS_INTEGRATION_STATUS } from '@/app/frontend_admin/admin_finance/finance_renewals/types/AdminFinanceRenewalsTypes';
import { ADMIN_RENEWALS_DEMO_RECORDS } from '@/app/frontend_admin/admin_finance/finance_renewals/mocks/AdminFinanceRenewalsDemoFixtures';

export function AdminRenewalsPage() {
  const t = useTranslations('ADMIN_RENEWALS');
  const isUnavailable = ADMIN_RENEWALS_INTEGRATION_STATUS === 'contract-unavailable';
  const hasDemoRecords = ADMIN_RENEWALS_DEMO_RECORDS.length > 0;
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div><h1 className="text-section-title font-semibold text-text-primary">{t('RENEWALS_TITLE')}</h1><p className="mt-1 text-text-secondary">{t('RENEWALS_SUBTITLE')}</p></div>
      {isUnavailable && <p role="status" className="rounded-lg border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
      {!hasDemoRecords && <p role="note" className="text-caption text-text-secondary">{t('NO_DEMO_RECORDS')}</p>}
      <p className="text-caption text-text-secondary">{t('RENEWAL_MUTATION_BLOCKED')}</p>
    </section>
  );
}
