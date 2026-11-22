// RESPONSIBILITY: Define isolated mock handlers for system backup overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_system/system_backup_overview/mocks/handlers/SuperadminBackupOverviewCreateFlowMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINBACKUPCREATE_MOCK_HANDLERS: readonly never[] = [];
