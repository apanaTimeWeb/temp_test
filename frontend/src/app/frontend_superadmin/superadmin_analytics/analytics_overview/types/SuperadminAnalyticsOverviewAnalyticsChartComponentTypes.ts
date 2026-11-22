// RESPONSIBILITY: Define compile-time types for analytics overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_analytics/analytics_overview/types/SuperadminAnalyticsOverviewAnalyticsChartComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_analytics/superadmin_analytics_components/superadmin_analytics_analytics_components/SuperadminAnalyticsOverviewAnalyticsChart.tsx. */
import type { SuperadminReportsTab, SuperadminReportsDateRange } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/types/SuperadminAnalyticsOverviewTypes';

/**
 * Defines the public SuperadminReportsAnalyticsChartProps contract for analytics overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property activeTab Value defined by the existing feature-local contract. Declared type: SuperadminReportsTab.
 * @property dateRange Value defined by the existing feature-local contract. Declared type: SuperadminReportsDateRange.
 */
export interface SuperadminReportsAnalyticsChartProps {
  activeTab: SuperadminReportsTab;
  dateRange: SuperadminReportsDateRange;
}
