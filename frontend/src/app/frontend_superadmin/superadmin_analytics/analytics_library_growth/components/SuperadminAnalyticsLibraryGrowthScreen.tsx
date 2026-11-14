/** Responsibility: isolated route adapter for the Tenant Growth workflow. */
/** Data-Flow: canonical route props -> SuperadminAnalyticsLibraryGrowthScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminAnalyticsLibraryGrowthPageClient from '@/app/frontend_superadmin/superadmin_analytics/analytics_library_growth/components/SuperadminAnalyticsLibraryGrowthPageClient.tsx';

/**
 * Composes the analytics library growth screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAnalyticsLibraryGrowthScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminAnalyticsLibraryGrowthPageClient />;
}
