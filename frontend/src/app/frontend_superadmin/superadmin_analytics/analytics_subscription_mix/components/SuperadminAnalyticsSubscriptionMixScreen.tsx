/** Responsibility: isolated route adapter for the Subscription Mix workflow. */
/** Data-Flow: canonical route props -> SuperadminAnalyticsSubscriptionMixScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminAnalyticsSubscriptionMixPageClient from '@/app/frontend_superadmin/superadmin_analytics/analytics_subscription_mix/components/SuperadminAnalyticsSubscriptionMixPageClient.tsx';

/**
 * Composes the analytics subscription mix screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAnalyticsSubscriptionMixScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminAnalyticsSubscriptionMixPageClient />;
}
