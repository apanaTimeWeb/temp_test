// config/superadmin_data_overview.url_config.ts
// Canonical URL config for Superadmin Data Overview Cockpit

export const SUPERADMIN_DATA_OVERVIEW_ROUTES = {
  root: '/superadmin/superadmin_data/data_overview' as const,
  backupOperations: '/superadmin/superadmin_data/data_backup_operations' as const,
  restoreOperations: '/superadmin/superadmin_data/data_restore_operations' as const,
  exportManagement: '/superadmin/superadmin_data/data_export_management' as const,
  importMigration: '/superadmin/superadmin_data/data_import_migration' as const,
  archiveRetention: '/superadmin/superadmin_data/data_archive_retention' as const,
} as const;

export const SUPERADMIN_DATA_OVERVIEW_API = {
  getOverviewMetrics: '/api/v1/superadmin/data/overview/metrics' as const,
  getRpoRtoStatus: '/api/v1/superadmin/data/overview/rpo-rto-status' as const,
  getRecentActivity: '/api/v1/superadmin/data/overview/recent-activity' as const,
  getStorageBreakdown: '/api/v1/superadmin/data/overview/storage-breakdown' as const,
  triggerQuickBackup: '/api/v1/superadmin/data/overview/quick-backup' as const,
} as const;
