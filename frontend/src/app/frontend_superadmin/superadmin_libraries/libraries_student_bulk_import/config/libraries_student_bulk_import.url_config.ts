// RESPONSIBILITY: Define canonical route/configuration constants for libraries student bulk import; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_student_bulk_import/config/libraries_student_bulk_import.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the student_bulk_import workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_STUDENT_BULK_IMPORT_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_student_bulk_import',
  SCREEN: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_bulk_import',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_BULK_IMPORT_SYSTEM_BULK_IMPORT_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_bulk_import",
  SCREEN: "/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_bulk_import",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_STUDENT_BULK_IMPORT_ROUTES = {
  SUPERADMIN_LIBRARIES_STUDENT_BULK_IMPORT_URLS: SUPERADMIN_LIBRARIES_STUDENT_BULK_IMPORT_URLS,
  SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_BULK_IMPORT_SYSTEM_BULK_IMPORT_URLS: SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_BULK_IMPORT_SYSTEM_BULK_IMPORT_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_STUDENT_BULK_IMPORT_API = {} as const;
