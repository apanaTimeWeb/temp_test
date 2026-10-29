import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/lib/api';
import { fetchManagerReports, ManagerDashboardReportsContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/api/manager_dashboard_reports.api';

vi.mock('@/lib/api', () => ({ apiFetch: vi.fn() }));
const apiFetchMock = vi.mocked(apiFetch);

describe('dashboard reports fail-closed API contract', () => {
  beforeEach(() => vi.resetAllMocks());

  it('does not issue a request while the authoritative endpoint is absent', async () => {
    const data = await fetchManagerReports('This Week');
    expect(data).toBeDefined();
    expect(data.kpiCards.length).toBeGreaterThan(0);
    expect(apiFetchMock).not.toHaveBeenCalled();
  });
});
