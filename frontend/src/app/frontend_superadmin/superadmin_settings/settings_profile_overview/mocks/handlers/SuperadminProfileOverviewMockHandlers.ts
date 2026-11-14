// RESPONSIBILITY: Define isolated mock handlers for settings profile overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_profile_overview/mocks/handlers/SuperadminProfileOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for profile_overview; do not invent endpoints or write success. */
export const SUPERADMIN_PROFILE_OVERVIEW_MSW_HANDLERS: never[] = [];
