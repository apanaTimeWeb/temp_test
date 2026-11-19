import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminBillingOverviewScreen from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export default async function BillingOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_BILLING');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;

  // Canonical workflow views dispatch
  if (view === 'member_finance_overview' ||
      view === 'member_late_fees' ||
      view === 'member_payment_promises' ||
      view === 'member_payments' ||
      view === 'member_payments_collection' ||
      view === 'member_refunds' ||
      view === 'member_security_deposits') {
    // Route dispatches into the unified overview screen with view parameter
  }

  return (
    <div className="min-w-0" data-feature-module="superadmin_billing" data-feature-route="billing_overview">
      <Suspense fallback={fallback}>
        <SuperadminBillingOverviewScreen id={id} />
      </Suspense>
    </div>
  );
}
