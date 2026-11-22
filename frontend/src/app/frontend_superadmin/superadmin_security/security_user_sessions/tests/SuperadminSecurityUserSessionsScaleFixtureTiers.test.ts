// RESPONSIBILITY: Define source-level test coverage for security user sessions scale fixtures; execution requires the host test runtime.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_USERS_INITIAL_SESSIONS } from '../mocks/fixtures/SuperadminSecurityUserSessionsMockFixtures';
import {
  MOCK_SCALE_TIER_1_SMALL,
  MOCK_SCALE_TIER_2_STANDARD,
  MOCK_SCALE_TIER_3_STRESS,
} from '../mocks/fixtures/superadmin_security_user_sessions.scale-stress-fixtures';

const sourceSnapshot = JSON.stringify(SUPERADMIN_USERS_INITIAL_SESSIONS);
const tiers = [MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS] as const;

describe('security_user_sessions scale fixture tiers', () => {
  it('provides deterministic 10, 100, and 500-row tiers', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });

  it('keeps each tier within the session record contract and gives every row a unique ID', () => {
    for (const tier of tiers) {
      expect(new Set(tier.map((record) => record.id)).size).toBe(tier.length);
      expect(tier.every((record) => typeof record.id === 'string'
        && typeof record.user === 'string'
        && typeof record.device === 'string'
        && typeof record.ip === 'string'
        && typeof record.location === 'string'
        && typeof record.lastActive === 'string'
        && (record.status === 'Active' || record.status === 'Revoked'))).toBe(true);
    }
  });

  it('keeps canonical fixture records immutable and returns copied rows', () => {
    expect(JSON.stringify(SUPERADMIN_USERS_INITIAL_SESSIONS)).toBe(sourceSnapshot);
    expect(tiers.flat().every((record) => !SUPERADMIN_USERS_INITIAL_SESSIONS.some((source) => source === record))).toBe(true);
  });
});
