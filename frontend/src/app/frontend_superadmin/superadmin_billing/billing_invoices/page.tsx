import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminBillingInvoicesScreen from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export default async function BillingInvoicesRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations('SUPERADMIN_BILLING');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  return (
    <div className="min-w-0" data-feature-module="superadmin_billing" data-feature-route="billing_invoices">
      <Suspense fallback={fallback}>
        <SuperadminBillingInvoicesScreen id={id} />
      </Suspense>
    </div>
  );
}
