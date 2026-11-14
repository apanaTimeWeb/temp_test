// RESPONSIBILITY: Define canonical route/configuration constants for system data export jobs; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_system/system_data_export_jobs/config/superadmin_data_export_jobs.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_SYSTEM_DATA_EXPORT_URLS = {
  PAGE: "/superadmin/superadmin_system/data_export_jobs",
  SCREEN: "/superadmin/superadmin_system/data_export_jobs",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SYSTEM_DATA_EXPORT_JOBS_ROUTES = {
  SUPERADMIN_SYSTEM_DATA_EXPORT_URLS: SUPERADMIN_SYSTEM_DATA_EXPORT_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SYSTEM_DATA_EXPORT_JOBS_API = {} as const;
