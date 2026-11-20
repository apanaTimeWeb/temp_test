// RESPONSIBILITY: Verify all 16 library modules are defined with complete contract properties.
import { describe, it, expect } from 'vitest';
import { ALL_16_LIBRARY_MODULES } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';

describe('Superadmin Features Overview - 16 Library Modules Registry', () => {
  it('should contain exactly 16 modules as per specification', () => {
    expect(ALL_16_LIBRARY_MODULES).toHaveLength(16);
  });

  it('should verify all required module keys are present', () => {
    const keys = ALL_16_LIBRARY_MODULES.map((m) => m.key);
    const requiredKeys = [
      'dashboard',
      'books',
      'members',
      'seats',
      'issue_return',
      'finance',
      'accounts',
      'communication',
      'staff_management',
      'reports',
      'export_import',
      'advanced_analytics',
      'whatsapp_integration',
      'sms_integration',
      'barcode_qr',
      'api_access',
    ];

    for (const key of requiredKeys) {
      expect(keys).toContain(key);
    }
  });

  it('should verify each module has non-empty name, description, and API endpoints', () => {
    for (const mod of ALL_16_LIBRARY_MODULES) {
      expect(mod.id).toBeTruthy();
      expect(mod.name.length).toBeGreaterThan(3);
      expect(mod.description.length).toBeGreaterThan(10);
      expect(mod.apiEndpoints.length).toBeGreaterThan(0);
      for (const endpoint of mod.apiEndpoints) {
        expect(endpoint.startsWith('/api/v1/')).toBe(true);
      }
    }
  });

  it('should verify all modules have valid category and minimum plan tier', () => {
    const validCategories = ['core', 'operations', 'finance', 'engagement', 'developer'];
    const validTiers = ['Starter', 'Professional', 'Enterprise'];

    for (const mod of ALL_16_LIBRARY_MODULES) {
      expect(validCategories).toContain(mod.category);
      expect(validTiers).toContain(mod.minPlanTier);
    }
  });
});
