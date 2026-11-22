// api/superadmin_data_backup_operations.query_keys.ts
export const SUPERADMIN_DATA_BACKUP_OPERATIONS_QUERY_KEYS = {
  all: ['superadmin_data_backup_operations'] as const,
  schedules: () => [...SUPERADMIN_DATA_BACKUP_OPERATIONS_QUERY_KEYS.all, 'schedules'] as const,
  schedule: (id: string) => [...SUPERADMIN_DATA_BACKUP_OPERATIONS_QUERY_KEYS.schedules(), id] as const,
};
