import { describe, expect, it } from 'vitest';
import { MANAGER_DASHBOARD_QUERY_KEYS } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/api/manager_dashboard_overview.query_keys';

describe('ManagerDashboardOverviewQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_DASHBOARD_QUERY_KEYS.all[0]).toBe('manager_dashboard');
    expect(MANAGER_DASHBOARD_QUERY_KEYS.overview()[0]).toBe('manager_dashboard');
  });
});
