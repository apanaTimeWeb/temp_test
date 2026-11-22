// RESPONSIBILITY: Define local sample fixtures for plans pricing catalog; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_plans/plans_pricing_catalog/mocks/fixtures/SuperadminPlansPricingCatalogRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSUBSCRIPTIONSPRICINGPLANS_ROUTE_FIXTURE = { route: '/superadmin/superadmin_plans/plans_pricing_catalog', source: 'local-preview' } as const;
