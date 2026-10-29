import { describe, expect, it } from 'vitest';
import { managerReportsHandlers } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/mocks/manager_dashboard_reports_handlers/ManagerDashboardReportsHandlers';
import { MANAGER_DASHBOARD_REPORTS_API, MANAGER_DASHBOARD_REPORTS_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/config/manager_dashboard_reports.url_config';
import { fetchManagerReports, ManagerDashboardReportsContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/api/manager_dashboard_reports.api';

describe('Manager Reports API contract guard', () => {
  it('keeps the browser route separate from the absent API contract', () => {
    expect(MANAGER_DASHBOARD_REPORTS_ROUTES.REPORTS).toBe('/frontend_manager/manager_dashboard/dashboard_reports');
    expect(MANAGER_DASHBOARD_REPORTS_API.REPORTS).toBeNull();
  });
  it('does not register a fake JSON handler on the browser route', () => {
    expect(managerReportsHandlers).toEqual([]);
  });
  it('fails closed instead of inferring an endpoint from the route', async () => {
    await expect(fetchManagerReports('This Month')).rejects.toBeInstanceOf(ManagerDashboardReportsContractBlockedError);
  });
});
