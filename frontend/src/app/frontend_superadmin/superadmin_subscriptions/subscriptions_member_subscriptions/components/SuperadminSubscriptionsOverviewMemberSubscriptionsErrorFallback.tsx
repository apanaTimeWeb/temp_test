// RESPONSIBILITY: Render the Subscriptions Overview Member Subscriptions Error Fallback UI unit for subscriptions member subscriptions; it does not own host routing or unsupported backend writes.
// FLOW: Feature screen/page client -> superadmin_subscriptions/subscriptions_member_subscriptions/components/SuperadminSubscriptionsOverviewMemberSubscriptionsErrorFallback.tsx -> typed props and local state -> rendered accessible UI.
/**
 * Feature-local retry fallback; hides raw exception details and never implies a mutation succeeded.
 */
'use client';

import { useTranslations } from 'next-intl';

type SuperadminSubscriptionsOverviewMemberSubscriptionsErrorFallbackProps = { onRetry: () => void };

export default function SuperadminSubscriptionsOverviewMemberSubscriptionsErrorFallback({ onRetry }: SuperadminSubscriptionsOverviewMemberSubscriptionsErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-danger-bg p-6 text-danger" role="alert" data-testid="superadmin_subscriptions-subscriptions_member_subscriptions-error-fallback">
      <h2 className="text-lg font-semibold">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-sm">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button type="button" className="sa-btn-primary mt-4 min-h-11 min-w-28" onClick={onRetry} data-testid="superadmin_subscriptions-subscriptions_member_subscriptions-error-retry">
        {t('COPY.RETRY_MODULE_ROUTE')}
      </button>
    </section>
  );
}
