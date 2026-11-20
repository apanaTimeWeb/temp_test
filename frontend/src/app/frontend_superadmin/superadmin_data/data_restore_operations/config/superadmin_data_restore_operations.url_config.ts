// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/config/superadmin_data_restore_operations.url_config.ts
/**
 * @file superadmin_data_restore_operations.url_config.ts
 * @description Centralized URL routes and API endpoints for Restore Operations & Sandbox Drills.
 */

export const RESTORE_OPERATIONS_ROUTES = {
  INDEX: '/superadmin/superadmin_data/data_restore_operations',
  OVERVIEW: '/superadmin/superadmin_data/data_overview',
  BACKUP: '/superadmin/superadmin_data/data_backup_operations',
} as const;

export const RESTORE_OPERATIONS_URLS = {
  OVERVIEW: '/api/v1/superadmin/data/restore-operations/overview',
  SNAPSHOTS_LIST: '/api/v1/superadmin/data/restore-operations/snapshots',
  DRILLS_LIST: '/api/v1/superadmin/data/restore-operations/drills',
  EXECUTE_RESTORE: '/api/v1/superadmin/data/restore-operations/restore',
  TRIGGER_DRILL: '/api/v1/superadmin/data/restore-operations/sandbox-drill',
  VERIFY_CHECKSUM: (id: string) => `/api/v1/superadmin/data/restore-operations/snapshots/${id}/verify-checksum`,
} as const;

// Backward-compatible aliases
export const SUPERADMIN_DATA_RESTORE_OPERATIONS_ROUTES = {
  root: RESTORE_OPERATIONS_ROUTES.INDEX,
  overview: RESTORE_OPERATIONS_ROUTES.OVERVIEW,
  backup: RESTORE_OPERATIONS_ROUTES.BACKUP,
} as const;

export const SUPERADMIN_DATA_RESTORE_OPERATIONS_API = {
  getSnapshotHistory: RESTORE_OPERATIONS_URLS.SNAPSHOTS_LIST,
  getRestoreDrills: RESTORE_OPERATIONS_URLS.DRILLS_LIST,
  executeRestore: RESTORE_OPERATIONS_URLS.EXECUTE_RESTORE,
  runSandboxDrill: RESTORE_OPERATIONS_URLS.TRIGGER_DRILL,
  verifySnapshotChecksum: RESTORE_OPERATIONS_URLS.VERIFY_CHECKSUM,
} as const;
