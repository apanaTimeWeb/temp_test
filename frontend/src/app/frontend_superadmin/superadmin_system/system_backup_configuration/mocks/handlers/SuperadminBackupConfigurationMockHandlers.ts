// RESPONSIBILITY: Define isolated mock handlers for system backup configuration; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_system/system_backup_configuration/mocks/handlers/SuperadminBackupConfigurationMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for backup_configuration; do not invent endpoints or write success. */
export const SUPERADMIN_SYSTEM_BACKUPS_MSW_HANDLERS: never[] = [];
