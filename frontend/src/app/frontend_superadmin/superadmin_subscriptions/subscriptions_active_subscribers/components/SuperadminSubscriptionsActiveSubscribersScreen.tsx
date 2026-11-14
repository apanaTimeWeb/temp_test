/** Responsibility: isolated route adapter for the Active Subscribers workflow. */
/** Data-Flow: canonical route props -> SuperadminSubscriptionsActiveSubscribersScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSubscriptionsActiveSubscribersPageClient from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx';

/**
 * Composes the subscriptions active subscribers screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSubscriptionsActiveSubscribersScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSubscriptionsActiveSubscribersPageClient />;
}
