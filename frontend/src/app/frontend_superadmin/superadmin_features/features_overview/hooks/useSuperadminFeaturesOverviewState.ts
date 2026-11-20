// RESPONSIBILITY: Comprehensive state orchestration for SuperAdmin Feature & Module Governance.
import { useState, useMemo, useCallback } from 'react';
import type {
  PlatformModuleState,
  TenantModuleOverride,
  FeatureCategory,
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

  // Filtered by search and category
  const filteredModules = useMemo(() => {
    return computedModules.filter(({ module: mod }) => {
      const matchesCategory = categoryFilter === 'all' || mod.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        mod.name.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q) ||
        mod.category.toLowerCase().includes(q) ||
        mod.apiEndpoints.some((ep) => ep.toLowerCase().includes(q));

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
    saveOverride,
    removeOverride,
    openOverrideModalForModule,
    openApiGuardModalForModule,
    closeOverrideModal: () => setIsOverrideModalOpen(false),
    closeApiGuardModal: () => setIsApiGuardModalOpen(false),
  };
}
