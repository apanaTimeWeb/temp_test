import { describe, expect, it } from 'vitest';
import { getManagerReportsQueryKey } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/api/manager_dashboard_reports.query_keys';

describe('ManagerDashboardReportsQueryKeys', () => {
  it('uses the canonical module namespace', () => {
    expect(getManagerReportsQueryKey('This Month')[0]).toBe('manager_reports');
  });
});
