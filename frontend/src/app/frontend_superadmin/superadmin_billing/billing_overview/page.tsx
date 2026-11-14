import { notFound, redirect } from 'next/navigation';
// RESPONSIBILITY: Resolve the canonical billing_overview route and dispatch internal workflow views without creating sibling route modules.
// FLOW: Canonical URL -> query view dispatcher -> owner-local workflow navigation -> selected screen -> leaf components/hooks.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminBillingOverviewScreen from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewScreen';
import SuperadminBillingOverviewWorkflowNavigation from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewWorkflowNavigation';








type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/**
 * Resolves the canonical route for billing overview and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function BillingOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_FINANCE');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  if (view === "member_finance_overview") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_billing/billing_member_finance_overview" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "member_late_fees") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_billing/billing_member_late_fees" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "member_payment_promises") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_billing/billing_member_payment_promises" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "member_payments") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_billing/billing_member_payments" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "member_payments_collection") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_billing/billing_member_payments_collection" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "member_refunds") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_billing/billing_member_refunds" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "member_security_deposits") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_billing/billing_member_security_deposits" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view && !['member_finance_overview', 'member_late_fees', 'member_payment_promises', 'member_payments', 'member_payments_collection', 'member_refunds', 'member_security_deposits'].includes(view)) notFound();
  return (
    <div className="min-w-0" data-feature-module="superadmin_billing" data-feature-route="billing_overview">
      <SuperadminBillingOverviewWorkflowNavigation currentView={view} />
      <Suspense fallback={fallback}>
        <SuperadminBillingOverviewScreen id={id} />
      </Suspense>
    </div>
  );
}
