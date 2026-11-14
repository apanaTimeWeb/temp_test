// RESPONSIBILITY: Define source-level test coverage for users member referrals using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_member_referrals/tests/SuperadminUsersMemberReferralsScaleFixtureTiers.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '../mocks/fixtures/superadmin_users_member_referrals.scale-stress-fixtures';

describe('users_member_referrals deterministic scale fixture tiers', () => {
  it('provides 10, 100, and 500 deterministic local preview records', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });
  it('uses deterministic unique row identities within each tier', () => {
    const ids = MOCK_SCALE_TIER_3_STRESS.map((row) => {
      if (typeof row === 'number' || typeof row === 'string') return row;
      const record = row as unknown as Record<string, unknown>;
      return record.id ?? record.row ?? record.rank ?? record.__scaleFixtureIndex;
    });
    expect(new Set(ids).size).toBe(500);
  });
});
