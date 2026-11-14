// RESPONSIBILITY: Define local sample fixtures for users member trust score; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_users/users_member_trust_score/mocks/fixtures/SuperadminUsersOverviewMemberTrustScoreMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Local illustrative trust-score rows for the preview UI; no score is persisted by this fixture. */
import type { Student } from '../../types/SuperadminUsersOverviewMemberTrustScorePageClientComponentTypes';

export const SUPERADMIN_USERS_MEMBER_TRUST_SCORE_MOCK_STUDENTS: Student[] = [
  { rank: 1, studentName: 'Rahul Kumar',  smartId: 'STU101', shift: 'Morning',  trustScore: 92, totalPromises: 12, timesChanged: 0, fulfilledCount: 12, badge: 'reliable' },
  { rank: 2, studentName: 'Priya Singh',  smartId: 'STU102', shift: 'Evening',  trustScore: 85, totalPromises: 9,  timesChanged: 1, fulfilledCount: 8,  badge: 'reliable' },
  { rank: 3, studentName: 'Aman Verma',   smartId: 'STU103', shift: 'Full Day', trustScore: 67, totalPromises: 15, timesChanged: 3, fulfilledCount: 9,  badge: 'moderate' },
  { rank: 4, studentName: 'Sneha Patel',  smartId: 'STU104', shift: 'Morning',  trustScore: 45, totalPromises: 8,  timesChanged: 4, fulfilledCount: 3,  badge: 'moderate' },
  { rank: 5, studentName: 'Vikas Sharma', smartId: 'STU105', shift: 'Evening',  trustScore: 78, totalPromises: 11, timesChanged: 2, fulfilledCount: 10, badge: 'reliable' },
  { rank: 6, studentName: 'Neha Gupta',   smartId: 'STU106', shift: 'Full Day', trustScore: 33, totalPromises: 7,  timesChanged: 5, fulfilledCount: 2,  badge: 'low'      },
];
