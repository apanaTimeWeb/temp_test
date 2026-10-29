import { describe, expect, it } from 'vitest';
import { fetchManagerDashboardData, ManagerDashboardOverviewContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/api/manager_dashboard_overview.api';
import { managerDashboardHandlers } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/mocks/manager_dashboard_overview_handlers/ManagerDashboardOverviewHandlers';

describe('manager dashboard API contract boundary', () => {
  it('does not fabricate an endpoint response before the API contract is supplied', async () => {
    await expect(fetchManagerDashboardData()).rejects.toBeInstanceOf(ManagerDashboardOverviewContractBlockedError);
  });
  it('does not register a mock handler for an unverified endpoint', () => {
    expect(managerDashboardHandlers).toEqual([]);
  });
});
