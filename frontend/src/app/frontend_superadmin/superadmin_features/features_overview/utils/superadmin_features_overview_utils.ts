// RESPONSIBILITY: Pure computation functions for 3-level feature resolution and API Guard simulation.
import type {
  PlatformModuleState,
  TenantModuleOverride,
  EffectiveAccessResult,
  PlanTier,
  ApiDenialSimulationResult,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';
import { ALL_16_LIBRARY_MODULES } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';

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

export function simulateApiGuardEvaluation(
  endpoint: string,
  effectiveResult: EffectiveAccessResult,
  tenantName: string,
  options?: { tenantId?: string; branchId?: string; method?: string }
): ApiDenialSimulationResult {
  const allowed = effectiveResult.effectiveAllowed;
  const status = allowed ? 200 : 403;
  const method = options?.method ?? 'POST';
  const tenantId = options?.tenantId ?? 'tenant_active';
  const branchId = options?.branchId ?? 'main_branch';
  const latencyMs = allowed ? Math.floor(Math.random() * 20 + 25) : Math.floor(Math.random() * 8 + 8);

  const requestHeaders: Record<string, string> = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json',
    'X-Tenant-Id': tenantId,
    'X-Branch-Id': branchId,
    'X-Requested-With': 'PlatformFeatureGuardMiddleware',
  };

  const curlCommand = `curl -X ${method} "https://api.edulibra.com${endpoint}" \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "X-Tenant-Id: ${tenantId}" \\
  -H "X-Branch-Id: ${branchId}" \\
  -H "Content-Type: application/json"`;

  const hierarchyTrace = {
    level1_platformDefault: effectiveResult.isPlatformAllowed ? 'PASS (Enabled platform-wide)' : 'KILLSWITCH (Globally disabled)',
    level2_planEntitlement: effectiveResult.isPlanAllowed ? 'PASS (Entitled in tier)' : 'DENIED (Not in subscription tier)',
    level3_accountOverride: effectiveResult.override
      ? `${effectiveResult.override.overrideStatus.toUpperCase()} (${effectiveResult.override.reason})`
      : 'NONE (Default tier rules apply)',
    finalVerdict: allowed ? 'HTTP 200 ALLOWED' : 'HTTP 403 FORBIDDEN (FEATURE_DISABLED)',
  };

  const responsePayload = allowed
    ? {
        success: true,
        statusCode: 200,
        message: `Authorized. Endpoint [${endpoint}] executed successfully.`,
        module: effectiveResult.moduleName,
        tenant: tenantName,
        accessPath: effectiveResult.reason,
        hierarchyTrace,
        enforcementLayer: 'PlatformFeatureGuardMiddleware',
        timestamp: new Date().toISOString(),
      }
    : {
        success: false,
        statusCode: 403,
        errorCode: 'FEATURE_DISABLED',
        error: 'Access Denied by Platform Governance Policy',
        message: `Module "${effectiveResult.moduleName}" is disabled for "${tenantName}". Backend API refuses execution of ${endpoint}.`,
        policyViolation: effectiveResult.reason,
        hierarchyTrace,
        enforcementLayer: 'PlatformFeatureGuardMiddleware',
        timestamp: new Date().toISOString(),
      };

  return {
    endpoint,
    method,
    allowed,
    httpStatus: status,
    latencyMs,
    curlCommand,
    requestHeaders,
    responsePayload,
    evaluatedHierarchy: {
      platformDefault: effectiveResult.isPlatformAllowed,
      planEntitled: effectiveResult.isPlanAllowed,
      tenantOverride: effectiveResult.override ? effectiveResult.override.overrideStatus : 'None',
    },
  };
}

export function batchSimulateAllEndpoints(
  modulesWithEffective: Array<{ module: typeof ALL_16_LIBRARY_MODULES[0]; effective: EffectiveAccessResult }>,
  tenantName: string,
  tenantId?: string
) {
  const results = modulesWithEffective.map(({ module: mod, effective }) => {
    const primaryEndpoint = mod.apiEndpoints[0] ?? '/api/v1';
    return simulateApiGuardEvaluation(primaryEndpoint, effective, tenantName, { tenantId });
  });

  const allowedCount = results.filter((r) => r.allowed).length;
  const deniedCount = results.length - allowedCount;

  return {
    total: results.length,
    allowedCount,
    deniedCount,
    results,
  };
}
