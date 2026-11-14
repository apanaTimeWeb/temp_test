/** Responsibility: Route adapter for the member_payments_collection screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberPaymentsCollectionScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `collect_fee` inside the member_payments_collection autonomous module. */
import SuperadminBillingOverviewMemberPaymentsCollectionPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/components/SuperadminBillingOverviewMemberPaymentsCollectionPageClient';

/**
 * Composes the billing overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingOverviewMemberPaymentsCollectionScreen({ id }: { id?: string }) {
  return <SuperadminBillingOverviewMemberPaymentsCollectionPageClient />;
}
