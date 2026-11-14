// RESPONSIBILITY: Define local sample fixtures for users member referrals; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_users/users_member_referrals/mocks/fixtures/superadmin_users_member_referrals.scale-stress-fixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Synthetic referral rows for isolated UI stress tests only; no backend contract is implied. */
import type { Referrer } from '../../types/SuperadminUsersOverviewMemberReferralsPageClientComponentTypes';
function makeRows(count: number): readonly Referrer[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Synthetic Referrer ${String(index + 1).padStart(4, '0')}`,
    smartId: `TEST-REF-${String(index + 1).padStart(4, '0')}`,
    referredNames: [`Synthetic Member ${(index % 50) + 1}`],
    referredCount: index % 8,
    bonusEarned: (index % 20) * 100,
    redeemed: (index % 10) * 50,
    balance: ((index % 20) * 100) - ((index % 10) * 50),
  }));
}
export const MOCK_SCALE_TIER_1_SMALL = makeRows(10);
export const MOCK_SCALE_TIER_2_STANDARD = makeRows(100);
export const MOCK_SCALE_TIER_3_STRESS = makeRows(500);
