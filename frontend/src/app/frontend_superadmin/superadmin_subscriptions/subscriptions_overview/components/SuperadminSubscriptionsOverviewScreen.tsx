/** Responsibility: Route adapter for the subscriptions_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSubscriptionsOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the subscriptions_overview autonomous module. */
import SuperadminSubscriptionsOverviewPageClient from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewPageClient';

/**
 * Composes the subscriptions overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSubscriptionsOverviewScreen({ id }: { id?: string }) {
  return <SuperadminSubscriptionsOverviewPageClient />;
}
