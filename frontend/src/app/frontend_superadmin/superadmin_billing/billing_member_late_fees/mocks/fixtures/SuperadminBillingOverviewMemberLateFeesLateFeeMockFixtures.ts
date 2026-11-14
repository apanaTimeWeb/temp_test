// RESPONSIBILITY: Define local sample fixtures for billing member late fees; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_late_fees/mocks/fixtures/SuperadminBillingOverviewMemberLateFeesLateFeeMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminFinanceOverdueSample } from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/types/SuperadminBillingOverviewMemberLateFeesLateFeeTypes';

/** Synthetic-only records; placeholder phone numbers are not real contacts. */
export const SUPERADMIN_FINANCE_SAMPLE_OVERDUE: readonly SuperadminFinanceOverdueSample[] = [
  { studentId: 'STU-SAMPLE-101', studentName: 'Sample Student A', smartId: 'STU-SAMPLE-101', phone: '0000000000', dueDate: 'Sample date', daysOverdue: 6, accruedFee: 300, totalDue: 45300 },
  { studentId: 'STU-SAMPLE-102', studentName: 'Sample Student B', smartId: 'STU-SAMPLE-102', phone: '0000000000', dueDate: 'Sample date', daysOverdue: 10, accruedFee: 500, totalDue: 30500 },
  { studentId: 'STU-SAMPLE-103', studentName: 'Sample Student C', smartId: 'STU-SAMPLE-103', phone: '0000000000', dueDate: 'Sample date', daysOverdue: 14, accruedFee: 700, totalDue: 60700 },
];
