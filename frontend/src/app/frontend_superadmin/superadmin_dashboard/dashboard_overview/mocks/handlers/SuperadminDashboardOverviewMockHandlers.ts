// RESPONSIBILITY: Define isolated mock handlers for dashboard overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_dashboard/dashboard_overview/mocks/handlers/SuperadminDashboardOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/**
 * Intentionally empty MSW registry for this source-only preview.
 * No verified HTTP API contract exists in the supplied frontend archive for this module.
 * Do not invent endpoint paths or mock write success. Populate only after the contract is approved.
 */
export const SUPERADMIN_DASHBOARD_MSW_HANDLERS: never[] = [];
