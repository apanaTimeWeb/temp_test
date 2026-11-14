/** Responsibility: Route adapter for the billing_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the billing_overview autonomous module. */
import SuperadminBillingOverviewPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewPageClient';

/**
 * Composes the billing overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingOverviewScreen({ id }: { id?: string }) {
  return <SuperadminBillingOverviewPageClient />;
}
