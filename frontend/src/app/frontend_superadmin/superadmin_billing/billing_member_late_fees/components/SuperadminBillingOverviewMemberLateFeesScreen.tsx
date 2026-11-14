/** Responsibility: Route adapter for the member_late_fees screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberLateFeesScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `late_fees` inside the member_late_fees autonomous module. */
import SuperadminFinanceLateFeesPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/components/SuperadminBillingOverviewMemberLateFeesPageClient';

/**
 * Composes the billing overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingOverviewMemberLateFeesScreen({ id }: { id?: string }) {
  return <SuperadminFinanceLateFeesPageClient />;
}
