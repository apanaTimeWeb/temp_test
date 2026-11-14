// RESPONSIBILITY: Define local sample fixtures for billing member payment promises; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_payment_promises/mocks/fixtures/SuperadminBillingOverviewMemberPaymentPromisesPaymentPromiseMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminFinancePaymentPromiseSample } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/types/superadmin_billing_member_payment_promises.types';

/** Synthetic payment promises for the non-operational UI preview only. */
export const SUPERADMIN_FINANCE_SAMPLE_PAYMENT_PROMISES: readonly SuperadminFinancePaymentPromiseSample[] = [
  { id: 1, studentName: 'Sample Student A', smartId: 'SAMPLE-STU-101', promisedAmount: 1499, expectedDate: '2026-10-20', daysUntilDue: 6, timesChanged: 0, status: 'pending' },
  { id: 2, studentName: 'Sample Student B', smartId: 'SAMPLE-STU-102', promisedAmount: 999, expectedDate: '2026-10-05', daysUntilDue: -9, timesChanged: 1, status: 'overdue' },
  { id: 3, studentName: 'Sample Student C', smartId: 'SAMPLE-STU-103', promisedAmount: 2499, expectedDate: '2026-09-15', daysUntilDue: -29, timesChanged: 0, status: 'fulfilled', fulfilledDate: '2026-10-10' },
  { id: 4, studentName: 'Sample Student D', smartId: 'SAMPLE-STU-104', promisedAmount: 1200, expectedDate: '2026-10-30', daysUntilDue: 16, timesChanged: 2, status: 'pending' },
  { id: 5, studentName: 'Sample Student E', smartId: 'SAMPLE-STU-105', promisedAmount: 800, expectedDate: '2026-10-12', daysUntilDue: -2, timesChanged: 3, status: 'overdue' },
];
