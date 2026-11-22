// RESPONSIBILITY: Define isolated mock handlers for system backup history; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_system/system_backup_history/mocks/handlers/SuperadminBackupHistoryMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINBACKUPHISTORY_MOCK_HANDLERS: readonly never[] = [];
