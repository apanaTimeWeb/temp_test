/** Responsibility: isolated route adapter for the Financials workflow. */
/** Data-Flow: canonical route props -> SuperadminAnalyticsFinancialsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminAnalyticsFinancialsPageClient from '@/app/frontend_superadmin/superadmin_analytics/analytics_financials/components/SuperadminAnalyticsFinancialsPageClient.tsx';

/**
 * Composes the analytics financials screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminAnalyticsFinancialsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminAnalyticsFinancialsPageClient />;
}
