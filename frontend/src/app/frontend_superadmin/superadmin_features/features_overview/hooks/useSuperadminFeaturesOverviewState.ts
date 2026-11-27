// RESPONSIBILITY: Comprehensive state orchestration for SuperAdmin Feature & Module Governance.
import { useState, useMemo, useCallback } from 'react';
import type {
  PlatformModuleState,
  ModuleDefinition,
  EffectiveAccessResult,
  TenantModuleOverride,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { ALL_16_LIBRARY_MODULES } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';
import {
  INITIAL_PLATFORM_MODULE_STATES,
  MOCK_TENANTS_LIST,
  type MockTenantOption,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';
import { computeEffectiveAccess } from '@/app/frontend_superadmin/superadmin_features/features_overview/utils/superadmin_features_overview_utils';
import { useSuperadminFeaturesOverrides } from '@/app/frontend_superadmin/superadmin_features/features_overview/hooks/useSuperadminFeaturesOverrides';

export function useSuperadminFeaturesOverviewState() {
  const [platformStates, setPlatformStates] = useState<PlatformModuleState[]>(INITIAL_PLATFORM_MODULE_STATES);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('global');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [targetModule, setTargetModule] = useState<ModuleDefinition | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const selectedTenant: MockTenantOption | undefined = useMemo(
    () => MOCK_TENANTS_LIST.find((t) => t.id === selectedTenantId),
    [selectedTenantId]
  );

  const selectedBranch = useMemo(
    () => (!selectedTenant || selectedBranchId === 'all' ? undefined : selectedTenant.branches.find((b) => b.id === selectedBranchId)),
    [selectedTenant, selectedBranchId]
  );

  const togglePlatformDefault = useCallback((moduleId: string) => {
    setPlatformStates((prev) => prev.map((s) => (s.moduleId === moduleId ? { ...s, platformDefault: !s.platformDefault } : s)));
    showNotification('Platform default killswitch updated.', 'info');
  }, [showNotification]);

  const togglePlanEntitlement = useCallback((moduleId: string, planTier: 'Starter' | 'Professional' | 'Enterprise') => {
    setPlatformStates((prev) => prev.map((s) => {
      if (s.moduleId !== moduleId) return s;
      if (planTier === 'Starter') return { ...s, starterPlanAllowed: !s.starterPlanAllowed };
      if (planTier === 'Professional') return { ...s, professionalPlanAllowed: !s.professionalPlanAllowed };
      return { ...s, enterprisePlanAllowed: !s.enterprisePlanAllowed };
    }));
    showNotification(`Plan entitlement for ${planTier} tier updated.`, 'info');
  }, [showNotification]);

  const overridesHook = useSuperadminFeaturesOverrides({
    platformStates,
    selectedTenant,
    selectedTenantId,
    selectedBranch,
    selectedBranchId,
    togglePlatformDefault,
    showNotification,
  });

  const computedModules = useMemo(() => {
    return ALL_16_LIBRARY_MODULES.map((mod) => {
      const effective: EffectiveAccessResult = computeEffectiveAccess({
        moduleId: mod.id,
        platformStates,
        tenantPlanTier: selectedTenant?.planTier,
        tenantId: selectedTenant?.id,
        branchId: selectedBranch?.id,
        overrides: overridesHook.overrides,
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
  }, [platformStates, selectedTenant, selectedBranch, overridesHook.overrides]);

  const filteredModules = useMemo(() => {
    return computedModules.filter(({ module: mod }) => {
      const matchesCategory = categoryFilter === 'all' || mod.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      return (
        matchesCategory &&
        (!q || mod.name.toLowerCase().includes(q) || mod.key.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q))
      );
    });
  }, [computedModules, categoryFilter, searchQuery]);

  return {
    platformStates,
    overrides: overridesHook.overrides,
    selectedTenantId,
    selectedBranchId,
    selectedTenant,
    selectedBranch,
    categoryFilter,
    searchQuery,
    notification,
    isOverrideModalOpen,
    targetModule,
    computedModules,
    filteredModules,
    tenantsList: MOCK_TENANTS_LIST,
    setSelectedTenantId: useCallback((tId: string) => {
      setSelectedTenantId(tId);
      setSelectedBranchId('all');
    }, []),
    setSelectedBranchId,
    setCategoryFilter,
    setSearchQuery,
    togglePlatformDefault,
    togglePlanEntitlement,
    toggleLibraryModule: overridesHook.toggleLibraryModule,
    resetModuleOverride: overridesHook.resetModuleOverride,
    enableAllForCurrentScope: overridesHook.enableAllForCurrentScope,
    disableAllForCurrentScope: overridesHook.disableAllForCurrentScope,
    resetAllForCurrentScope: overridesHook.resetAllForCurrentScope,
    saveOverride: useCallback((ovr: Omit<TenantModuleOverride, 'id' | 'updatedAt' | 'updatedBy'>) => {
      overridesHook.saveOverride(ovr);
      setIsOverrideModalOpen(false);
    }, [overridesHook]),
    removeOverride: overridesHook.removeOverride,
    openOverrideModalForModule: (mod: ModuleDefinition) => { setTargetModule(mod); setIsOverrideModalOpen(true); },
    closeOverrideModal: () => setIsOverrideModalOpen(false),
  };
}
