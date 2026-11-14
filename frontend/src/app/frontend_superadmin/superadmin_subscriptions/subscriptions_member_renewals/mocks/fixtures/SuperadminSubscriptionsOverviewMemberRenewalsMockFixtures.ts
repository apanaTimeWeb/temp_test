// RESPONSIBILITY: Define local sample fixtures for subscriptions member renewals; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_subscriptions/subscriptions_member_renewals/mocks/fixtures/SuperadminSubscriptionsOverviewMemberRenewalsMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_FINANCE_SAMPLE_RENEWALS = [
  { id: 1, studentName: 'Aarav Sharma',  smartId: 'STU001', shift: 'Morning', plan: 'Premium', planId: 2, expiryDate: '2026-04-05', daysLeft: -6,  lastPaymentDate: '2026-03-01', due: 1499, total: 1499 },
  { id: 2, studentName: 'Priya Patel',   smartId: 'STU002', shift: 'Evening', plan: 'Basic',   planId: 1, expiryDate: '2026-04-15', daysLeft: 4,   lastPaymentDate: '2026-03-15', due: 999,  total: 999  },
  { id: 3, studentName: 'Rohan Kumar',   smartId: 'STU003', shift: 'Morning', plan: 'Elite',   planId: 3, expiryDate: '2026-04-20', daysLeft: 12,  lastPaymentDate: '2026-03-20', due: 2499, total: 2499 },
  { id: 4, studentName: 'Ananya Singh',  smartId: 'STU004', shift: 'Evening', plan: 'Premium', planId: 2, expiryDate: '2026-04-08', daysLeft: -2,  lastPaymentDate: '2026-03-08', due: 1499, total: 1499 },
  { id: 5, studentName: 'Vikram Rao',    smartId: 'STU005', shift: 'Morning', plan: 'Basic',   planId: 1, expiryDate: '2026-04-16', daysLeft: 6,   lastPaymentDate: '2026-03-16', due: 999,  total: 999  },
  { id: 6, studentName: 'Sneha Gupta',   smartId: 'STU006', shift: 'Evening', plan: 'Elite',   planId: 3, expiryDate: '2026-04-22', daysLeft: 14,  lastPaymentDate: '2026-03-22', due: 2499, total: 2499 },
];
