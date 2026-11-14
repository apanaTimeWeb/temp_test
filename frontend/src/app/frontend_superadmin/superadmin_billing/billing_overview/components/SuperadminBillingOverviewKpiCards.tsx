/** Responsibility: SuperadminBillingOverviewKpiCards; module-owned presentation component for billing_overview. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminBillingOverviewKpiCards formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { SUPERADMIN_BILLING_SAMPLE_OVERVIEW_KPIS } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/mocks/fixtures/SuperadminBillingOverviewSampleMockFixtures';
import { FormatCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/utils/SuperadminBillingOverviewFormatters';

/** Renders billing's illustrative KPI cards from minor-unit preview fixtures using the active locale. */
export default function SuperadminBillingOverviewKpiCards() {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  const locale = useLocale();
  const { lifetimeCollectionsMinor, overduePaymentsMinor, nextPayoutMinor, currencyCode } = SUPERADMIN_BILLING_SAMPLE_OVERVIEW_KPIS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="sa-kpi-card p-5">
        <p className="sa-label mb-2">{tCopy('COPY.SAMPLE_SAAS_REVENUE')}</p>
        <p className="text-3xl font-black text-primary">{FormatCurrency(lifetimeCollectionsMinor, currencyCode, locale)}</p>
        <p className="text-xs text-success mt-2 flex items-center gap-1"><CheckCircle size={12} /> {tCopy('COPY.ILLUSTRATIVE_LIFETIME_COLLECTIONS')}</p>
      </div>
      <div className="sa-kpi-card p-5">
        <p className="sa-label mb-2">{tCopy('COPY.SAMPLE_PENDING_INVOICES')}</p>
        <p className="text-3xl font-black text-primary">{FormatCurrency(overduePaymentsMinor, currencyCode, locale)}</p>
        <p className="text-xs text-danger mt-2 flex items-center gap-1"><AlertCircle size={12} /> {tCopy('COPY.ILLUSTRATIVE_OVERDUE_PAYMENTS')}</p>
      </div>
      <div className="sa-kpi-card p-5 border-border bg-info-bg">
        <p className="sa-label mb-2">{tCopy('COPY.SAMPLE_NEXT_PAYOUT')}</p>
        <p className="text-3xl font-black text-info">{FormatCurrency(nextPayoutMinor, currencyCode, locale)}</p>
        <p className="text-xs text-secondary mt-2 flex items-center gap-1"><CreditCard size={12} /> {tCopy('COPY.ILLUSTRATIVE_DATE_1_NOV')}</p>
      </div>
    </div>
  );
}
