// RESPONSIBILITY: Comprehensive state orchestration for SuperAdmin Feature & Module Governance.
import { useState, useMemo, useCallback } from 'react';
import type {
  PlatformModuleState,
  TenantModuleOverride,
  ModuleDefinition,
  EffectiveAccessResult,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { ALL_16_LIBRARY_MODULES } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';
import {
  INITIAL_PLATFORM_MODULE_STATES,
  INITIAL_TENANT_OVERRIDES,
  MOCK_TENANTS_LIST,
  type MockTenantOption,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';
import { computeEffectiveAccess } from '@/app/frontend_superadmin/superadmin_features/features_overview/utils/superadmin_features_overview_utils';

export function useSuperadminFeaturesOverviewState() {
  const [platformStates, setPlatformStates] = useState<PlatformModuleState[]>(INITIAL_PLATFORM_MODULE_STATES);
  const [overrides, setOverrides] = useState<TenantModuleOverride[]>(INITIAL_TENANT_OVERRIDES);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('global');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Modal states
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isApiGuardModalOpen, setIsApiGuardModalOpen] = useState(false);
  const [targetModule, setTargetModule] = useState<ModuleDefinition | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const selectedTenant: MockTenantOption | undefined = useMemo(() => {
    return MOCK_TENANTS_LIST.find((t) => t.id === selectedTenantId);
  }, [selectedTenantId]);

  const selectedBranch = useMemo(() => {
    if (!selectedTenant || selectedBranchId === 'all') return undefined;
    return selectedTenant.branches.find((b) => b.id === selectedBranchId);
  }, [selectedTenant, selectedBranchId]);

  // Handle switching tenant
  const handleTenantChange = useCallback((tenantId: string) => {
    setSelectedTenantId(tenantId);
    setSelectedBranchId('all');
  }, []);

  // Level 1: Platform default toggle
  const togglePlatformDefault = useCallback((moduleId: string) => {
    setPlatformStates((prev) =>
      prev.map((s) => (s.moduleId === moduleId ? { ...s, platformDefault: !s.platformDefault } : s))
    );
    showNotification('Platform default killswitch updated.', 'info');
  }, [showNotification]);

  // Level 2: Plan entitlement toggle
  const togglePlanEntitlement = useCallback(
    (moduleId: string, planTier: 'Starter' | 'Professional' | 'Enterprise') => {
      setPlatformStates((prev) =>
        prev.map((s) => {
          if (s.moduleId !== moduleId) return s;
          if (planTier === 'Starter') return { ...s, starterPlanAllowed: !s.starterPlanAllowed };
          if (planTier === 'Professional') return { ...s, professionalPlanAllowed: !s.professionalPlanAllowed };
          if (planTier === 'Enterprise') return { ...s, enterprisePlanAllowed: !s.enterprisePlanAllowed };
          return s;
        })
      );
      showNotification(`Plan entitlement for ${planTier} tier updated.`, 'info');
    },
    [showNotification]
  );

  // Level 3: Save custom tenant/branch override
  const saveOverride = useCallback(
    (override: Omit<TenantModuleOverride, 'id' | 'updatedAt' | 'updatedBy'>) => {
      const newOverride: TenantModuleOverride = {
        ...override,
        id: `ovr_${Date.now()}`,
        updatedAt: new Date().toISOString(),
        updatedBy: 'superadmin@edulibra.com',
      };

      setOverrides((prev) => {
        const filtered = prev.filter(
          (o) =>
            !(
              o.tenantId === override.tenantId &&
              (o.branchId ?? '') === (override.branchId ?? '') &&
              o.moduleId === override.moduleId
            )
        );
        return [newOverride, ...filtered];
      });

      setIsOverrideModalOpen(false);
      showNotification(`Custom override saved for ${override.moduleName}.`, 'success');
    },
    [showNotification]
  );

  // Remove custom override
  const removeOverride = useCallback(
    (overrideId: string) => {
      setOverrides((prev) => prev.filter((o) => o.id !== overrideId));
      showNotification('Custom override removed. Default governance restored.', 'info');
    },
    [showNotification]
  );

  // Direct 1-click toggle for currently selected library account
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

      const nextStatus: 'Force_Enabled' | 'Force_Disabled' = currentEffective.effectiveAllowed
        ? 'Force_Disabled'
        : 'Force_Enabled';

      const branchTargetId = selectedBranchId !== 'all' ? selectedBranchId : undefined;
      const branchTargetName = selectedBranch?.name;

      const newOverride: TenantModuleOverride = {
        id: `ovr_${Date.now()}`,
        tenantId: selectedTenant.id,
        tenantName: selectedTenant.name,
        branchId: branchTargetId,
        branchName: branchTargetName,
        moduleId,
        moduleName: mod.name,
        overrideStatus: nextStatus,
        reason: `SuperAdmin 1-click ${nextStatus === 'Force_Enabled' ? 'activation' : 'deactivation'}`,
        updatedAt: new Date().toISOString(),
        updatedBy: 'superadmin@edulibra.com',
      };

      setOverrides((prev) => {
        const filtered = prev.filter(
          (o) =>
            !(
              o.tenantId === selectedTenant.id &&
              (o.branchId ?? '') === (branchTargetId ?? '') &&
              o.moduleId === moduleId
            )
        );
        return [newOverride, ...filtered];
      });

      showNotification(
        `${mod.name} is now ${nextStatus === 'Force_Enabled' ? 'Enabled' : 'Disabled'} for ${selectedTenant.name}.`,
        'success'
      );
    },
    [selectedTenantId, selectedTenant, selectedBranchId, selectedBranch, platformStates, overrides, togglePlatformDefault, showNotification]
  );

  // Reset module to plan default (remove override)
  const resetModuleOverride = useCallback(
    (moduleId: string) => {
      if (selectedTenantId === 'global' || !selectedTenant) return;

      const branchTargetId = selectedBranchId !== 'all' ? selectedBranchId : undefined;
      setOverrides((prev) =>
        prev.filter(
          (o) =>
            !(
              o.tenantId === selectedTenant.id &&
              (o.branchId ?? '') === (branchTargetId ?? '') &&
              o.moduleId === moduleId
            )
        )
      );

      const mod = ALL_16_LIBRARY_MODULES.find((m) => m.id === moduleId);
      showNotification(`${mod?.name ?? 'Module'} reset to plan defaults.`, 'info');
    },
    [selectedTenantId, selectedTenant, selectedBranchId, showNotification]
  );

  // Bulk actions for currently selected scope
  const enableAllForCurrentScope = useCallback(() => {
    if (selectedTenantId === 'global' || !selectedTenant) return;

    const branchTargetId = selectedBranchId !== 'all' ? selectedBranchId : undefined;
    const branchTargetName = selectedBranch?.name;

    const newOverrides: TenantModuleOverride[] = ALL_16_LIBRARY_MODULES.map((mod) => ({
      id: `ovr_bulk_${mod.id}_${Date.now()}`,
      tenantId: selectedTenant.id,
      tenantName: selectedTenant.name,
      branchId: branchTargetId,
      branchName: branchTargetName,
      moduleId: mod.id,
      moduleName: mod.name,
      overrideStatus: 'Force_Enabled',
      reason: 'Bulk enabled all modules by SuperAdmin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'superadmin@edulibra.com',
    }));

    setOverrides((prev) => {
      const otherTenantOverrides = prev.filter(
        (o) =>
          !(
            o.tenantId === selectedTenant.id &&
            (o.branchId ?? '') === (branchTargetId ?? '')
          )
      );
      return [...newOverrides, ...otherTenantOverrides];
    });

    showNotification(`All 16 modules force-enabled for ${selectedTenant.name}.`, 'success');
  }, [selectedTenantId, selectedTenant, selectedBranchId, selectedBranch, showNotification]);

  const disableAllForCurrentScope = useCallback(() => {
    if (selectedTenantId === 'global' || !selectedTenant) return;

    const branchTargetId = selectedBranchId !== 'all' ? selectedBranchId : undefined;
    const branchTargetName = selectedBranch?.name;

    const newOverrides: TenantModuleOverride[] = ALL_16_LIBRARY_MODULES.map((mod) => ({
      id: `ovr_bulk_${mod.id}_${Date.now()}`,
      tenantId: selectedTenant.id,
      tenantName: selectedTenant.name,
      branchId: branchTargetId,
      branchName: branchTargetName,
      moduleId: mod.id,
      moduleName: mod.name,
      overrideStatus: 'Force_Disabled',
      reason: 'Bulk disabled all modules by SuperAdmin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'superadmin@edulibra.com',
    }));

    setOverrides((prev) => {
      const otherTenantOverrides = prev.filter(
        (o) =>
          !(
            o.tenantId === selectedTenant.id &&
            (o.branchId ?? '') === (branchTargetId ?? '')
          )
      );
      return [...newOverrides, ...otherTenantOverrides];
    });

    showNotification(`All 16 modules force-disabled for ${selectedTenant.name}.`, 'info');
  }, [selectedTenantId, selectedTenant, selectedBranchId, selectedBranch, showNotification]);

  const resetAllForCurrentScope = useCallback(() => {
    if (selectedTenantId === 'global' || !selectedTenant) return;

    const branchTargetId = selectedBranchId !== 'all' ? selectedBranchId : undefined;
    setOverrides((prev) =>
      prev.filter(
        (o) =>
          !(
            o.tenantId === selectedTenant.id &&
            (o.branchId ?? '') === (branchTargetId ?? '')
          )
      )
    );

    showNotification(`All module overrides cleared for ${selectedTenant.name}. Restored to plan defaults.`, 'info');
  }, [selectedTenantId, selectedTenant, selectedBranchId, showNotification]);

  // Open override modal for specific module
  const openOverrideModalForModule = useCallback((mod: ModuleDefinition) => {
    setTargetModule(mod);
    setIsOverrideModalOpen(true);
  }, []);

  // Open API Guard modal
  const openApiGuardModalForModule = useCallback((mod: ModuleDefinition) => {
    setTargetModule(mod);
    setIsApiGuardModalOpen(true);
  }, []);

  // Computed module list with effective access
  const computedModules = useMemo(() => {
    return ALL_16_LIBRARY_MODULES.map((mod) => {
      const effective: EffectiveAccessResult = computeEffectiveAccess({
        moduleId: mod.id,
        platformStates,
        tenantPlanTier: selectedTenant?.planTier,
        tenantId: selectedTenant?.id,
        branchId: selectedBranch?.id,
        overrides,
      });

      const state = platformStates.find((s) => s.moduleId === mod.id);

      return {
        module: mod,
        state: state ?? {
          moduleId: mod.id,
          platformDefault: true,
          starterPlanAllowed: true,
          professionalPlanAllowed: true,
          enterprisePlanAllowed: true,
        },
        effective,
      };
    });
  }, [platformStates, selectedTenant, selectedBranch, overrides]);

  // Filtered modules by category and search
  const filteredModules = useMemo(() => {
    return computedModules.filter(({ module: mod }) => {
      const matchesCategory = categoryFilter === 'all' || mod.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        mod.name.toLowerCase().includes(q) ||
        mod.key.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [computedModules, categoryFilter, searchQuery]);

  return {
    platformStates,
    overrides,
    selectedTenantId,
    selectedBranchId,
    selectedTenant,
    selectedBranch,
    categoryFilter,
    searchQuery,
    notification,
    isOverrideModalOpen,
    isApiGuardModalOpen,
    targetModule,
    computedModules,
    filteredModules,
    tenantsList: MOCK_TENANTS_LIST,
    setSelectedTenantId: handleTenantChange,
    setSelectedBranchId,
    setCategoryFilter,
    setSearchQuery,
    togglePlatformDefault,
    togglePlanEntitlement,
    toggleLibraryModule,
    resetModuleOverride,
    enableAllForCurrentScope,
    disableAllForCurrentScope,
    resetAllForCurrentScope,
    saveOverride,
    removeOverride,
    openOverrideModalForModule,
    openApiGuardModalForModule,
    closeOverrideModal: () => setIsOverrideModalOpen(false),
    closeApiGuardModal: () => setIsApiGuardModalOpen(false),
  };
}
