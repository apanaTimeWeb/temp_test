// config/superadmin_data_backup_operations.url_config.ts
// Canonical URL config for Superadmin Data Backup Operations

export const SUPERADMIN_DATA_BACKUP_OPERATIONS_ROUTES = {
  root: '/superadmin/superadmin_data/data_backup_operations' as const,
  overview: '/superadmin/superadmin_data/data_overview' as const,
  restore: '/superadmin/superadmin_data/data_restore_operations' as const,
} as const;

export const SUPERADMIN_DATA_BACKUP_OPERATIONS_API = {
  getSchedules: '/api/v1/superadmin/data/backup-operations/schedules' as const,
  createSchedule: '/api/v1/superadmin/data/backup-operations/schedules' as const,
  updateSchedule: (id: string) => `/api/v1/superadmin/data/backup-operations/schedules/${id}` as const,
  toggleScheduleStatus: (id: string) => `/api/v1/superadmin/data/backup-operations/schedules/${id}/toggle` as const,
  triggerFullPlatformBackup: '/api/v1/superadmin/data/backup-operations/full-platform-backup' as const,
} as const;
