// RESPONSIBILITY: Define source-level test coverage for subscriptions member subscriptions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_member_subscriptions/tests/SuperadminSubscriptionsOverviewMemberSubscriptionsDateTimeFormatting.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatRelativeSubscriptionDays } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/utils/SuperadminSubscriptionsOverviewMemberSubscriptionsFormatters';
import { SUPERADMIN_FINANCE_SUBSCRIPTION_DAY_THRESHOLDS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/constants/SuperadminSubscriptionsOverviewMemberSubscriptionsStaticConstants';

describe('SuperadminSubscriptionsOverviewMemberSubscriptionsFormatters date-fns formatting contract', () => {
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

describe('subscription urgency and relative-day presentation', () => {
  it('uses named visual thresholds instead of inline day literals', () => {
    expect(SUPERADMIN_FINANCE_SUBSCRIPTION_DAY_THRESHOLDS).toEqual({ URGENT: 7, WARNING: 15 });
  });

  it('formats signed day offsets in English and Hindi', () => {
    expect(formatRelativeSubscriptionDays(3, 'en')).toBe('in 3 days');
    expect(formatRelativeSubscriptionDays(-3, 'en')).toBe('3 days ago');
    expect(formatRelativeSubscriptionDays(3, 'hi')).toContain('3');
    expect(formatRelativeSubscriptionDays(3, 'hi')).not.toBe(formatRelativeSubscriptionDays(3, 'en'));
  });
});
