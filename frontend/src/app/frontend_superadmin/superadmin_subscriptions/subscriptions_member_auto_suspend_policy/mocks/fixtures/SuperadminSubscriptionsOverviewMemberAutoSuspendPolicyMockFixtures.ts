// RESPONSIBILITY: Define local sample fixtures for subscriptions member auto suspend policy; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_subscriptions/subscriptions_member_auto_suspend_policy/mocks/fixtures/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_FINANCE_AUTO_SUSPEND_SAMPLE_CONFIG = { daysBeforeSuspend: 7, currentlySuspended: 4, autoRestoredThisMonth: 2, manualRestores: 1 };

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_FINANCE_AUTO_SUSPEND_SAMPLE_STUDENTS = [
  { id: 1, studentId: 101, studentName: 'Rahul Kumar',  smartId: 'STU101', seat: 'A-12', shift: 'Morning',  daysOverdue: 14, suspendedSince: '2026-03-28' },
  { id: 2, studentId: 102, studentName: 'Priya Singh',  smartId: 'STU102', seat: 'B-05', shift: 'Evening',  daysOverdue: 9,  suspendedSince: '2026-04-02' },
  { id: 3, studentId: 103, studentName: 'Aman Verma',   smartId: 'STU103', seat: 'C-18', shift: 'Full Day', daysOverdue: 21, suspendedSince: '2026-03-21' },
  { id: 4, studentId: 104, studentName: 'Sneha Patel',  smartId: 'STU104', seat: 'A-07', shift: 'Morning',  daysOverdue: 8,  suspendedSince: '2026-04-03' },
];
