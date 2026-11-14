// RESPONSIBILITY: Define isolated mock handlers for support tickets; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_support/support_tickets/mocks/handlers/SuperadminSupportTicketsOverviewMockHandlersFromMocks.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for support_tickets; do not invent endpoints or write success. */
export const SUPERADMIN_SUPPORT_TICKETS_OVERVIEW_MSW_HANDLERS: never[] = [];
