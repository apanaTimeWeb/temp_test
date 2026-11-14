// RESPONSIBILITY: Define canonical route/configuration constants for libraries library waitlist automation; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_library_waitlist_automation/config/libraries_library_waitlist_automation.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the library_waitlist_automation workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_LIBRARY_WAITLIST_AUTOMATION_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_library_waitlist_automation',
  SCREEN: '/superadmin/superadmin_libraries/libraries_overview?view=library_waitlist_automation',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_WAITLIST_AUTOMATION_SYSTEM_WAITLIST_AUTOMATION_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_waitlist_automation",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_waitlist_automation",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_LIBRARY_WAITLIST_AUTOMATION_ROUTES = {
  SUPERADMIN_LIBRARIES_LIBRARY_WAITLIST_AUTOMATION_URLS: SUPERADMIN_LIBRARIES_LIBRARY_WAITLIST_AUTOMATION_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_WAITLIST_AUTOMATION_SYSTEM_WAITLIST_AUTOMATION_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_WAITLIST_AUTOMATION_SYSTEM_WAITLIST_AUTOMATION_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_LIBRARY_WAITLIST_AUTOMATION_API = {} as const;
