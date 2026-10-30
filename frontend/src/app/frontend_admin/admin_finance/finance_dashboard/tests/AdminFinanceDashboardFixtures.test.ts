import { describe, expect, it } from 'vitest';
import { ADMIN_FINANCE_DEMO_DASHBOARD_STATS, ADMIN_FINANCE_DEMO_RECENT_PAYMENTS } from '@/app/frontend_admin/admin_finance/finance_dashboard/mocks/AdminFinanceDashboardFixtures';

describe('admin_finance_finance_dashboard demo fixtures', () => {
  it('keeps dashboard KPI values finite and nonnegative', () => {
    for (const value of Object.values(ADMIN_FINANCE_DEMO_DASHBOARD_STATS)) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });

  it('keeps recent payment identifiers unique and amounts safe minor-unit integers', () => {
    const ids = ADMIN_FINANCE_DEMO_RECENT_PAYMENTS.map((payment) => payment.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const payment of ADMIN_FINANCE_DEMO_RECENT_PAYMENTS) {
      expect(Number.isSafeInteger(payment.amount)).toBe(true);
      expect(payment.amount).toBeGreaterThanOrEqual(0);
    }
  });
});
