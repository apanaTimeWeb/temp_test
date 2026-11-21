// RESPONSIBILITY: Type contracts for SuperAdmin Feature & Module Control.

export type FeatureCategory = 'core' | 'operations' | 'finance' | 'engagement' | 'developer';
export type GovernanceLevel = 'platform_default' | 'plan_entitlement' | 'account_override' | 'branch_override';
export type PlanTier = 'Starter' | 'Professional' | 'Enterprise';

export interface ModuleDefinition {
  id: string;
  key: string;
  name: string;
  description: string;
  category: FeatureCategory;
  iconName: string;
  minPlanTier: PlanTier;
  apiEndpoints: string[];
}

export interface PlatformModuleState {
  moduleId: string;
  platformDefault: boolean; // Level 1: Global platform switch
  starterPlanAllowed: boolean; // Level 2: Plan entitlements
  professionalPlanAllowed: boolean;
  enterprisePlanAllowed: boolean;
}

export interface TenantModuleOverride {
  id: string;
  tenantId: string;
  tenantName: string;
  branchId?: string; // Optional: branch-specific override
  branchName?: string;
  moduleId: string;
  moduleName: string;
  overrideStatus: 'Force_Enabled' | 'Force_Disabled';
  reason: string;
  updatedAt: string;
  updatedBy: string;
  expiresAt?: string; // Optional custom trial override expiry
}

export interface EffectiveAccessResult {
  moduleId: string;
  moduleName: string;
  isPlatformAllowed: boolean;
  isPlanAllowed: boolean;
  override: TenantModuleOverride | null;
  effectiveAllowed: boolean;
  reason: string;
}

export interface ApiDenialSimulationResult {
  endpoint: string;
  method?: string;
  allowed: boolean;
  httpStatus: number;
  latencyMs?: number;
  curlCommand?: string;
  requestHeaders?: Record<string, string>;
  responsePayload: Record<string, unknown>;
  evaluatedHierarchy: {
    platformDefault: boolean;
    planEntitled: boolean;
    tenantOverride: 'Force_Enabled' | 'Force_Disabled' | 'None';
  };
}
