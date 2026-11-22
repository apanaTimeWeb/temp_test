// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/api/superadmin_data_restore_operations.query_keys.ts
/**
 * @file superadmin_data_restore_operations.query_keys.ts
 * @description Hierarchical query key factory for Restore Operations.
 */

export const superadminDataRestoreOperationsKeys = {
  all: ['superadmin_data_restore_operations'] as const,
  overview: () => [...superadminDataRestoreOperationsKeys.all, 'overview'] as const,
  snapshots: (filters?: Record<string, unknown>) =>
    [...superadminDataRestoreOperationsKeys.all, 'snapshots', filters ?? {}] as const,
  snapshotDetail: (snapshotId: string) =>
    [...superadminDataRestoreOperationsKeys.all, 'snapshots', snapshotId] as const,
  drills: () => [...superadminDataRestoreOperationsKeys.all, 'drills'] as const,
};
