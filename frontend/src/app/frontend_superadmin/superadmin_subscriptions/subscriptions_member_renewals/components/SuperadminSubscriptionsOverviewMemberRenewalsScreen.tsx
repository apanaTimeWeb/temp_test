/** Responsibility: Route adapter for the member_renewals screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSubscriptionsOverviewMemberRenewalsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `renewals` inside the member_renewals autonomous module. */
import SuperadminSubscriptionsOverviewMemberRenewalsPageClient from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/components/SuperadminSubscriptionsOverviewMemberRenewalsPageClient';

/**
 * Composes the subscriptions overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSubscriptionsOverviewMemberRenewalsScreen({ id }: { id?: string }) {
  return <SuperadminSubscriptionsOverviewMemberRenewalsPageClient />;
}
