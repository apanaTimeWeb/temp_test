/** Responsibility: Route adapter for the member_security_deposits screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberSecurityDepositsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `security_deposits` inside the member_security_deposits autonomous module. */
import SuperadminBillingOverviewMemberSecurityDepositsPageClient from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/components/SuperadminBillingOverviewMemberSecurityDepositsPageClient';

/**
 * Composes the billing overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBillingOverviewMemberSecurityDepositsScreen({ id }: { id?: string }) {
  return <SuperadminBillingOverviewMemberSecurityDepositsPageClient />;
}
