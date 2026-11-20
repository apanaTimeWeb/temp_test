// RESPONSIBILITY: Contract tests for Backend API Denial Enforcement (HTTP 403 FEATURE_DISABLED).
import { describe, it, expect } from 'vitest';
import { simulateApiGuardEvaluation } from '@/app/frontend_superadmin/superadmin_features/features_overview/utils/superadmin_features_overview_utils';
import type { EffectiveAccessResult } from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';

describe('Superadmin Features Overview - API Denial Enforcement Contract', () => {
  it('should return HTTP 403 Forbidden and FEATURE_DISABLED error code when access is denied', () => {
    const deniedEffective: EffectiveAccessResult = {
      moduleId: 'mod_analytics',
      moduleName: 'Advanced Analytics & AI',
      isPlatformAllowed: true,
      isPlanAllowed: false,
      override: null,
      effectiveAllowed: false,
      reason: 'Not entitled under Starter tier. Upgrade or add custom override.',
    };

    const result = simulateApiGuardEvaluation(
      '/api/v1/library/analytics/heatmaps',
      deniedEffective,
      'Patna Central Reading Rooms'
    );

    expect(result.allowed).toBe(false);
    expect(result.httpStatus).toBe(403);
    expect(result.responsePayload.success).toBe(false);
    expect(result.responsePayload.errorCode).toBe('FEATURE_DISABLED');
    expect(result.responsePayload.error).toBe('Access Denied by Platform Governance Policy');
    expect(result.responsePayload.message).toContain('is disabled for "Patna Central Reading Rooms"');
    expect(result.responsePayload.message).toContain('/api/v1/library/analytics/heatmaps');
  });

  it('should return HTTP 200 OK with success payload when access is allowed', () => {
    const allowedEffective: EffectiveAccessResult = {
      moduleId: 'mod_books',
      moduleName: 'Books & Catalogue',
      isPlatformAllowed: true,
      isPlanAllowed: true,
      override: null,
      effectiveAllowed: true,
      reason: 'Included in Starter subscription tier.',
    };

    const result = simulateApiGuardEvaluation(
      '/api/v1/library/books/search',
      allowedEffective,
      'Apex Study Library Group'
    );

    expect(result.allowed).toBe(true);
    expect(result.httpStatus).toBe(200);
    expect(result.responsePayload.success).toBe(true);
    expect(result.responsePayload.message).toContain('Authorized. Endpoint [/api/v1/library/books/search] executed successfully');
  });

  it('should include evaluated hierarchy flags in simulation result', () => {
    const effective: EffectiveAccessResult = {
      moduleId: 'mod_whatsapp',
      moduleName: 'WhatsApp Integration',
      isPlatformAllowed: true,
      isPlanAllowed: false,
      override: {
        id: 'ovr_1',
        tenantId: 'tenant_1',
        tenantName: 'Tenant 1',
        moduleId: 'mod_whatsapp',
        moduleName: 'WhatsApp',
        overrideStatus: 'Force_Enabled',
        reason: 'Trial',
        updatedAt: '2026-11-20T00:00:00Z',
        updatedBy: 'admin',
      },
      effectiveAllowed: true,
      reason: 'Custom Override: Force-Enabled (Trial)',
    };

    const result = simulateApiGuardEvaluation(
      '/api/v1/library/integrations/whatsapp/send',
      effective,
      'Tenant 1'
    );

    expect(result.evaluatedHierarchy).toEqual({
      platformDefault: true,
      planEntitled: false,
      tenantOverride: 'Force_Enabled',
    });
  });
});
