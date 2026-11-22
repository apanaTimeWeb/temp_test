// RESPONSIBILITY: Define local sample fixtures for analytics financials; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_analytics/analytics_financials/mocks/fixtures/SuperadminAnalyticsFinancialsRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINREPORTSFINANCIALS_ROUTE_FIXTURE = { route: '/superadmin/superadmin_analytics/analytics_financials', source: 'local-preview' } as const;
