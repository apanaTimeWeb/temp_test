// RESPONSIBILITY: Define canonical route/configuration constants for system backup history; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_system/system_backup_history/config/superadmin_backup_history.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the Backup History autonomous workflow; no API contract is inferred. */
const SUPERADMIN_BACKUP_HISTORY_URLS = {
  PAGE: '/superadmin/superadmin_system/backup_history',
  SCREEN: '/superadmin/superadmin_system/backup_history',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Route retained from a folded child workflow; no backend endpoint is inferred. */
const SUPERADMIN_BACKUP_RESTORE_URLS = {
  PAGE: "/superadmin/superadmin_system/backup_history?view=restore",
  SCREEN: "/superadmin/superadmin_system/backup_history?view=restore",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SYSTEM_BACKUP_HISTORY_ROUTES = {
  SUPERADMIN_BACKUP_HISTORY_URLS: SUPERADMIN_BACKUP_HISTORY_URLS,
  SUPERADMIN_BACKUP_RESTORE_URLS: SUPERADMIN_BACKUP_RESTORE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SYSTEM_BACKUP_HISTORY_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  backup_history: '/superadmin/superadmin_system/backup_history',
  backup_history__restore: '/superadmin/superadmin_system/backup_history?view=restore',
  backup_overview__create: '/superadmin/superadmin_system/backup_overview?view=create',
  backup_schedules: '/superadmin/superadmin_system/backup_schedules',
} as const;
