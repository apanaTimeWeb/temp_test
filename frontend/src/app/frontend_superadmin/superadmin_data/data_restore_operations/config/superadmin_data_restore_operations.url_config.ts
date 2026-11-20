// config/superadmin_data_restore_operations.url_config.ts
// Canonical URL config for Superadmin Data Restore Operations

export const SUPERADMIN_DATA_RESTORE_OPERATIONS_ROUTES = {
  root: '/superadmin/superadmin_data/data_restore_operations' as const,
  overview: '/superadmin/superadmin_data/data_overview' as const,
  backup: '/superadmin/superadmin_data/data_backup_operations' as const,
} as const;

export const SUPERADMIN_DATA_RESTORE_OPERATIONS_API = {
  getSnapshotHistory: '/api/v1/superadmin/data/restore-operations/snapshots' as const,
  getRestoreDrills: '/api/v1/superadmin/data/restore-operations/drills' as const,
  executeRestore: '/api/v1/superadmin/data/restore-operations/restore' as const,
  runSandboxDrill: '/api/v1/superadmin/data/restore-operations/sandbox-drill' as const,
  verifySnapshotChecksum: (id: string) => `/api/v1/superadmin/data/restore-operations/snapshots/${id}/verify-checksum` as const,
} as const;
