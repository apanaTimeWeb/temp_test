// RESPONSIBILITY: Adapt the canonical route for billing invoices to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_billing/billing_invoices/page.tsx -> canonical URL contract -> owning feature screen or redirect.
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminBillingInvoicesScreen from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesScreen';
import SuperadminBillingInvoicesWorkflowNavigation from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesWorkflowNavigation';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Preserve every non-view parameter (including repeated keys and resource IDs) on legacy route redirects. */
function redirectLegacyWorkflow(path: string, query: SearchParams, targetView?: string): never {
  const preserved = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (key === 'view' || value === undefined) continue;
    if (Array.isArray(value)) value.forEach((item) => preserved.append(key, item));
    else preserved.set(key, value);
  }
  if (targetView) preserved.set('view', targetView);
  const suffix = preserved.toString();
  redirect(path + (suffix ? `?${suffix}` : ''));
}

/**
 * Compatibility adapter for pre-existing billing invoice routes.
 * The member-invoices and member-receipts entities and their details are owned by their own leaf modules.
 */
export default async function BillingInvoicesRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  if (view === 'member_invoices') {
    return redirectLegacyWorkflow('/superadmin/superadmin_billing/billing_member_invoices', query);
  }
  if (view === 'member_invoices_detail') {
    return redirectLegacyWorkflow('/superadmin/superadmin_billing/billing_member_invoices', query, 'detail');
  }
  if (view === 'member_receipts') {
    return redirectLegacyWorkflow('/superadmin/superadmin_billing/billing_member_receipts', query);
  }
  if (view === 'member_receipts_detail') {
    return redirectLegacyWorkflow('/superadmin/superadmin_billing/billing_member_receipts', query, 'detail');
  }
  const tCopy = await getTranslations('SUPERADMIN_BILLING');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  if (view && !['member_invoices', 'member_invoices_detail', 'member_receipts', 'member_receipts_detail'].includes(view)) notFound();
  return (
    <div className="min-w-0" data-feature-module="superadmin_billing" data-feature-route="billing_invoices">
      <SuperadminBillingInvoicesWorkflowNavigation currentView={view} />
      <Suspense fallback={fallback}>
        <SuperadminBillingInvoicesScreen id={id} />
      </Suspense>
    </div>
  );
}
