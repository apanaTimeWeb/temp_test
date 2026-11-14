// RESPONSIBILITY: Define canonical route/configuration constants for libraries student smart id; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_student_smart_id/config/libraries_student_smart_id.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the student_smart_id workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_STUDENT_SMART_ID_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_student_smart_id',
  SCREEN: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_smart_id',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_SMART_ID_SYSTEM_SMART_ID_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_smart_id",
  SCREEN: "/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_smart_id",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_STUDENT_SMART_ID_ROUTES = {
  SUPERADMIN_LIBRARIES_STUDENT_SMART_ID_URLS: SUPERADMIN_LIBRARIES_STUDENT_SMART_ID_URLS,
  SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_SMART_ID_SYSTEM_SMART_ID_URLS: SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_STUDENT_SMART_ID_SYSTEM_SMART_ID_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_STUDENT_SMART_ID_API = {} as const;
