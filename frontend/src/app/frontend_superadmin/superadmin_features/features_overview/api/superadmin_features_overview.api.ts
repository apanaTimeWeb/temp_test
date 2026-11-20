// RESPONSIBILITY: API abstraction layer for SuperAdmin Feature & Module Governance.
import type {
  PlatformModuleState,
  TenantModuleOverride,
  ApiDenialSimulationResult,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import {
  INITIAL_PLATFORM_MODULE_STATES,
  INITIAL_TENANT_OVERRIDES,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';

export interface FeaturesApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function fetchPlatformModuleStates(): Promise<FeaturesApiResponse<PlatformModuleState[]>> {
  return {
    success: true,
    data: [...INITIAL_PLATFORM_MODULE_STATES],
    message: 'Platform module states loaded successfully.',
  };
}

export async function fetchTenantOverrides(): Promise<FeaturesApiResponse<TenantModuleOverride[]>> {
  return {
    success: true,
    data: [...INITIAL_TENANT_OVERRIDES],
    message: 'Tenant overrides loaded successfully.',
  };
}

export async function updatePlatformToggle(
  moduleId: string,
  field: 'platformDefault' | 'starterPlanAllowed' | 'professionalPlanAllowed' | 'enterprisePlanAllowed',
  value: boolean
): Promise<FeaturesApiResponse<{ moduleId: string; field: string; value: boolean }>> {
  return {
    success: true,
    data: { moduleId, field, value },
    message: `Updated ${moduleId} - ${field} to ${value}.`,
  };
}

export async function saveTenantOverride(
  override: TenantModuleOverride
): Promise<FeaturesApiResponse<TenantModuleOverride>> {
  return {
    success: true,
    data: override,
    message: `Custom override saved for ${override.moduleName}.`,
  };
}

export async function deleteTenantOverride(
  overrideId: string
): Promise<FeaturesApiResponse<{ id: string }>> {
  return {
    success: true,
    data: { id: overrideId },
    message: 'Override removed successfully.',
  };
}
