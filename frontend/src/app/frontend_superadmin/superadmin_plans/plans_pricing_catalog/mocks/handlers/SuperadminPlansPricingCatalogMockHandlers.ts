// RESPONSIBILITY: Define isolated mock handlers for plans pricing catalog; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_plans/plans_pricing_catalog/mocks/handlers/SuperadminPlansPricingCatalogMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSUBSCRIPTIONSPRICINGPLANS_MOCK_HANDLERS: readonly never[] = [];
