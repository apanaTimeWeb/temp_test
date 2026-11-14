// RESPONSIBILITY: Define local sample fixtures for billing member refunds; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_refunds/mocks/fixtures/SuperadminBillingOverviewMemberRefundsReadMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Synthetic-only finance fixtures for contract tests; never use these as operational records. */
export const SUPERADMIN_MEMBER_REFUND_FIXTURES = [
  { id: 'refund-test-1', name: 'Synthetic Student', smartId: 'TEST-STUDENT-1', date: '2026-01-11', depositHeldMinor: 120000, deductionAmountMinor: 0, netRefundMinor: 120000, currencyCode: 'INR', status: 'pending' },
] as const;
