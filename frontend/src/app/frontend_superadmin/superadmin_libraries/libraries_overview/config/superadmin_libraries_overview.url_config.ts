// RESPONSIBILITY: Define canonical route/configuration constants for libraries overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_overview/config/superadmin_libraries_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Canonical feature page paths. API paths are intentionally absent because no approved API contract was supplied. */
const SUPERADMIN_LIBRARIES_URLS = {
  PAGE: '/superadmin/superadmin_libraries',
  LIST: '/superadmin/superadmin_libraries',
  ADD_LIBRARY: '/superadmin/superadmin_libraries/libraries_onboarding_setup',
} as const;
const MODULE_URLS = SUPERADMIN_LIBRARIES_URLS;
/**
 * Defines the public ModuleUrls contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;

/** Grouped public route contract for libraries_overview; screens share this isolated feature module. */
const SUPERADMIN_LIBRARIES_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview",
  SCREENS: {
    "libraries_overview": "/superadmin/superadmin_libraries/libraries_overview",
  },
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_SHIFT_GAP_ANALYSIS_ACCOUNTING_SHIFT_GAP_ANALYZER_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_shift_gap_analysis",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_shift_gap_analysis",
} as const;

/** Canonical leaf-owned route contract. Legacy query-view URLs redirect through the domain entry page. */
/** Canonical destination URLs for library/system operations. The exported constant name is retained for compatibility with existing feature-local imports. */
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

/**
 * No API endpoint strings are declared for this feature because the supplied
 * audit inputs contain no verified API contract for it. Do not invent paths.
 */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_MODULE_URLS = SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_URLS;
/**
 * Defines the public LibrariesOverviewLibraryOfflineOperationsModuleUrls contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type LibrariesOverviewLibraryOfflineOperationsModuleUrls = typeof SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_MODULE_URLS;

/** Grouped public route contract for library_offline_operations; screens share this isolated feature module. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_OFFLINE_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations",
  SCREENS: {
    "library_offline_operations": "/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations",
  },
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_SYSTEM_AUTO_SCALE_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_scaling_recommendations",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_scaling_recommendations",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_ANALYSIS_ACCOUNTING_SEAT_GAP_REPORT_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_analysis",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_analysis",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_POWER_MANAGEMENT_SYSTEM_POWER_SAVING_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_REGISTRY_ACCOUNTING_ASSETS_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_registry",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_registry",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_MAINTENANCE_WORK_ORDERS_SYSTEM_MAINTENANCE_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=facility_maintenance_work_orders",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=facility_maintenance_work_orders",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_WAITLIST_AUTOMATION_SYSTEM_WAITLIST_AUTOMATION_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_waitlist_automation",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_waitlist_automation",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_GAP_FILLING_SYSTEM_GAP_FILLING_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_gap_filling",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_gap_filling",
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_MAINTENANCE_ACCOUNTING_ASSET_MAINTENANCE_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance",
} as const;

/** Canonical internal workflow routes; each workflow remains inside the approved owning leaf. */
const SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS = {
  FACILITY_ASSET_MAINTENANCE: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance',
  FACILITY_ASSET_REGISTRY: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_registry',
  FACILITY_MAINTENANCE_WORK_ORDERS: '/superadmin/superadmin_libraries/libraries_overview?view=facility_maintenance_work_orders',
  FACILITY_POWER_MANAGEMENT: '/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management',
  LIBRARY_CAPACITY_ANALYSIS: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_analysis',
  LIBRARY_CAPACITY_GAP_FILLING: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_gap_filling',
  LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_scaling_recommendations',
  LIBRARY_OFFLINE_OPERATIONS: '/superadmin/superadmin_libraries/libraries_overview?view=library_offline_operations',
  LIBRARY_SHIFT_GAP_ANALYSIS: '/superadmin/superadmin_libraries/libraries_overview?view=library_shift_gap_analysis',
  LIBRARY_WAITLIST_AUTOMATION: '/superadmin/superadmin_libraries/libraries_overview?view=library_waitlist_automation',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES = {
  SUPERADMIN_LIBRARIES_URLS: SUPERADMIN_LIBRARIES_URLS,
  MODULE_URLS: MODULE_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_SHIFT_GAP_ANALYSIS_ACCOUNTING_SHIFT_GAP_ANALYZER_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_SHIFT_GAP_ANALYSIS_ACCOUNTING_SHIFT_GAP_ANALYZER_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_MODULE_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_MODULE_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_OFFLINE_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_OFFLINE_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_SYSTEM_AUTO_SCALE_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_SYSTEM_AUTO_SCALE_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_ANALYSIS_ACCOUNTING_SEAT_GAP_REPORT_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_ANALYSIS_ACCOUNTING_SEAT_GAP_REPORT_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_POWER_MANAGEMENT_SYSTEM_POWER_SAVING_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_POWER_MANAGEMENT_SYSTEM_POWER_SAVING_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_REGISTRY_ACCOUNTING_ASSETS_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_REGISTRY_ACCOUNTING_ASSETS_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_MAINTENANCE_WORK_ORDERS_SYSTEM_MAINTENANCE_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_MAINTENANCE_WORK_ORDERS_SYSTEM_MAINTENANCE_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_WAITLIST_AUTOMATION_SYSTEM_WAITLIST_AUTOMATION_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_WAITLIST_AUTOMATION_SYSTEM_WAITLIST_AUTOMATION_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_GAP_FILLING_SYSTEM_GAP_FILLING_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_GAP_FILLING_SYSTEM_GAP_FILLING_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_MAINTENANCE_ACCOUNTING_ASSET_MAINTENANCE_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_MAINTENANCE_ACCOUNTING_ASSET_MAINTENANCE_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_OVERVIEW_API = {} as const;
