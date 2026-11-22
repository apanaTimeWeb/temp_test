// RESPONSIBILITY: Define canonical route/configuration constants for libraries onboarding setup; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_onboarding_setup/config/superadmin_libraries_onboarding_setup.url_config.ts -> typed constants -> owning route or API caller.
/** Canonical onboarding route contract. The exported constant name is retained for compatibility with existing feature-local imports. */
const SUPERADMIN_SETUP_WIZARD_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_onboarding_setup',
  DASHBOARD: '/superadmin/superadmin_dashboard',
} as const;

/**
 * No API endpoint strings are declared for this feature because the supplied
 * audit inputs contain no verified API contract for it. Do not invent paths.
 */
const MODULE_URLS = SUPERADMIN_SETUP_WIZARD_URLS;
/**
 * Defines the public ModuleUrls contract for libraries onboarding setup. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;

/** Grouped public route contract for libraries_onboarding_setup; screens share this isolated feature module. */
const SUPERADMIN_SETUP_WIZARD_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_onboarding_setup",
  SCREEN: "/superadmin/superadmin_libraries/libraries_onboarding_setup",
  SCREENS: {
    "libraries_onboarding_setup": "/superadmin/superadmin_libraries/libraries_onboarding_setup",
  },
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_BULK_IMPORT_SYSTEM_BULK_IMPORT_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_bulk_import",
  SCREEN: "/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_bulk_import",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_SMART_ID_SYSTEM_SMART_ID_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_smart_id",
  SCREEN: "/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_smart_id",
} as const;

/** Canonical internal workflow routes; each workflow remains inside the approved owning leaf. */
const SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_WORKFLOW_URLS = {
  STUDENT_BULK_IMPORT: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_bulk_import',
  STUDENT_SMART_ID: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_smart_id',
} as const;

/** Verified legacy destinations for workflows migrated behind the canonical onboarding dispatcher. */
const LEGACY_DESTINATIONS = {
  STUDENT_BULK_IMPORT: '/superadmin/superadmin_libraries/libraries_student_bulk_import',
  STUDENT_SMART_ID: '/superadmin/superadmin_libraries/libraries_student_smart_id',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES = {
  SUPERADMIN_SETUP_WIZARD_URLS: SUPERADMIN_SETUP_WIZARD_URLS,
  MODULE_URLS: MODULE_URLS,
  SUPERADMIN_SETUP_WIZARD_OVERVIEW_URLS: SUPERADMIN_SETUP_WIZARD_OVERVIEW_URLS,
  SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_BULK_IMPORT_SYSTEM_BULK_IMPORT_URLS: SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_BULK_IMPORT_SYSTEM_BULK_IMPORT_URLS,
  SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_SMART_ID_SYSTEM_SMART_ID_URLS: SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_SMART_ID_SYSTEM_SMART_ID_URLS,
  SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_WORKFLOW_URLS: SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_WORKFLOW_URLS,
  LEGACY_DESTINATIONS,
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_API = {} as const;
