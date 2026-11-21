// RESPONSIBILITY: Pure helper functions for generating and filtering tenant overrides in SuperAdmin.
import type { TenantModuleOverride } from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { ALL_16_LIBRARY_MODULES } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';
import type { MockTenantOption } from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';

export function filterOutOverride(
  prev: TenantModuleOverride[],
  tenantId: string,
  branchId?: string,
  moduleId?: string
): TenantModuleOverride[] {
  return prev.filter(
    (o) =>
      !(
        o.tenantId === tenantId &&
        (o.branchId ?? '') === (branchId ?? '') &&
        (!moduleId || o.moduleId === moduleId)
      )
  );
}

export function createOneClickOverride(
  moduleId: string,
  moduleName: string,
  effectiveAllowed: boolean,
  tenant: MockTenantOption,
  branch?: { id: string; name: string }
): TenantModuleOverride {
  const nextStatus: 'Force_Enabled' | 'Force_Disabled' = effectiveAllowed ? 'Force_Disabled' : 'Force_Enabled';
  return {
    id: `ovr_${Date.now()}`,
    tenantId: tenant.id,
    tenantName: tenant.name,
    branchId: branch?.id,
    branchName: branch?.name,
    moduleId,
    moduleName,
    overrideStatus: nextStatus,
    reason: `SuperAdmin 1-click ${nextStatus === 'Force_Enabled' ? 'activation' : 'deactivation'}`,
    updatedAt: new Date().toISOString(),
    updatedBy: 'superadmin@edulibra.com',
  };
}

export function createBulkOverrides(
  status: 'Force_Enabled' | 'Force_Disabled',
  label: string,
  tenant: MockTenantOption,
  branch?: { id: string; name: string }
): TenantModuleOverride[] {
  return ALL_16_LIBRARY_MODULES.map((mod) => ({
    id: `ovr_bulk_${mod.id}_${Date.now()}`,
    tenantId: tenant.id,
    tenantName: tenant.name,
    branchId: branch?.id,
    branchName: branch?.name,
    moduleId: mod.id,
    moduleName: mod.name,
    overrideStatus: status,
    reason: `Bulk ${label} by SuperAdmin`,
    updatedAt: new Date().toISOString(),
    updatedBy: 'superadmin@edulibra.com',
  }));
}
