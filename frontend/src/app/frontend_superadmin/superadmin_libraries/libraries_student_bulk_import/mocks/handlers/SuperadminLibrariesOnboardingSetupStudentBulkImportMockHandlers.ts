// RESPONSIBILITY: Define isolated mock handlers for libraries student bulk import; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_libraries/libraries_student_bulk_import/mocks/handlers/SuperadminLibrariesOnboardingSetupStudentBulkImportMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for student_bulk_import; do not invent endpoints or write success. */
export const SUPERADMIN_SYSTEM_BULK_IMPORT_MSW_HANDLERS: never[] = [];
