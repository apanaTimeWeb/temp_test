/** Responsibility: Route adapter for the member_auto_suspend_policy screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `auto_suspend` inside the member_auto_suspend_policy autonomous module. */
import SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/components/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient';

/**
 * Composes the subscriptions overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyScreen({ id }: { id?: string }) {
  return <SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient />;
}
