// RESPONSIBILITY: Define isolated mock handlers for system data export jobs; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_system/system_data_export_jobs/mocks/handlers/SuperadminDataExportJobsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for data_export_jobs; do not invent endpoints or write success. */
export const SUPERADMIN_SYSTEM_DATA_EXPORT_MSW_HANDLERS: never[] = [];
