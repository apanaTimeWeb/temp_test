// RESPONSIBILITY: Define isolated mock handlers for libraries overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_libraries/libraries_overview/mocks/handlers/SuperadminLibrariesOverviewMockHandlersFromMocks.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for libraries_overview; do not invent endpoints or write success. */
export const SUPERADMIN_LIBRARIES_OVERVIEW_MSW_HANDLERS: never[] = [];
