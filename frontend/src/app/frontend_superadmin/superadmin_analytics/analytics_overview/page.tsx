// RESPONSIBILITY: Adapt the canonical route for analytics overview to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_analytics/analytics_overview/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical overview route; preserves the existing overview UI and its local feature lifecycle. */
import SuperadminAnalyticsOverviewScreen from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/components/SuperadminAnalyticsOverviewScreen';

/**
 * Renders the analytics overview route boundary and delegates business presentation to feature-local components.
 */
export default function SuperadminReportsOverviewPage() {
  return <div className="min-w-0" data-feature-module="superadmin_analytics" data-feature-route="analytics_overview"><SuperadminAnalyticsOverviewScreen /></div>;
}
