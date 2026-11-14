// RESPONSIBILITY: Define isolated mock handlers for system backup overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_system/system_backup_overview/mocks/handlers/SuperadminBackupOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for backup_overview; do not invent endpoints or write success. */
export const SUPERADMIN_BACKUP_OVERVIEW_MSW_HANDLERS: never[] = [];
