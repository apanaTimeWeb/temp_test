// RESPONSIBILITY: Define local sample fixtures for billing member payments; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_payments/mocks/fixtures/SuperadminBillingOverviewMemberPaymentsReadMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Synthetic-only finance fixtures for contract tests; never use these as operational records. */
export const SUPERADMIN_MEMBER_PAYMENT_FIXTURES = [
  { id: 'payment-test-1', receiptNumber: 'TEST-RECEIPT-1', date: '2026-01-10', studentName: 'Synthetic Student', smartId: 'TEST-STUDENT-1', amountMinor: 120000, currencyCode: 'INR', mode: 'upi', lateFeeMinor: 0, receivedBy: 'Test Fixture', status: 'completed' },
] as const;
