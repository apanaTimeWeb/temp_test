// RESPONSIBILITY: Define source-level test coverage for subscriptions overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_overview/tests/SuperadminSubscriptionsOverviewFormatters.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/utils/SuperadminSubscriptionsOverviewFormatters';

describe('formatSuperadminSubscriptionsMajorPreviewCurrency', () => {
  it('formats finite INR amounts', () => {
    expect(formatSuperadminSubscriptionsMajorPreviewCurrency(1000, 'INR', 'en-IN')).toContain('1,000');
    expect(formatSuperadminSubscriptionsMajorPreviewCurrency('99.5', 'INR', 'en-IN')).toContain('99.5');
  });
  it('never renders invalid amounts as NaN', () => {
    expect(formatSuperadminSubscriptionsMajorPreviewCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
    expect(formatSuperadminSubscriptionsMajorPreviewCurrency('', 'INR', 'en-IN')).toBe('—');
  });
});
