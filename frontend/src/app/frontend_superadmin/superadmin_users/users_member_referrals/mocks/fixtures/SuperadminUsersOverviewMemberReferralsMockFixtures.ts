// RESPONSIBILITY: Define local sample fixtures for users member referrals; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_users/users_member_referrals/mocks/fixtures/SuperadminUsersOverviewMemberReferralsMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Local illustrative records for the preview-only referrals view; never treated as persisted backend data. */
import type { Referrer } from '../../types/SuperadminUsersOverviewMemberReferralsPageClientComponentTypes';

export const SUPERADMIN_USERS_MEMBER_REFERRALS_MOCK_REFERRERS: Referrer[] = [
  { id: 1, name: 'Rahul Kumar',  smartId: 'STU101', referredNames: ['Priya S', 'Aman V', 'Sneha P', 'Vikas S', 'Neha G'], referredCount: 8, bonusEarned: 800, redeemed: 300, balance: 500 },
  { id: 2, name: 'Priya Singh',  smartId: 'STU102', referredNames: ['Aman V', 'Rohan M'],                                   referredCount: 5, bonusEarned: 500, redeemed: 200, balance: 300 },
  { id: 3, name: 'Aman Verma',   smartId: 'STU103', referredNames: ['Sneha P', 'Vikas S'],                                  referredCount: 4, bonusEarned: 400, redeemed: 0,   balance: 400 },
  { id: 4, name: 'Sneha Patel',  smartId: 'STU104', referredNames: ['Neha G', 'Rohan M', 'Kiran D'],                        referredCount: 3, bonusEarned: 300, redeemed: 100, balance: 200 },
  { id: 5, name: 'Vikas Sharma', smartId: 'STU105', referredNames: ['Kiran D'],                                             referredCount: 2, bonusEarned: 200, redeemed: 0,   balance: 200 },
  { id: 6, name: 'Neha Gupta',   smartId: 'STU106', referredNames: ['Rohan M'],                                             referredCount: 1, bonusEarned: 100, redeemed: 0,   balance: 100 },
];
