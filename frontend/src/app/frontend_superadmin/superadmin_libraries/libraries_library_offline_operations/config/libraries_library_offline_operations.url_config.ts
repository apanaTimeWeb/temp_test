// RESPONSIBILITY: Define canonical route/configuration constants for libraries library offline operations; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_library_offline_operations/config/libraries_library_offline_operations.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the library_offline_operations workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_LIBRARY_OFFLINE_OPERATIONS_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_library_offline_operations',
  SCREEN: '/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_OFFLINE_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations",
  SCREENS: {
    "library_offline_operations": "/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations",
  },
} as const;

/** Existing public route/API contract copied verbatim from its former shared config owner. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_URLS = {
  DASHBOARD: '/superadmin/superadmin_dashboard',
  PAGE: '/superadmin/superadmin_libraries',
  AUTO_SCALE: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_scaling_recommendations',
  BACKUPS: '/superadmin/superadmin_system/backup_configuration',
  BRANDING: '/superadmin/superadmin_settings/settings_branding',
  BULK_IMPORT: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_bulk_import',
  DATA_EXPORT: '/superadmin/superadmin_system/data_export_jobs',
  GAP_FILLING: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_gap_filling',
  MAINTENANCE: '/superadmin/superadmin_libraries/libraries_overview?view=facility_maintenance_work_orders',
  OFFLINE: '/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations',
  POWER_SAVING: '/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management',
  PROFILE: '/superadmin/superadmin_libraries/libraries_profile_configuration',
  SETTINGS: '/superadmin/superadmin_settings/settings_general?view=settings_library_configuration',
  SMART_ID: '/superadmin/superadmin_libraries/libraries_onboarding_setup?view=student_smart_id',
  WAITLIST_AUTOMATION: '/superadmin/superadmin_libraries/libraries_overview?view=library_waitlist_automation',
  WHATSAPP_INTEGRATION: '/superadmin/superadmin_communication/communication_whatsapp_integration',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_LIBRARY_OFFLINE_OPERATIONS_ROUTES = {
  SUPERADMIN_LIBRARIES_LIBRARY_OFFLINE_OPERATIONS_URLS: SUPERADMIN_LIBRARIES_LIBRARY_OFFLINE_OPERATIONS_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_OFFLINE_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_OFFLINE_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_LIBRARY_OFFLINE_OPERATIONS_API = {} as const;
