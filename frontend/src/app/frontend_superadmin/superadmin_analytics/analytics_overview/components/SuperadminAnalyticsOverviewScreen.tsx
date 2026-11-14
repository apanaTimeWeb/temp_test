/** Responsibility: Route adapter for the analytics_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminAnalyticsOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the analytics_overview autonomous module. */
import SuperadminAnalyticsOverviewPageClient from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/components/SuperadminAnalyticsOverviewPageClient';

/**
 * Composes the analytics overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAnalyticsOverviewScreen({ id }: { id?: string }) {
  return <SuperadminAnalyticsOverviewPageClient />;
}
