// RESPONSIBILITY: Define local sample fixtures for users member trust score; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_users/users_member_trust_score/mocks/fixtures/superadmin_users_member_trust_score.scale-stress-fixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Synthetic trust-score rows for isolated UI stress tests only; no backend contract is implied. */
import type { Student } from '../../types/SuperadminUsersOverviewMemberTrustScorePageClientComponentTypes';
function makeRows(count: number): readonly Student[] {
  return Array.from({ length: count }, (_, index) => ({
    rank: index + 1,
    studentName: `Synthetic Student ${String(index + 1).padStart(4, '0')}`,
    smartId: `TEST-TRUST-${String(index + 1).padStart(4, '0')}`,
    shift: (['Morning', 'Evening', 'Full Day'] as const)[index % 3],
    trustScore: 35 + ((index * 17) % 66),
    totalPromises: index % 12,
    timesChanged: index % 5,
    fulfilledCount: index % 10,
    badge: (['reliable', 'moderate', 'low'] as const)[index % 3],
  }));
}
export const MOCK_SCALE_TIER_1_SMALL = makeRows(10);
export const MOCK_SCALE_TIER_2_STANDARD = makeRows(100);
export const MOCK_SCALE_TIER_3_STRESS = makeRows(500);
