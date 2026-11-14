// RESPONSIBILITY: Define local sample fixtures for plans promotions; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_plans/plans_promotions/mocks/fixtures/SuperadminPlansPromotionsRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINBILLINGPROMOCODES_ROUTE_FIXTURE = { route: '/superadmin/superadmin_plans/plans_promotions', source: 'local-preview' } as const;
