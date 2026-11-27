import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_DEMO_DATA } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.demo_data';
import { ADMIN_DASHBOARD_REPORTS_API } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';
import { ADMIN_DASHBOARD_REPORTS_SCENARIO_NAMES,type AdminDashboardReportsScenarioName } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/scenarios/admin_dashboard_reports.scenarios';
import type { AdminDashboardReportsAnalyticsApiRecord,AdminDashboardReportsAnalyticsDataset,AdminDashboardReportsReport } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';
import { delay,http,HttpResponse } from 'msw';
export { ADMIN_DASHBOARD_REPORTS_SCENARIO_NAMES } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/scenarios/admin_dashboard_reports.scenarios';
export type AdminDashboardReportsAnalyticsScenario = AdminDashboardReportsScenarioName;

/** Report catalog metadata only; it contains no fabricated business metrics or backend rows. */
export const ADMIN_DASHBOARD_REPORTS_FIXTURES: readonly AdminDashboardReportsReport[] = [
  { id: 'member-directory-summary', titleKey: 'REPORTS_MEMBER_TITLE', descriptionKey: 'REPORTS_MEMBER_DESCRIPTION', category: 'members', dataStatus: 'contract_pending', exportable: false },
  { id: 'finance-summary', titleKey: 'REPORTS_FINANCE_TITLE', descriptionKey: 'REPORTS_FINANCE_DESCRIPTION', category: 'finance', dataStatus: 'contract_pending', exportable: false },
  { id: 'seats-shifts-summary', titleKey: 'REPORTS_SEATS_TITLE', descriptionKey: 'REPORTS_SEATS_DESCRIPTION', category: 'seats_shifts', dataStatus: 'contract_pending', exportable: false },
  { id: 'accounts-assets-summary', titleKey: 'REPORTS_ASSETS_TITLE', descriptionKey: 'REPORTS_ASSETS_DESCRIPTION', category: 'accounts_assets', dataStatus: 'contract_pending', exportable: false },
  { id: 'staff-summary', titleKey: 'REPORTS_STAFF_TITLE', descriptionKey: 'REPORTS_STAFF_DESCRIPTION', category: 'staff', dataStatus: 'contract_pending', exportable: false },
] as const;


export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE: AdminDashboardReportsAnalyticsDataset = ADMIN_DASHBOARD_REPORTS_ANALYTICS_DEMO_DATA;

/** Empty API fixture: no domain records are invented without an authoritative response contract. */
export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_API_FIXTURE: readonly AdminDashboardReportsAnalyticsApiRecord[] = [];

/**
 * Every canonical scenario is wired to the real feature-local MSW endpoint adapter.
 * ACTIVE_RECORDS accepts a test-owned adapter payload; the default remains empty because no host DTO
 * or production report row is supplied. Supplemental 403/network/malformed-envelope states are real
 * handler responses rather than catalog-only descriptors.
 */
export function createAdminDashboardReportsAnalyticsHandlers(
  scenario: AdminDashboardReportsAnalyticsScenario,
  activeRecords: readonly AdminDashboardReportsAnalyticsApiRecord[] = ADMIN_DASHBOARD_REPORTS_ANALYTICS_API_FIXTURE,
  options: Readonly<{ timeoutDelayMs?: number }> = {},
) {
  return [http.get(ADMIN_DASHBOARD_REPORTS_API.LIST, async () => {
    if (scenario === 'NETWORK_ERROR') return HttpResponse.error();

    if (scenario === 'INVALID_RESPONSE') {
      return HttpResponse.json({
        success: true,
        message: 'Deliberately malformed reports response: data and requestId are absent.',
      });
    }

    if (scenario === 'NETWORK_TIMEOUT') {
      await delay(options.timeoutDelayMs ?? 50);
      return HttpResponse.json({
        success: false,
        errorCode: 'ERR_TIMEOUT',
        statusCode: 504,
        message: 'Mock reports request timed out.',
        requestId: 'mock-dashboard-reports-network_timeout',
      }, { status: 504 });
    }

    if (scenario === 'SERVER_500_ERROR' || scenario === 'UNAUTHORIZED_401' || scenario === 'FORBIDDEN_403') {
      const errorByScenario = {
        SERVER_500_ERROR: { statusCode: 500, errorCode: 'INTERNAL_ERROR', message: 'Mock reports server error.' },
        UNAUTHORIZED_401: { statusCode: 401, errorCode: 'UNAUTHENTICATED', message: 'Mock reports authentication required.' },
        FORBIDDEN_403: { statusCode: 403, errorCode: 'FORBIDDEN', message: 'Mock reports permission denied.' },
      } as const;
      const error = errorByScenario[scenario];
      return HttpResponse.json({
        success: false,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        message: error.message,
        requestId: `mock-dashboard-reports-${scenario.toLowerCase()}`,
      }, { status: error.statusCode });
    }

    const data = scenario === 'EMPTY_DATA' ? [] : activeRecords;
    return HttpResponse.json({
      success: true,
      message: scenario === 'EMPTY_DATA' ? 'Empty reports fixture.' : 'Active reports fixture supplied by the test adapter.',
      data,
      requestId: `mock-dashboard-reports-${scenario.toLowerCase()}`,
    });
  })];
}

/** Default handler for tests that only need an empty successful response. */
export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_MSW_HANDLERS = createAdminDashboardReportsAnalyticsHandlers('EMPTY_DATA');

/** Export the canonical scenario names next to the adapter for harnesses and contract tests. */
export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_SCENARIOS = ADMIN_DASHBOARD_REPORTS_SCENARIO_NAMES;
