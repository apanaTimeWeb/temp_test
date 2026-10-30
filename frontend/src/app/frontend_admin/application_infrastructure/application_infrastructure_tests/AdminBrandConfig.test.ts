import { describe, expect, it } from 'vitest';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';

describe('admin brand configuration', () => {
  it('provides non-empty display segments from one infrastructure-owned contract', () => {
    expect(ADMIN_BRAND_CONFIG.name.trim()).not.toBe('');
    expect(ADMIN_BRAND_CONFIG.suffix.trim()).not.toBe('');
    expect(ADMIN_BRAND_CONFIG.displayName).toBe(`${ADMIN_BRAND_CONFIG.name} ${ADMIN_BRAND_CONFIG.suffix}`);
  });
});
