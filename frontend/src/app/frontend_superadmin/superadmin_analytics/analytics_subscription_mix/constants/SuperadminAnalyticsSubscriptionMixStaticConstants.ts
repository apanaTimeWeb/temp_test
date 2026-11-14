// RESPONSIBILITY: Define stable module-owned constants for analytics subscription mix; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_analytics/analytics_subscription_mix/constants/SuperadminAnalyticsSubscriptionMixStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminAnalyticsSubscriptionMixAnalyticsChart.tsx. */
export const SUPERADMIN_REPORTS_ANALYTICS_CHART_COMMON = {
    chart: { background: 'transparent', toolbar: { show: false }, animations: { enabled: false }, foreColor: 'var(--text-secondary)' },
    dataLabels: { enabled: false },
    grid: { borderColor: 'var(--chart-grid)' },
    legend: { labels: { colors: 'var(--text-secondary)' } },
    tooltip: { theme: 'dark' },
    stroke: { curve: 'smooth', width: 2 },
  };


/** Static module-owned options/status mapping extracted from SuperadminAnalyticsSubscriptionMixPageClient.tsx. */
export const SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_SELECTOR = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';


import { Activity, Building2, IndianRupee } from 'lucide-react';
/** Static module-owned options/status mapping extracted from SuperadminAnalyticsSubscriptionMixPageClient.tsx. */
export const SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_REPORT_TABS = [
  { name: 'Financials', icon: IndianRupee },
  { name: 'Tenant Growth', icon: Building2 },
  { name: 'Subscription Mix', icon: Activity },
];


/** Static module-owned options/status mapping extracted from SuperadminAnalyticsSubscriptionMixPageClient.tsx. */
export const SUPERADMIN_REPORTS_OVERVIEW_PAGE_CLIENT_DATE_RANGES = ['Last 30 Days', 'Last 6 Months', 'This Year', 'All Time'] as const;
