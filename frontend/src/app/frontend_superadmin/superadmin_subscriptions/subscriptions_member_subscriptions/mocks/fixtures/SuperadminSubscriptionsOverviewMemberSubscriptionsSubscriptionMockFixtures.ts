// RESPONSIBILITY: Define local sample fixtures for subscriptions member subscriptions; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_subscriptions/subscriptions_member_subscriptions/mocks/fixtures/SuperadminSubscriptionsOverviewMemberSubscriptionsSubscriptionMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminFinanceSubscriptionSample } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/types/SuperadminSubscriptionsOverviewMemberSubscriptionsSubscriptionTypes';

/** Synthetic preview snapshot dated 2026-10-14; daysLeft values align to that sample date. */
export const SUPERADMIN_FINANCE_SAMPLE_SUBSCRIPTIONS: readonly SuperadminFinanceSubscriptionSample[] = [
  { id: 1, studentName: 'Sample Student A', smartId: 'SAMPLE-STU-001', plan: 'Premium Plan', shift: 'Morning', startDate: '2026-04-26', endDate: '2026-10-26', daysLeft: 12, base: 15000, discount: 0, total: 15000, paid: 15000, due: 0, status: 'active' },
  { id: 2, studentName: 'Sample Student B', smartId: 'SAMPLE-STU-002', plan: 'Basic Plan', shift: 'Evening', startDate: '2026-04-17', endDate: '2026-10-17', daysLeft: 3, base: 8000, discount: 200, total: 7800, paid: 6000, due: 1800, status: 'active' },
  { id: 3, studentName: 'Sample Student C', smartId: 'SAMPLE-STU-003', plan: 'Premium Plan', shift: 'Full Day', startDate: '2025-10-01', endDate: '2026-09-29', daysLeft: -15, base: 18000, discount: 0, total: 18000, paid: 18000, due: 0, status: 'expired' },
  { id: 4, studentName: 'Sample Student D', smartId: 'SAMPLE-STU-004', plan: 'Basic Plan', shift: 'Morning', startDate: '2026-05-28', endDate: '2026-11-28', daysLeft: 45, base: 9000, discount: 0, total: 9000, paid: 4500, due: 4500, status: 'suspended' },
  { id: 5, studentName: 'Sample Student E', smartId: 'SAMPLE-STU-005', plan: 'Premium Plan', shift: 'Evening', startDate: '2025-08-30', endDate: '2026-08-30', daysLeft: -45, base: 16000, discount: 500, total: 15500, paid: 15500, due: 0, status: 'cancelled' },
  { id: 6, studentName: 'Sample Student F', smartId: 'SAMPLE-STU-006', plan: 'Basic Plan', shift: 'Full Day', startDate: '2026-04-22', endDate: '2026-10-22', daysLeft: 8, base: 7500, discount: 0, total: 7500, paid: 7500, due: 0, status: 'active' },
  { id: 7, studentName: 'Sample Student G', smartId: 'SAMPLE-STU-007', plan: 'Premium Plan', shift: 'Morning', startDate: '2026-04-09', endDate: '2026-10-09', daysLeft: -5, base: 14000, discount: 0, total: 14000, paid: 10000, due: 4000, status: 'expired' },
];
