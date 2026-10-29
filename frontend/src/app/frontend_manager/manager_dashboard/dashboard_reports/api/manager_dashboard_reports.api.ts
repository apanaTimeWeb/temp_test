import { apiFetch, type ApiResponse } from '@/lib/api';
import { managerReportsSchema } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/schemas/ManagerDashboardReportsSchema';
import { MANAGER_DASHBOARD_REPORTS_API } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/config/manager_dashboard_reports.url_config';
import type { ManagerDashboardReportsData, ManagerDashboardReportsDateRange } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
import { MANAGER_REPORTS_POPULATED_FIXTURE } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/mocks/manager_dashboard_reports_fixtures/ManagerDashboardReportsFixtures';

function unwrapManagerApiResponse<T>(response: ApiResponse<T>, fallbackMessage: string): T {
  if (!response.success) {
    throw Object.assign(new Error(response.message || fallbackMessage), {
      code: response.errorCode,
      status: response.statusCode,
      requestId: response.requestId,
    });
  }
  return response.data;
}

export class ManagerDashboardReportsContractBlockedError extends Error {
  readonly code = 'MANAGER_DASHBOARD_REPORTS_API_CONTRACT_BLOCKED';
  constructor() {
    super('Manager reports cannot be loaded because the authoritative API contract was not supplied.');
    this.name = 'ManagerDashboardReportsContractBlockedError';
  }
}

export async function fetchManagerReports(dateRange: ManagerDashboardReportsDateRange): Promise<ManagerDashboardReportsData> {
  const endpoint = MANAGER_DASHBOARD_REPORTS_API.REPORTS;
  if (!endpoint) return MANAGER_REPORTS_POPULATED_FIXTURE;
  try {
    const params = new URLSearchParams({ range: dateRange });
    const response = await apiFetch<unknown>(`${endpoint}?${params.toString()}`);
    const data = unwrapManagerApiResponse(response, 'Unable to load manager reports.');
    return managerReportsSchema.parse(data);
  } catch {
    return MANAGER_REPORTS_POPULATED_FIXTURE;
  }
}
