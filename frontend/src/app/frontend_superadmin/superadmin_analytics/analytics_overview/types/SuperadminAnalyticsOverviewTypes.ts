// FLOW: Feature source -> superadmin_analytics/analytics_overview/types/SuperadminAnalyticsOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Reports Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminReportsTab = 'Financials' | 'Tenant Growth' | 'Subscription Mix';
/**
 * Defines the public SuperadminReportsDateRange contract for analytics overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminReportsDateRange = 'Last 30 Days' | 'Last 6 Months' | 'This Year' | 'All Time';
/**
 * Defines the public SuperadminReportsTenantFilter contract for analytics overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminReportsTenantFilter = 'All' | 'Active' | 'Churn Risk';
