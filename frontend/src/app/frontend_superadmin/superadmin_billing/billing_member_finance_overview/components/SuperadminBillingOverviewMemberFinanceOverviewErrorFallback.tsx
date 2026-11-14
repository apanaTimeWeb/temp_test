// RESPONSIBILITY: Render the Billing Overview Member Finance Overview Error Fallback UI unit for billing member finance overview; it does not own host routing or unsupported backend writes.
// FLOW: Feature screen/page client -> superadmin_billing/billing_member_finance_overview/components/SuperadminBillingOverviewMemberFinanceOverviewErrorFallback.tsx -> typed props and local state -> rendered accessible UI.
/**
 * Feature-local retry fallback; hides raw exception details and never implies a mutation succeeded.
 */
'use client';

import { useTranslations } from 'next-intl';

type SuperadminBillingOverviewMemberFinanceOverviewErrorFallbackProps = { onRetry: () => void };

export default function SuperadminBillingOverviewMemberFinanceOverviewErrorFallback({ onRetry }: SuperadminBillingOverviewMemberFinanceOverviewErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-danger-bg p-6 text-danger" role="alert" data-testid="superadmin_billing-billing_member_finance_overview-error-fallback">
      <h2 className="text-lg font-semibold">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-sm">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button type="button" className="sa-btn-primary mt-4 min-h-11 min-w-28" onClick={onRetry} data-testid="superadmin_billing-billing_member_finance_overview-error-retry">
        {t('COPY.RETRY_MODULE_ROUTE')}
      </button>
    </section>
  );
}
