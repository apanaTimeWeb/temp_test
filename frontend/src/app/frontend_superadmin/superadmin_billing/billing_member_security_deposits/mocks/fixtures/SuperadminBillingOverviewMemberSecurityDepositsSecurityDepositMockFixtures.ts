// RESPONSIBILITY: Define local sample fixtures for billing member security deposits; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_security_deposits/mocks/fixtures/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminFinanceSecurityDepositSample } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/types/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositTypes';

/** Synthetic security-deposit fixture data for UI previews only; no real student or staff identity is represented. */
export const SUPERADMIN_FINANCE_SAMPLE_SECURITY_DEPOSITS: readonly SuperadminFinanceSecurityDepositSample[] = [
  { id: 1, studentName: 'Sample Student A', smartId: 'SAMPLE-STU-101', depositAmount: 10000, collectedBy: 'Sample Admin', collectedDate: '2026-03-15', deductionAmount: 0, status: 'held' },
  { id: 2, studentName: 'Sample Student B', smartId: 'SAMPLE-STU-102', depositAmount: 8000, collectedBy: 'Sample Manager', collectedDate: '2026-03-20', deductionAmount: 1500, deductionReason: 'Sample property deduction', status: 'held' },
  { id: 3, studentName: 'Sample Student C', smartId: 'SAMPLE-STU-103', depositAmount: 12000, collectedBy: 'Sample Admin', collectedDate: '2026-02-10', deductionAmount: 0, status: 'refunded', refundedDate: '2026-04-08' },
  { id: 4, studentName: 'Sample Student D', smartId: 'SAMPLE-STU-104', depositAmount: 9000, collectedBy: 'Sample Admin', collectedDate: '2026-03-05', deductionAmount: 9000, deductionReason: 'Sample forfeiture preview', status: 'forfeited' },
  { id: 5, studentName: 'Sample Student E', smartId: 'SAMPLE-STU-105', depositAmount: 11000, collectedBy: 'Sample Manager', collectedDate: '2026-04-01', deductionAmount: 0, status: 'held' },
];
