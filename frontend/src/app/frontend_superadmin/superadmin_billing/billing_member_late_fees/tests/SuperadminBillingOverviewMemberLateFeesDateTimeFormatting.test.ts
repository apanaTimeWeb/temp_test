// RESPONSIBILITY: Define source-level test coverage for billing member late fees using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_late_fees/tests/SuperadminBillingOverviewMemberLateFeesDateTimeFormatting.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime } from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/utils/SuperadminBillingOverviewMemberLateFeesFormatters';

describe('SuperadminBillingOverviewMemberLateFeesFormatters date-fns formatting contract', () => {
  it('formats valid ISO date-only values in the active supported locale', () => {
    expect(formatDate('2026-04-12', 'en')).not.toBe('');
    expect(formatDate('2026-04-12', 'hi')).not.toBe('');
  });

  it('rejects malformed ISO dates instead of normalizing them silently', () => {
    expect(formatDate('2025-02-31', 'en')).toBe('');
    expect(formatDateTime('2025-02-31T12:00:00Z', 'en')).toBe('');
  });

  it('formats UTC ISO timestamps through local date-fns presentation', () => {
    expect(formatDateTime('2026-04-12T23:30:00.000Z', 'en')).not.toBe('');
  });
});
