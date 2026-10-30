import type { AdminDashboardReportsReport, AdminDashboardReportsAnalyticsDataset, AdminDashboardReportsAnalyticsApiRecord } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';
import { ADMIN_DASHBOARD_REPORTS_SCENARIO_NAMES, type AdminDashboardReportsScenarioName } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/scenarios/admin_dashboard_reports.scenarios';
export { ADMIN_DASHBOARD_REPORTS_SCENARIO_NAMES } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/scenarios/admin_dashboard_reports.scenarios';
export type AdminDashboardReportsAnalyticsScenario = AdminDashboardReportsScenarioName;
import { delay, http, HttpResponse } from 'msw';
import { ADMIN_DASHBOARD_REPORTS_API } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';

/** Report catalog metadata only; it contains no fabricated business metrics or backend rows. */
export const ADMIN_DASHBOARD_REPORTS_FIXTURES: readonly AdminDashboardReportsReport[] = [
  { id: 'member-directory-summary', titleKey: 'REPORTS_MEMBER_TITLE', descriptionKey: 'REPORTS_MEMBER_DESCRIPTION', category: 'members', dataStatus: 'contract_pending', exportable: false },
  { id: 'finance-summary', titleKey: 'REPORTS_FINANCE_TITLE', descriptionKey: 'REPORTS_FINANCE_DESCRIPTION', category: 'finance', dataStatus: 'contract_pending', exportable: false },
  { id: 'seats-shifts-summary', titleKey: 'REPORTS_SEATS_TITLE', descriptionKey: 'REPORTS_SEATS_DESCRIPTION', category: 'seats_shifts', dataStatus: 'contract_pending', exportable: false },
  { id: 'accounts-assets-summary', titleKey: 'REPORTS_ASSETS_TITLE', descriptionKey: 'REPORTS_ASSETS_DESCRIPTION', category: 'accounts_assets', dataStatus: 'contract_pending', exportable: false },
  { id: 'staff-summary', titleKey: 'REPORTS_STAFF_TITLE', descriptionKey: 'REPORTS_STAFF_DESCRIPTION', category: 'staff', dataStatus: 'contract_pending', exportable: false },
] as const;


export const ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE: AdminDashboardReportsAnalyticsDataset = {
  currencyCode: 'INR',
  kpis: [
    { label: 'Total Revenue This Month', amountMinor: 15200000, count: null, trend: { value: '12% vs last month', up: true }, sub: 'Gross fees collected', valueKind: 'currency' },
    { label: 'Total Expenses', amountMinor: 4650000, count: null, trend: { value: '4% vs last month', up: false }, sub: 'Rent + Utilities + Staff', valueKind: 'currency' },
    { label: 'Net Profit', amountMinor: 10550000, count: null, trend: { value: '18% vs last month', up: true }, sub: 'Revenue minus expenses', valueKind: 'currency' },
    { label: 'Active Students', amountMinor: null, count: 1248, trend: { value: '8% vs last month', up: true }, sub: 'Currently enrolled', valueKind: 'count' },
  ],
  incomeVsExpense: {
    thisMonth: [
      { month: 'W1', incomeMinor: 3500000, expenseMinor: 1050000 }, { month: 'W2', incomeMinor: 3700000, expenseMinor: 1100000 },
      { month: 'W3', incomeMinor: 3900000, expenseMinor: 1200000 }, { month: 'W4', incomeMinor: 4100000, expenseMinor: 1300000 },
    ],
    last3Months: [
      { month: 'Apr', incomeMinor: 12500000, expenseMinor: 4400000 },
      { month: 'May', incomeMinor: 14000000, expenseMinor: 3900000 },
      { month: 'Jun', incomeMinor: 15200000, expenseMinor: 4250000 },
    ],
    thisYear: Array.from([
      ['Jan',118000,38000],['Feb',105000,41000],['Mar',132000,35000],['Apr',125000,44000],['May',140000,39000],['Jun',152000,42500],
      ['Jul',148000,40000],['Aug',160000,43000],['Sep',155000,41500],['Oct',162000,44000],['Nov',170000,46000],['Dec',178000,48000],
    ], ([month, income, expense]) => ({ month: month as string, incomeMinor: (income as number) * 100, expenseMinor: (expense as number) * 100 })),
  },
  shiftOccupancy: [
    { name: 'Morning', value: 85, token: 'chart-primary' },
    { name: 'Evening', value: 90, token: 'chart-success' },
    { name: 'Night', value: 70, token: 'chart-warning' },
    { name: 'Full Day', value: 95, token: 'chart-info' },
  ],
  revenueTrend: {
    thisMonth: [
      { month: 'W1', revenueMinor: 3500000 },
      { month: 'W2', revenueMinor: 3700000 },
      { month: 'W3', revenueMinor: 3900000 },
      { month: 'W4', revenueMinor: 4100000 },
    ],
    last3Months: [
      { month: 'Apr', revenueMinor: 12500000 },
      { month: 'May', revenueMinor: 14000000 },
      { month: 'Jun', revenueMinor: 15200000 },
    ],
    thisYear: [
      { month: 'Jan', revenueMinor: 11800000 }, { month: 'Feb', revenueMinor: 10500000 },
      { month: 'Mar', revenueMinor: 13200000 }, { month: 'Apr', revenueMinor: 12500000 },
      { month: 'May', revenueMinor: 14000000 }, { month: 'Jun', revenueMinor: 15200000 },
      { month: 'Jul', revenueMinor: 14800000 }, { month: 'Aug', revenueMinor: 16000000 },
      { month: 'Sep', revenueMinor: 15500000 }, { month: 'Oct', revenueMinor: 16200000 },
      { month: 'Nov', revenueMinor: 17000000 }, { month: 'Dec', revenueMinor: 17800000 },
    ],
  },
  studentGrowth: {
    thisMonth: [
      { month: 'W1', joined: 14, exited: 3 }, { month: 'W2', joined: 16, exited: 2 },
      { month: 'W3', joined: 18, exited: 3 }, { month: 'W4', joined: 17, exited: 2 },
    ],
    last3Months: [
      { month: 'Apr', joined: 48, exited: 10 }, { month: 'May', joined: 60, exited: 9 }, { month: 'Jun', joined: 72, exited: 11 },
    ],
    thisYear: [
      { month: 'Jan', joined: 42, exited: 8 },
      { month: 'Feb', joined: 38, exited: 12 },
      { month: 'Mar', joined: 55, exited: 7 },
      { month: 'Apr', joined: 48, exited: 10 },
      { month: 'May', joined: 60, exited: 9 },
      { month: 'Jun', joined: 72, exited: 11 },
      { month: 'Jul', joined: 65, exited: 8 },
      { month: 'Aug', joined: 80, exited: 14 },
      { month: 'Sep', joined: 74, exited: 10 },
      { month: 'Oct', joined: 88, exited: 13 },
      { month: 'Nov', joined: 92, exited: 15 },
      { month: 'Dec', joined: 78, exited: 9 },
    ],
  },
  branchSummary: [
    { branch:'Main Branch', revenueMinor:6200000, expenseMinor:1800000, students:248, occupancy:92 },
    { branch:'Branch 2', revenueMinor:4800000, expenseMinor:1450000, students:180, occupancy:85 },
    { branch:'Kothrud Center', revenueMinor:2800000, expenseMinor:900000, students:95, occupancy:78 },
    { branch:'Nashik Branch', revenueMinor:1400000, expenseMinor:500000, students:42, occupancy:60 },
  ],
};

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
