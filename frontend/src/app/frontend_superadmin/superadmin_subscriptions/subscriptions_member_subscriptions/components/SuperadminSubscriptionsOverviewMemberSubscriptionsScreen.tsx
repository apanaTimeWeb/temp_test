/** Responsibility: Route adapter for the member_subscriptions screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSubscriptionsOverviewMemberSubscriptionsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `subscriptions` inside the member_subscriptions autonomous module. */
import SuperadminFinanceSubscriptionsPageClient from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/components/SuperadminSubscriptionsOverviewMemberSubscriptionsPageClient';

/**
 * Composes the subscriptions overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSubscriptionsOverviewMemberSubscriptionsScreen({ id }: { id?: string }) {
  return <SuperadminFinanceSubscriptionsPageClient />;
}
