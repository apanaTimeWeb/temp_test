// RESPONSIBILITY: Canonical route adapter for the autonomous member invoices workflow.
// FLOW: canonical billing_member_invoices route -> Suspense fallback -> member invoices screen.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminBillingInvoicesMemberInvoicesScreen from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/components/SuperadminBillingInvoicesMemberInvoicesScreen';
import SuperadminBillingInvoicesMemberInvoicesInvoiceDetailScreen from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/** Renders the canonical member invoices route while the legacy query-view route remains supported by the parent dispatcher. */
export default async function BillingMemberInvoicesRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_BILLING');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  if (view === 'detail') {
    return (
      <div className="min-w-0" data-feature-module="superadmin_billing" data-feature-route="billing_member_invoices" data-feature-view="detail">
        <Suspense fallback={fallback}>
          <SuperadminBillingInvoicesMemberInvoicesInvoiceDetailScreen id={id} />
        </Suspense>
      </div>
    );
  }
  return (
    <div className="min-w-0" data-feature-module="superadmin_billing" data-feature-route="billing_member_invoices">
      <Suspense fallback={fallback}>
        <SuperadminBillingInvoicesMemberInvoicesScreen id={id} />
      </Suspense>
    </div>
  );
}
