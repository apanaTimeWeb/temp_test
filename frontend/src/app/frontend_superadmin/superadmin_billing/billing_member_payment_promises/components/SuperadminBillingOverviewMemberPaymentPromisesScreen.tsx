/** Responsibility: Route adapter for the member_payment_promises screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberPaymentPromisesScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `payment_promises` inside the member_payment_promises autonomous module. */
import SuperadminBillingOverviewMemberPaymentPromisesPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/components/SuperadminBillingOverviewMemberPaymentPromisesPageClient';

/**
 * Composes the billing overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingOverviewMemberPaymentPromisesScreen({ id }: { id?: string }) {
  return <SuperadminBillingOverviewMemberPaymentPromisesPageClient />;
}
