import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import SuperadminBillingInvoicesScreen from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesScreen';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

function buildRedirectUrl(destination: string, query: SearchParams, targetView?: string) {
  const preserved = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (key === 'view' || value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => preserved.append(key, item));
    } else {
      preserved.set(key, value);
    }
  }
  if (targetView) preserved.set('view', targetView);
  const search = preserved.toString();
  return `${destination}${search ? `?${search}` : ''}`;
}

export default async function BillingInvoicesRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const filter = firstValue(query.filter);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_BILLING');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;

  if (view === 'member_invoices_detail') {
    redirect(buildRedirectUrl('/superadmin/superadmin_billing/billing_member_invoices', query, 'detail'));
  }
  if (view === 'member_receipts_detail') {
    redirect(buildRedirectUrl('/superadmin/superadmin_billing/billing_member_receipts', query, 'detail'));
  }
  if (view === 'member_invoices' || view === 'member_receipts') {
    // Dispatch canonical view
  }

  return (
    <div className="min-w-0" data-feature-module="superadmin_billing" data-feature-route="billing_invoices">
      <Suspense fallback={fallback}>
        <SuperadminBillingInvoicesScreen id={id} initialFilter={filter} />
      </Suspense>
    </div>
  );
}
