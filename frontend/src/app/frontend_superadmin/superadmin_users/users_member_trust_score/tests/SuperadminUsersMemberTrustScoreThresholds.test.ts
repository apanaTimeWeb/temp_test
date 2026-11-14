import { describe, expect, it } from 'vitest';
import { SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants';

describe('member trust-score threshold contract', () => {
  it('keeps the reliable and low-score bands in the owning constants module', () => {
    expect(SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS).toEqual({ RELIABLE_MIN: 70, LOW_MAX_EXCLUSIVE: 40 });
  });
});
