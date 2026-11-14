/** Responsibility: Route adapter for the member_refunds screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberRefundsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `refunds` inside the member_refunds autonomous module. */
import SuperadminBillingOverviewMemberRefundsPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/components/SuperadminBillingOverviewMemberRefundsPageClient';

/**
 * Composes the billing overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingOverviewMemberRefundsScreen({ id }: { id?: string }) {
  return <SuperadminBillingOverviewMemberRefundsPageClient />;
}
