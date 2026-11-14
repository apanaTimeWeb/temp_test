// RESPONSIBILITY: Define source-level test coverage for Login Security scale fixture shape and immutability; execution requires the host test runtime.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SECURITY_FAILED_LOGINS } from '../mocks/fixtures/SuperadminSecurityLoginSecurityPreviewMockFixtures';
import {
  createSecurityLoginScaleTier,
  MOCK_SCALE_TIER_1_SMALL,
  MOCK_SCALE_TIER_2_STANDARD,
  MOCK_SCALE_TIER_3_STRESS,
} from '../mocks/fixtures/superadmin_security_login_security.scale-stress-fixtures';

const sourceSnapshot = JSON.stringify(SUPERADMIN_SECURITY_FAILED_LOGINS);
const tiers = [MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS] as const;

describe('security_login_security deterministic scale fixture tiers', () => {
  it('provides the required 10, 100, and 500 failed-login records', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });

  it('preserves the failed-login record contract and unique identities at every scale', () => {
    for (const tier of tiers) {
      expect(new Set(tier.map((record) => record.id)).size).toBe(tier.length);
      expect(tier.every((record) => Number.isSafeInteger(record.id)
        && typeof record.ip === 'string'
        && typeof record.user === 'string'
        && typeof record.time === 'string'
        && typeof record.reason === 'string')).toBe(true);
    }
  });

  it('derives copied records without mutating or reusing source objects', () => {
    const generated = createSecurityLoginScaleTier(10);
    expect(JSON.stringify(SUPERADMIN_SECURITY_FAILED_LOGINS)).toBe(sourceSnapshot);
    expect(generated.every((record) => !SUPERADMIN_SECURITY_FAILED_LOGINS.some((source) => source === record))).toBe(true);
  });
});
