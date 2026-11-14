// RESPONSIBILITY: Define source-level test coverage for billing member payment promises using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_payment_promises/tests/SuperadminBillingOverviewMemberPaymentPromisesDateUtilities.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SuperadminFinanceCalculateDaysUntilDate } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/utils/SuperadminBillingOverviewMemberPaymentPromisesDateUtilities';

describe('SuperadminFinanceCalculateDaysUntilDate', () => {
  it('calculates calendar-day distance using the current local calendar day', () => {
    expect(SuperadminFinanceCalculateDaysUntilDate('2026-01-02', new Date(2026, 0, 1, 23, 59, 59))).toBe(1);
    expect(SuperadminFinanceCalculateDaysUntilDate('2026-01-02', new Date(2026, 0, 2, 0, 0, 1))).toBe(0);
    expect(SuperadminFinanceCalculateDaysUntilDate('2026-01-01', new Date(2026, 0, 2, 12, 0, 0))).toBe(-1);
  });

  it('rejects malformed and impossible calendar dates', () => {
    expect(() => SuperadminFinanceCalculateDaysUntilDate('2026/01/02', new Date(2026, 0, 1))).toThrow(RangeError);
    expect(() => SuperadminFinanceCalculateDaysUntilDate('2026-02-29', new Date(2026, 0, 1))).toThrow(RangeError);
  });
});
