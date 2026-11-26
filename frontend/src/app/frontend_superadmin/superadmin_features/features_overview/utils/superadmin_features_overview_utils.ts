// RESPONSIBILITY: Pure computation functions for 3-level feature resolution and API Guard simulation.
import type {
  PlatformModuleState,
  TenantModuleOverride,
  EffectiveAccessResult,
  PlanTier,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { ALL_16_LIBRARY_MODULES } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';

export {
  simulateApiGuardEvaluation,
  batchSimulateAllEndpoints,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/utils/superadmin_features_overview_simulation_utils';

export function isPlanEntitled(state: PlatformModuleState, tier: PlanTier): boolean {
  if (tier === 'Starter') return state.starterPlanAllowed;
  if (tier === 'Professional') return state.professionalPlanAllowed;
  if (tier === 'Enterprise') return state.enterprisePlanAllowed;
  return false;
}

export interface ResolveEffectiveAccessParams {
  moduleId: string;
  platformStates: PlatformModuleState[];
  tenantPlanTier?: PlanTier;
  tenantId?: string;
  branchId?: string;
  overrides: TenantModuleOverride[];
}

export function computeEffectiveAccess(params: ResolveEffectiveAccessParams): EffectiveAccessResult {
  const { moduleId, platformStates, tenantPlanTier, tenantId, branchId, overrides } = params;
  const moduleDef = ALL_16_LIBRARY_MODULES.find((m) => m.id === moduleId);
  const state = platformStates.find((s) => s.moduleId === moduleId) ?? {
    moduleId,
    platformDefault: true,
    starterPlanAllowed: true,
    professionalPlanAllowed: true,
    enterprisePlanAllowed: true,
  };

  const moduleName = moduleDef?.name ?? moduleId;
  const isPlatformAllowed = state.platformDefault;

  // Level 1: Platform Killswitch overrides everything
  if (!isPlatformAllowed) {
    return {
      moduleId,
      moduleName,
      isPlatformAllowed: false,
      isPlanAllowed: false,
      override: null,
      effectiveAllowed: false,
      reason: 'Globally disabled across platform by SuperAdmin (Platform Default = OFF).',
    };
  }

  // If no tenant context is selected (Global Platform scope)
  if (!tenantPlanTier || !tenantId || tenantId === 'global') {
    return {
      moduleId,
      moduleName,
      isPlatformAllowed: true,
      isPlanAllowed: true,
      override: null,
      effectiveAllowed: true,
      reason: 'Active system-wide under Platform Default configuration.',
    };
  }

  // Level 2: Plan Entitlement
  const isPlanAllowed = isPlanEntitled(state, tenantPlanTier);

  // Level 3: Tenant & Branch Overrides (Branch override takes precedence over tenant-wide override)
  const branchOverride = branchId && branchId !== 'all'
    ? overrides.find((o) => o.tenantId === tenantId && o.branchId === branchId && o.moduleId === moduleId)
    : null;
  const tenantOverride = overrides.find(
    (o) => o.tenantId === tenantId && !o.branchId && o.moduleId === moduleId
  );
  const activeOverride = branchOverride || tenantOverride || null;

  if (activeOverride) {
    const isOverrideEnabled = activeOverride.overrideStatus === 'Force_Enabled';
    return {
      moduleId,
      moduleName,
      isPlatformAllowed: true,
      isPlanAllowed,
      override: activeOverride,
      effectiveAllowed: isOverrideEnabled,
      reason: isOverrideEnabled
        ? `Custom Override: Force-Enabled (${activeOverride.reason})`
        : `Custom Override: Force-Disabled (${activeOverride.reason})`,
    };
  }

  return {
    moduleId,
    moduleName,
    isPlatformAllowed: true,
    isPlanAllowed,
    override: null,
    effectiveAllowed: isPlanAllowed,
    reason: isPlanAllowed
      ? `Included in ${tenantPlanTier} subscription tier.`
      : `Not entitled under ${tenantPlanTier} tier. Upgrade or add custom override.`,
  };
}
