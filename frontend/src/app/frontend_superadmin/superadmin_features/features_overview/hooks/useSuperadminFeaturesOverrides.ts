// RESPONSIBILITY: Level 3 custom tenant/branch override mutations and bulk governance operations.
import { useState, useCallback } from 'react';
import type {
  PlatformModuleState,
  TenantModuleOverride,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { ALL_16_LIBRARY_MODULES } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';
import {
  INITIAL_TENANT_OVERRIDES,
  type MockTenantOption,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';
import { computeEffectiveAccess } from '@/app/frontend_superadmin/superadmin_features/features_overview/utils/superadmin_features_overview_utils';
import {
  filterOutOverride,
  createOneClickOverride,
  createBulkOverrides,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/utils/superadmin_features_overrides_helpers';

interface UseOverridesProps {
  platformStates: PlatformModuleState[];
  selectedTenant: MockTenantOption | undefined;
  selectedTenantId: string;
  selectedBranch: { id: string; name: string } | undefined;
  selectedBranchId: string;
  togglePlatformDefault: (moduleId: string) => void;
  showNotification: (msg: string, type?: 'success' | 'info') => void;
}

export function useSuperadminFeaturesOverrides({
  platformStates,
  selectedTenant,
  selectedTenantId,
  selectedBranch,
  selectedBranchId,
  togglePlatformDefault,
  showNotification,
}: UseOverridesProps) {
  const [overrides, setOverrides] = useState<TenantModuleOverride[]>(INITIAL_TENANT_OVERRIDES);

  const saveOverride = useCallback(
    (override: Omit<TenantModuleOverride, 'id' | 'updatedAt' | 'updatedBy'>) => {
      const newOverride: TenantModuleOverride = {
        ...override,
        id: `ovr_${Date.now()}`,
        updatedAt: new Date().toISOString(),
        updatedBy: 'superadmin@edulibra.com',
      };
      setOverrides((prev) => [
        newOverride,
        ...filterOutOverride(prev, override.tenantId, override.branchId, override.moduleId),
      ]);
      showNotification(`Custom override saved for ${override.moduleName}.`, 'success');
    },
    [showNotification]
  );

  const removeOverride = useCallback(
    (overrideId: string) => {
      setOverrides((prev) => prev.filter((o) => o.id !== overrideId));
      showNotification('Custom override removed. Default governance restored.', 'info');
    },
    [showNotification]
  );

  const toggleLibraryModule = useCallback(
    (moduleId: string) => {
      if (selectedTenantId === 'global' || !selectedTenant) {
        togglePlatformDefault(moduleId);
        return;
      }
      const mod = ALL_16_LIBRARY_MODULES.find((m) => m.id === moduleId);
      if (!mod) return;

      const currentEffective = computeEffectiveAccess({
        moduleId,
        platformStates,
        tenantPlanTier: selectedTenant.planTier,
        tenantId: selectedTenant.id,
        branchId: selectedBranch?.id,
        overrides,
      });

      const branchTarget = selectedBranchId !== 'all' ? selectedBranch : undefined;
      const newOverride = createOneClickOverride(
        moduleId,
        mod.name,
        currentEffective.effectiveAllowed,
        selectedTenant,
        branchTarget
      );

      setOverrides((prev) => [
        newOverride,
        ...filterOutOverride(prev, selectedTenant.id, branchTarget?.id, moduleId),
      ]);

      const label = newOverride.overrideStatus === 'Force_Enabled' ? 'Enabled' : 'Disabled';
      showNotification(`${mod.name} is now ${label} for ${selectedTenant.name}.`, 'success');
    },
    [selectedTenantId, selectedTenant, selectedBranchId, selectedBranch, platformStates, overrides, togglePlatformDefault, showNotification]
  );

  const resetModuleOverride = useCallback(
    (moduleId: string) => {
      if (selectedTenantId === 'global' || !selectedTenant) return;
      const branchTargetId = selectedBranchId !== 'all' ? selectedBranchId : undefined;
      setOverrides((prev) => filterOutOverride(prev, selectedTenant.id, branchTargetId, moduleId));
      const mod = ALL_16_LIBRARY_MODULES.find((m) => m.id === moduleId);
      showNotification(`${mod?.name ?? 'Module'} reset to plan defaults.`, 'info');
    },
    [selectedTenantId, selectedTenant, selectedBranchId, showNotification]
  );

  const performBulkOverride = useCallback(
    (status: 'Force_Enabled' | 'Force_Disabled', label: string) => {
      if (selectedTenantId === 'global' || !selectedTenant) return;
      const branchTarget = selectedBranchId !== 'all' ? selectedBranch : undefined;
      const newItems = createBulkOverrides(status, label, selectedTenant, branchTarget);

      setOverrides((prev) => [
        ...newItems,
        ...filterOutOverride(prev, selectedTenant.id, branchTarget?.id),
      ]);
      const statusWord = status === 'Force_Enabled' ? 'enabled' : 'disabled';
      showNotification(`All 16 modules force-${statusWord} for ${selectedTenant.name}.`, 'success');
    },
    [selectedTenantId, selectedTenant, selectedBranchId, selectedBranch, showNotification]
  );

  const resetAllForCurrentScope = useCallback(() => {
    if (selectedTenantId === 'global' || !selectedTenant) return;
    const branchTargetId = selectedBranchId !== 'all' ? selectedBranchId : undefined;
    setOverrides((prev) => filterOutOverride(prev, selectedTenant.id, branchTargetId));
    showNotification(`All module overrides cleared for ${selectedTenant.name}. Restored to plan defaults.`, 'info');
  }, [selectedTenantId, selectedTenant, selectedBranchId, showNotification]);

  return {
    overrides,
    saveOverride,
    removeOverride,
    toggleLibraryModule,
    resetModuleOverride,
    enableAllForCurrentScope: () => performBulkOverride('Force_Enabled', 'enabled'),
    disableAllForCurrentScope: () => performBulkOverride('Force_Disabled', 'disabled'),
    resetAllForCurrentScope,
  };
}
