// RESPONSIBILITY: Format typed values for analytics subscription mix display using the supplied locale/currency contract; it does not mutate underlying values.
// FLOW: Feature UI -> superadmin_analytics/analytics_subscription_mix/utils/SuperadminAnalyticsSubscriptionMixDateRangeUtilities.ts -> typed values and locale -> formatted display output.
import type { SuperadminReportsDateRange } from '@/app/frontend_superadmin/superadmin_analytics/analytics_subscription_mix/types/SuperadminAnalyticsSubscriptionMixTypes';

/** Selects a bounded slice of available illustrative report points for the selected range. 
 * @param dateRange - Input supplied by the caller under the declared TypeScript contract.
 * @param availablePointCount - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function getSuperadminReportsVisiblePointCount(dateRange: SuperadminReportsDateRange, availablePointCount: number): number {
  if (!Number.isFinite(availablePointCount) || availablePointCount <= 0) return 0;
  const requestedCount = dateRange === 'Last 30 Days' ? 1 : dateRange === 'This Year' ? 4 : Math.floor(availablePointCount);
  return Math.min(Math.floor(availablePointCount), requestedCount);
}
