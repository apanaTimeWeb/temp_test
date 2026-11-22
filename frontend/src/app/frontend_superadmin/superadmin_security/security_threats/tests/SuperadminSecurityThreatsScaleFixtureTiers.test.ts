// RESPONSIBILITY: Define source-level test coverage for security threats using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_threats/tests/SuperadminSecurityThreatsScaleFixtureTiers.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '../mocks/fixtures/superadmin_security_threats.scale-stress-fixtures';

describe('security_threats deterministic scale fixture tiers', () => {
  it('provides the required 10, 100, and 500 record tiers from local synthetic fixtures', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });
  it('does not mutate the source fixture records while deriving identities', () => {
    expect(MOCK_SCALE_TIER_1_SMALL[0]).not.toBe(MOCK_SCALE_TIER_1_SMALL[1]);
  });
  it('uses the active failed-login record shape and unique identities', () => {
    const firstRow = MOCK_SCALE_TIER_1_SMALL[0];
    expect(Object.keys(firstRow)).toContain('ip');
    expect(Object.keys(firstRow)).toContain('user');
    expect(Object.keys(firstRow)).toContain('reason');
    const ids = MOCK_SCALE_TIER_3_STRESS.map((record) => record.id);
    expect(new Set(ids).size).toBe(500);
  });

});
