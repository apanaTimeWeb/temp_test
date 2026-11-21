// RESPONSIBILITY: Unit tests for 3-level governance resolution logic and SuperAdmin library controls.
import { describe, it, expect } from 'vitest';
import {
  computeEffectiveAccess,
  isPlanEntitled,
  simulateApiGuardEvaluation,
  batchSimulateAllEndpoints,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/utils/superadmin_features_overview_utils';
import { ALL_16_LIBRARY_MODULES } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';
import {
  INITIAL_PLATFORM_MODULE_STATES,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/mocks/fixtures/superadmin_features_overview.fixtures';
import type {
  PlatformModuleState,
  TenantModuleOverride,
} from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';

describe('Superadmin Features Overview - 3-Level Governance Resolution', () => {
  const baseStates: PlatformModuleState[] = [
    {
      moduleId: 'mod_whatsapp',
      platformDefault: true,
      starterPlanAllowed: false,
      professionalPlanAllowed: true,
      enterprisePlanAllowed: true,
    },
    {
      moduleId: 'mod_books',
      platformDefault: true,
      starterPlanAllowed: true,
      professionalPlanAllowed: true,
      enterprisePlanAllowed: true,
    },
    {
      moduleId: 'mod_analytics',
      platformDefault: false, // Globally killed across platform
      starterPlanAllowed: true,
      professionalPlanAllowed: true,
      enterprisePlanAllowed: true,
    },
    {
      moduleId: 'mod_api_access',
      platformDefault: true,
      starterPlanAllowed: false,
      professionalPlanAllowed: false,
      enterprisePlanAllowed: true,
    },
  ];

  it('Level 1: Platform Killswitch disables module regardless of plan or overrides', () => {
    const overrides: TenantModuleOverride[] = [
      {
        id: 'ovr_test',
        tenantId: 'tenant_enterprise',
        tenantName: 'Enterprise Tenant',
        moduleId: 'mod_analytics',
        moduleName: 'Advanced Analytics',
        overrideStatus: 'Force_Enabled',
        reason: 'VIP grant',
        updatedAt: '2026-11-20T00:00:00Z',
        updatedBy: 'admin',
      },
    ];

    const result = computeEffectiveAccess({
      moduleId: 'mod_analytics',
      platformStates: baseStates,
      tenantPlanTier: 'Enterprise',
      tenantId: 'tenant_enterprise',
      overrides,
    });

    expect(result.effectiveAllowed).toBe(false);
    expect(result.isPlatformAllowed).toBe(false);
    expect(result.reason).toContain('Globally disabled across platform');
  });

  it('Level 2: Plan Entitlement correctly permits or denies based on tier', () => {
    // WhatsApp on Starter tier without override -> should be false
    const starterResult = computeEffectiveAccess({
      moduleId: 'mod_whatsapp',
      platformStates: baseStates,
      tenantPlanTier: 'Starter',
      tenantId: 'tenant_starter',
      overrides: [],
    });
    expect(starterResult.effectiveAllowed).toBe(false);
    expect(starterResult.isPlanAllowed).toBe(false);

    // WhatsApp on Professional tier -> should be true
    const proResult = computeEffectiveAccess({
      moduleId: 'mod_whatsapp',
      platformStates: baseStates,
      tenantPlanTier: 'Professional',
      tenantId: 'tenant_pro',
      overrides: [],
    });
    expect(proResult.effectiveAllowed).toBe(true);
    expect(proResult.isPlanAllowed).toBe(true);
  });

  it('Level 3: Custom Tenant Override can force enable a feature not in plan', () => {
    const overrides: TenantModuleOverride[] = [
      {
        id: 'ovr_wa_starter',
        tenantId: 'tenant_starter',
        tenantName: 'Starter Tenant',
        moduleId: 'mod_whatsapp',
        moduleName: 'WhatsApp Integration',
        overrideStatus: 'Force_Enabled',
        reason: 'Diwali 30-day promotional trial',
        updatedAt: '2026-11-20T00:00:00Z',
        updatedBy: 'superadmin',
      },
    ];

    const result = computeEffectiveAccess({
      moduleId: 'mod_whatsapp',
      platformStates: baseStates,
      tenantPlanTier: 'Starter',
      tenantId: 'tenant_starter',
      overrides,
    });

    expect(result.effectiveAllowed).toBe(true);
    expect(result.override).not.toBeNull();
    expect(result.override?.overrideStatus).toBe('Force_Enabled');
    expect(result.reason).toContain('Custom Override: Force-Enabled');
  });

  it('Level 3: Branch-specific override takes precedence over tenant-wide override', () => {
    const overrides: TenantModuleOverride[] = [
      {
        id: 'ovr_tenant_wide',
        tenantId: 'tenant_apex',
        tenantName: 'Apex Group',
        moduleId: 'mod_books',
        moduleName: 'Books',
        overrideStatus: 'Force_Enabled',
        reason: 'Tenant wide grant',
        updatedAt: '2026-11-20T00:00:00Z',
        updatedBy: 'admin',
      },
      {
        id: 'ovr_branch_specific',
        tenantId: 'tenant_apex',
        tenantName: 'Apex Group',
        branchId: 'br_suspended_branch',
        branchName: 'Suspended Branch',
        moduleId: 'mod_books',
        moduleName: 'Books',
        overrideStatus: 'Force_Disabled',
        reason: 'Branch audit pending',
        updatedAt: '2026-11-20T00:00:00Z',
        updatedBy: 'admin',
      },
    ];

    // Query for branch 'br_suspended_branch'
    const branchResult = computeEffectiveAccess({
      moduleId: 'mod_books',
      platformStates: baseStates,
      tenantPlanTier: 'Professional',
      tenantId: 'tenant_apex',
      branchId: 'br_suspended_branch',
      overrides,
    });

    expect(branchResult.effectiveAllowed).toBe(false);
    expect(branchResult.override?.overrideStatus).toBe('Force_Disabled');
    expect(branchResult.reason).toContain('Branch audit pending');

    // Query without branch (tenant-wide)
    const tenantResult = computeEffectiveAccess({
      moduleId: 'mod_books',
      platformStates: baseStates,
      tenantPlanTier: 'Professional',
      tenantId: 'tenant_apex',
      overrides,
    });

    expect(tenantResult.effectiveAllowed).toBe(true);
    expect(tenantResult.override?.overrideStatus).toBe('Force_Enabled');
  });

  it('Evaluates all 16 modules correctly for Enterprise tier vs Starter tier', () => {
    const enterpriseModules = ALL_16_LIBRARY_MODULES.map((mod) =>
      computeEffectiveAccess({
        moduleId: mod.id,
        platformStates: INITIAL_PLATFORM_MODULE_STATES,
        tenantPlanTier: 'Enterprise',
        tenantId: 'tenant_enterprise',
        overrides: [],
      })
    );

    // In Enterprise tier with default settings, all 16 are entitled
    const allowedEnterprise = enterpriseModules.filter((m) => m.effectiveAllowed);
    expect(allowedEnterprise.length).toBe(16);

    // In Starter tier, advanced modules (accounts, staff, analytics, whatsapp, api_access) are excluded by default
    const starterModules = ALL_16_LIBRARY_MODULES.map((mod) =>
      computeEffectiveAccess({
        moduleId: mod.id,
        platformStates: INITIAL_PLATFORM_MODULE_STATES,
        tenantPlanTier: 'Starter',
        tenantId: 'tenant_starter',
        overrides: [],
      })
    );
    const deniedStarter = starterModules.filter((m) => !m.effectiveAllowed);
    expect(deniedStarter.length).toBeGreaterThanOrEqual(5);
  });

  it('Performs batch simulation of all 16 endpoints for API Guard', () => {
    const modulesWithEffective = ALL_16_LIBRARY_MODULES.map((mod) => ({
      module: mod,
      effective: computeEffectiveAccess({
        moduleId: mod.id,
        platformStates: INITIAL_PLATFORM_MODULE_STATES,
        tenantPlanTier: 'Starter',
        tenantId: 'tenant_patna',
        overrides: [],
      }),
    }));

    const batch = batchSimulateAllEndpoints(modulesWithEffective, 'Patna Central Reading Rooms', 'tenant_patna');
    expect(batch.total).toBe(16);
    expect(batch.allowedCount + batch.deniedCount).toBe(16);
    expect(batch.results.length).toBe(16);
    for (const r of batch.results) {
      expect([200, 403]).toContain(r.httpStatus);
      expect(r.curlCommand).toContain('curl -X POST');
    }
  });
});
