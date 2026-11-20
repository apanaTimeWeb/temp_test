// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/api/superadmin_data_export_management.query_keys.ts
/**
 * @file superadmin_data_export_management.query_keys.ts
 * @description Hierarchical query key factory for Data Export Management.
 */

export const superadminDataExportManagementKeys = {
  all: ['superadmin_data_export_management'] as const,
  overview: () => [...superadminDataExportManagementKeys.all, 'overview'] as const,
  jobs: (filters?: Record<string, unknown>) =>
    [...superadminDataExportManagementKeys.all, 'jobs', filters ?? {}] as const,
  tenants: () => [...superadminDataExportManagementKeys.all, 'tenants'] as const,
  branches: (tenantId?: string) =>
    [...superadminDataExportManagementKeys.all, 'branches', tenantId ?? 'all'] as const,
};
