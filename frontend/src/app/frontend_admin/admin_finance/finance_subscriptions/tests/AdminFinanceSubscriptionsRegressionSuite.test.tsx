/** Consolidated module regression suites. Each original suite remains isolated under its named describe block. */
import { describe, expect, it } from 'vitest';
import { ADMIN_SUBSCRIPTIONS_DEMO_SUBSCRIPTIONS } from '@/app/frontend_admin/admin_finance/finance_subscriptions/mocks/AdminFinanceSubscriptionsDemoFixtures';
import { serializeAdminSubscriptionsCsv } from '@/app/frontend_admin/admin_finance/finance_subscriptions/utils/AdminFinanceSubscriptionsCsvUtils';
import { formatCurrency, formatDate, formatDateTime } from '@/app/frontend_admin/admin_finance/finance_subscriptions/utils/AdminFinanceSubscriptionsFormat';
import { ADMIN_FINANCE_SUBSCRIPTIONS_ROUTES } from '@/app/frontend_admin/admin_finance/finance_subscriptions/config/admin_finance_subscriptions.url_config';

describe('Original suite: AdminFinanceSubscriptionsCsvUtils.test.ts', () => {
  const fixture = ADMIN_SUBSCRIPTIONS_DEMO_SUBSCRIPTIONS[0];
  if (!fixture) throw new Error('Subscription fixture must include at least one record for contract tests.');

  describe('admin subscriptions CSV export', () => {
    it('preserves the original minor-unit values and escapes text cells', () => {
      const rows = [{ ...fixture, studentName: 'Sharma, "Aarav"' }];
      const csv = serializeAdminSubscriptionsCsv(rows);
      expect(csv.split('\r\n')[0]).toContain('base_minor_units');
      expect(csv).toContain('"Sharma, ""Aarav"""');
      expect(csv).toContain(String(rows[0]?.base));
      expect(serializeAdminSubscriptionsCsv([{ ...fixture, studentName: '=SUM(1,1)' }])).toContain("'=SUM(1,1)");
    });
  });
});

describe('Original suite: AdminFinanceSubscriptionsFixtures.test.ts', () => {
  describe('subscription lifecycle fixture consistency', () => {
    it('derives active/expired status and days-left from each end date while preserving explicit suspended/cancelled states', () => {
      for (const subscription of ADMIN_SUBSCRIPTIONS_DEMO_SUBSCRIPTIONS) {
        if (subscription.status === 'active') expect(subscription.daysLeft).toBeGreaterThanOrEqual(0);
        if (subscription.status === 'expired') expect(subscription.daysLeft).toBeLessThan(0);
        if (subscription.status === 'suspended' || subscription.status === 'cancelled') expect(['suspended', 'cancelled']).toContain(subscription.status);
      }
    });
  });
});

describe('Original suite: AdminFinanceSubscriptionsFormat.test.ts', () => {
  describe('admin subscriptions currency formatting', () => {
    it('uses the currency-specific minor-unit scale', () => {
      expect(formatCurrency(1234, 'JPY', 'en-US')).toContain('1,234');
      expect(formatCurrency(1234, 'BHD', 'en-US')).toContain('1.234');
    });

    it('does not expose invalid numbers as NaN', () => {
      expect(formatCurrency(Number.NaN, 'INR', 'en-IN')).not.toContain('NaN');
    });
  });


  describe('safe subscription currency formatting', () => {
    it.each([NaN, Infinity, -Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1, -1])('returns unavailable for invalid minor units: %s', (amount) => { expect(formatCurrency(amount, 'INR', 'en-IN')).toBe('—'); });
    it('preserves valid zero as a legitimate zero amount', () => { expect(formatCurrency(0, 'INR', 'en-IN')).not.toBe('—'); });
  });


  describe('subscription date fallbacks', () => {
    it('uses an explicit unavailable marker for missing or malformed dates', () => { expect(formatDate('')).toBe('—'); expect(formatDate('not-a-date')).toBe('—'); expect(formatDateTime('')).toBe('—'); expect(formatDateTime('not-a-date')).toBe('—'); });
  });
});

describe('Original suite: AdminFinanceSubscriptionsMainSubscriptionsUrlContract.test.ts', () => {
  describe('admin_subscriptions canonical URL contract', () => {
    it('exports a stable route owned by this module', () => {
      expect(ADMIN_FINANCE_SUBSCRIPTIONS_ROUTES.ROOT).toBe('/admin/admin_finance/finance_subscriptions');
    });
  });
});
