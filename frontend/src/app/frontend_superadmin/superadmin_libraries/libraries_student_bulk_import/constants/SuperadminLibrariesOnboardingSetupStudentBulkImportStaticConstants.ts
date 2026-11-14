// RESPONSIBILITY: Define stable module-owned constants for libraries student bulk import; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_libraries/libraries_student_bulk_import/constants/SuperadminLibrariesOnboardingSetupStudentBulkImportStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx. */
export const SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_CLIENT_ALLOWED = ['all', 'ok', 'warning', 'error'];

/** Maximum number of preview rows rendered in the table at once. */
export const SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE = 50;
