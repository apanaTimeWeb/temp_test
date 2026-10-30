import { describe, expect, it } from 'vitest';
import { ADMIN_FINANCE_ROOT, ADMIN_FINANCE_ROUTE_COLLECT_FEE, ADMIN_FINANCE_ROUTE_RENEWALS, ADMIN_FINANCE_ROUTE_SUBSCRIPTIONS } from '@/app/frontend_admin/admin_finance/finance_dashboard/config/admin_finance_dashboard_finance_url_config_source_routes';

describe('legacy finance route compatibility', () => {
  it('preserves the finance root and points migrated views at their dedicated owners', () => {
    expect(ADMIN_FINANCE_ROOT).toBe('/admin/admin_finance');
    expect(ADMIN_FINANCE_ROUTE_COLLECT_FEE).toBe('/admin/admin_finance/finance_collect_fee');
    expect(ADMIN_FINANCE_ROUTE_RENEWALS).toBe('/admin/admin_finance/finance_renewals');
    expect(ADMIN_FINANCE_ROUTE_SUBSCRIPTIONS).toBe('/admin/admin_finance/finance_subscriptions');
  });
});


it('builds a proper collect-fee query URL for a student id', async () => {
  const { ADMIN_FINANCE_ROUTE_COLLECT_FEE_FOR_STUDENT } = await import('@/app/frontend_admin/admin_finance/finance_dashboard/config/admin_finance_dashboard_finance_url_config_source_routes');
  const url = new URL(ADMIN_FINANCE_ROUTE_COLLECT_FEE_FOR_STUDENT('student 123'), 'https://example.test');
  expect(url.pathname).toBe('/admin/admin_finance/finance_collect_fee');
  expect(url.searchParams.get('studentId')).toBe('student 123');
});
