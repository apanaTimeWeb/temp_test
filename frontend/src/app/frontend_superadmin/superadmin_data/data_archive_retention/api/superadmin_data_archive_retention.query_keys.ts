// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/api/superadmin_data_archive_retention.query_keys.ts
/**
 * @file superadmin_data_archive_retention.query_keys.ts
 * @description Hierarchical query key factory for Data Archive & Retention Management.
 */

export const superadminDataArchiveRetentionKeys = {
  all: ['superadmin_data_archive_retention'] as const,
  overview: () => [...superadminDataArchiveRetentionKeys.all, 'overview'] as const,
  rules: () => [...superadminDataArchiveRetentionKeys.all, 'rules'] as const,
  records: (filters?: Record<string, unknown>) =>
    [...superadminDataArchiveRetentionKeys.all, 'records', filters ?? {}] as const,
};
