/** Responsibility: Route adapter for the member_payments screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberPaymentsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `payments` inside the member_payments autonomous module. */
import SuperadminBillingOverviewMemberPaymentsPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsPageClient';

/**
 * Composes the billing overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingOverviewMemberPaymentsScreen({ id }: { id?: string }) {
  return <SuperadminBillingOverviewMemberPaymentsPageClient />;
}
