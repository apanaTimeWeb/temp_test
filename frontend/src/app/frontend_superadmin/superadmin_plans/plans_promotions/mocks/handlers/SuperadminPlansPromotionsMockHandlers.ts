// RESPONSIBILITY: Define isolated mock handlers for plans promotions; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_plans/plans_promotions/mocks/handlers/SuperadminPlansPromotionsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINBILLINGPROMOCODES_MOCK_HANDLERS: readonly never[] = [];
