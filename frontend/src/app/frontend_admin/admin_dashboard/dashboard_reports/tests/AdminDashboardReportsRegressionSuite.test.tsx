import { afterEach as suite0_afterEach, describe as suite0_describe, expect as suite0_expect, it as suite0_it, vi as suite0_vi } from "vitest";
import { http as suite0_http, HttpResponse as suite0_HttpResponse } from "msw";
import { mswTestServer as suite0_mswTestServer } from "@/test/mswServer";
import { fetchAdminDashboardReportsAnalytics as suite0_fetchAdminDashboardReportsAnalytics } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/api/admin_dashboard_reports.api';
import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_MSW_HANDLERS as suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_MSW_HANDLERS, createAdminDashboardReportsAnalyticsHandlers as suite0_createAdminDashboardReportsAnalyticsHandlers } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/AdminDashboardReportsFixtures";
import { ADMIN_DASHBOARD_REPORTS_API as suite0_ADMIN_DASHBOARD_REPORTS_API } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config";
import { render as suite0_render, screen as suite0_screen } from "@testing-library/react";
import { NextIntlClientProvider as suite0_NextIntlClientProvider } from "next-intl";
import suite0_AdminDashboardReportsAnalyticsSecondaryInsightsSection from "@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsSecondaryInsightsSection";
import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE as suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/AdminDashboardReportsFixtures";
import suite0_adminDashboardReportsAnalyticsEn from "@/app/frontend_admin/admin_dashboard/dashboard_reports/locales/admin_dashboard_reports_en.json";
import suite0_adminDashboardReportsAnalyticsHi from "@/app/frontend_admin/admin_dashboard/dashboard_reports/locales/admin_dashboard_reports_hi.json";
import { buildAdminDashboardReportsAnalyticsCsv as suite0_buildAdminDashboardReportsAnalyticsCsv } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters";
import { adminDashboardReportsAnalyticsMinorToMajor as suite0_adminDashboardReportsAnalyticsMinorToMajor, adminDashboardReportsAnalyticsFormatCurrency as suite0_adminDashboardReportsAnalyticsFormatCurrency } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters";
import type { AdminDashboardReportsAnalyticsDataset as suite0_AdminDashboardReportsAnalyticsDataset } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes";
import suite0_messages from "@/app/frontend_admin/admin_dashboard/dashboard_reports/locales/admin_dashboard_reports_en.json";
import * as suite1_HarnessVitest from "vitest";
import * as suite1_HarnessTestingLibrary from "@testing-library/react";
import { AdminDashboardReportsAnalyticsHarness as suite1_HarnessScenarioComponent } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/tests/harness/AdminDashboardReportsAnalyticsHarness";
import { AdminDashboardReportsAnalyticsScenarios as suite1_HarnessScenarioList, AdminDashboardReportsAnalyticsScenarioLabel as suite1_scenarioLabel } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/tests/harness/bootstrap";
import { describe as suite1_describe, expect as suite1_expect, it as suite1_it } from "vitest";
import { ADMIN_DASHBOARD_REPORTS_ROUTES as suite1_ADMIN_DASHBOARD_REPORTS_ROUTES } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config";
import { render as suite1_render, screen as suite1_screen, act as suite1_act, renderHook as suite1_renderHook } from "@testing-library/react";
import suite1_AdminDashboardReportsAnalyticsPageHeaderSection from "@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPageHeaderSection";
import { existsSync as suite1_existsSync, readFileSync as suite1_readFileSync } from "node:fs";
import { fileURLToPath as suite1_fileURLToPath } from "node:url";
import suite1_path from "node:path";
import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_QUERY_KEYS as suite1_ADMIN_DASHBOARD_REPORTS_ANALYTICS_QUERY_KEYS } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/api/admin_dashboard_reports.query_keys";
import { ADMIN_ROUTES as suite1_ADMIN_ROUTES } from "@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes";
import { serializeReportsLibraryCatalogCsv as suite1_serializeReportsLibraryCatalogCsv } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters";
import { ADMIN_DASHBOARD_REPORTS_FIXTURES as suite1_ADMIN_DASHBOARD_REPORTS_FIXTURES } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/AdminDashboardReportsFixtures";
import suite1_useAdminDashboardReportsAnalyticsViewState from "@/app/frontend_admin/admin_dashboard/dashboard_reports/hooks/useAdminDashboardReportsAnalyticsViewState";
import { describe as suite2_describe, expect as suite2_expect, it as suite2_it, vi as suite2_vi } from "vitest";
import { render as suite2_render, screen as suite2_screen, fireEvent as suite2_fireEvent } from "@testing-library/react";
import { NextIntlClientProvider as suite2_NextIntlClientProvider } from "next-intl";
import type { AdminDashboardReportsAnalyticsRange as suite2_AdminDashboardReportsAnalyticsRange } from "@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes";
import suite2_messages from "@/app/frontend_admin/admin_dashboard/dashboard_reports/locales/admin_dashboard_reports_en.json";
import suite2_AdminDashboardReportsAnalyticsPageHeaderSection from "@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPageHeaderSection";
import type { ComponentProps as suite2_ComponentProps } from "react";
import suite2_AdminDashboardReportsAnalyticsToolbar from "@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPageHeaderSection";
import { afterEach as suite3_afterEach, describe as suite3_describe, expect as suite3_expect, it as suite3_it, vi as suite3_vi } from "vitest";
import { fireEvent as suite3_fireEvent, render as suite3_render, screen as suite3_screen, waitFor as suite3_waitFor } from "@testing-library/react";
import { NextIntlClientProvider as suite3_NextIntlClientProvider } from "next-intl";
import suite3_AdminDashboardReportsPage from "@/app/frontend_admin/admin_dashboard/dashboard_reports/page";
import suite3_pageMessages from "@/app/frontend_admin/admin_dashboard/dashboard_reports/locales/admin_dashboard_reports_en.json";

import { vi } from "vitest";

const suite0_jsonFixture = {
  "kpis": [
    {
      "label": "Total Revenue This Month",
      "amountMinor": 15200000,
      "count": null,
      "trend": {
        "value": "12% vs last month",
        "up": true
      },
      "sub": "Gross fees collected",
      "valueKind": "currency"
    },
    {
      "label": "Total Expenses",
      "amountMinor": 4650000,
      "count": null,
      "trend": {
        "value": "4% vs last month",
        "up": false
      },
      "sub": "Rent + Utilities + Staff",
      "valueKind": "currency"
    },
    {
      "label": "Net Profit",
      "amountMinor": 10550000,
      "count": null,
      "trend": {
        "value": "18% vs last month",
        "up": true
      },
      "sub": "Revenue minus expenses",
      "valueKind": "currency"
    },
    {
      "label": "Active Students",
      "amountMinor": null,
      "count": 1248,
      "trend": {
        "value": "8% vs last month",
        "up": true
      },
      "sub": "Currently enrolled",
      "valueKind": "count"
    }
  ],
  "incomeVsExpense": {
    "thisMonth": [
      {
        "month": "W1",
        "incomeMinor": 3500000,
        "expenseMinor": 1050000
      },
      {
        "month": "W2",
        "incomeMinor": 3700000,
        "expenseMinor": 1100000
      },
      {
        "month": "W3",
        "incomeMinor": 3900000,
        "expenseMinor": 1200000
      },
      {
        "month": "W4",
        "incomeMinor": 4100000,
        "expenseMinor": 1300000
      }
    ],
    "last3Months": [
      {
        "month": "Apr",
        "incomeMinor": 12500000,
        "expenseMinor": 4400000
      },
      {
        "month": "May",
        "incomeMinor": 14000000,
        "expenseMinor": 3900000
      },
      {
        "month": "Jun",
        "incomeMinor": 15200000,
        "expenseMinor": 4250000
      }
    ],
    "thisYear": [
      {
        "month": "Jan",
        "incomeMinor": 11800000,
        "expenseMinor": 3800000
      },
      {
        "month": "Feb",
        "incomeMinor": 10500000,
        "expenseMinor": 4100000
      },
      {
        "month": "Mar",
        "incomeMinor": 13200000,
        "expenseMinor": 3500000
      },
      {
        "month": "Apr",
        "incomeMinor": 12500000,
        "expenseMinor": 4400000
      },
      {
        "month": "May",
        "incomeMinor": 14000000,
        "expenseMinor": 3900000
      },
      {
        "month": "Jun",
        "incomeMinor": 15200000,
        "expenseMinor": 4250000
      },
      {
        "month": "Jul",
        "incomeMinor": 14800000,
        "expenseMinor": 4000000
      },
      {
        "month": "Aug",
        "incomeMinor": 16000000,
        "expenseMinor": 4300000
      },
      {
        "month": "Sep",
        "incomeMinor": 15500000,
        "expenseMinor": 4150000
      },
      {
        "month": "Oct",
        "incomeMinor": 16200000,
        "expenseMinor": 4400000
      },
      {
        "month": "Nov",
        "incomeMinor": 17000000,
        "expenseMinor": 4600000
      },
      {
        "month": "Dec",
        "incomeMinor": 17800000,
        "expenseMinor": 4800000
      }
    ]
  },
  "shiftOccupancy": [
    {
      "name": "Morning",
      "value": 85,
      "token": "chart-primary"
    },
    {
      "name": "Evening",
      "value": 90,
      "token": "chart-success"
    },
    {
      "name": "Night",
      "value": 70,
      "token": "chart-warning"
    },
    {
      "name": "Full Day",
      "value": 95,
      "token": "chart-info"
    }
  ],
  "revenueTrend": {
    "thisMonth": [
      {
        "month": "W1",
        "revenueMinor": 3500000
      },
      {
        "month": "W2",
        "revenueMinor": 3700000
      },
      {
        "month": "W3",
        "revenueMinor": 3900000
      },
      {
        "month": "W4",
        "revenueMinor": 4100000
      }
    ],
    "last3Months": [
      {
        "month": "Apr",
        "revenueMinor": 12500000
      },
      {
        "month": "May",
        "revenueMinor": 14000000
      },
      {
        "month": "Jun",
        "revenueMinor": 15200000
      }
    ],
    "thisYear": [
      {
        "month": "Jan",
        "revenueMinor": 11800000
      },
      {
        "month": "Feb",
        "revenueMinor": 10500000
      },
      {
        "month": "Mar",
        "revenueMinor": 13200000
      },
      {
        "month": "Apr",
        "revenueMinor": 12500000
      },
      {
        "month": "May",
        "revenueMinor": 14000000
      },
      {
        "month": "Jun",
        "revenueMinor": 15200000
      },
      {
        "month": "Jul",
        "revenueMinor": 14800000
      },
      {
        "month": "Aug",
        "revenueMinor": 16000000
      },
      {
        "month": "Sep",
        "revenueMinor": 15500000
      },
      {
        "month": "Oct",
        "revenueMinor": 16200000
      },
      {
        "month": "Nov",
        "revenueMinor": 17000000
      },
      {
        "month": "Dec",
        "revenueMinor": 17800000
      }
    ]
  },
  "studentGrowth": {
    "thisMonth": [
      {
        "month": "W1",
        "joined": 14,
        "exited": 3
      },
      {
        "month": "W2",
        "joined": 16,
        "exited": 2
      },
      {
        "month": "W3",
        "joined": 18,
        "exited": 3
      },
      {
        "month": "W4",
        "joined": 17,
        "exited": 2
      }
    ],
    "last3Months": [
      {
        "month": "Apr",
        "joined": 48,
        "exited": 10
      },
      {
        "month": "May",
        "joined": 60,
        "exited": 9
      },
      {
        "month": "Jun",
        "joined": 72,
        "exited": 11
      }
    ],
    "thisYear": [
      {
        "month": "Jan",
        "joined": 42,
        "exited": 8
      },
      {
        "month": "Feb",
        "joined": 38,
        "exited": 12
      },
      {
        "month": "Mar",
        "joined": 55,
        "exited": 7
      },
      {
        "month": "Apr",
        "joined": 48,
        "exited": 10
      },
      {
        "month": "May",
        "joined": 60,
        "exited": 9
      },
      {
        "month": "Jun",
        "joined": 72,
        "exited": 11
      },
      {
        "month": "Jul",
        "joined": 65,
        "exited": 8
      },
      {
        "month": "Aug",
        "joined": 80,
        "exited": 14
      },
      {
        "month": "Sep",
        "joined": 74,
        "exited": 10
      },
      {
        "month": "Oct",
        "joined": 88,
        "exited": 13
      },
      {
        "month": "Nov",
        "joined": 92,
        "exited": 15
      },
      {
        "month": "Dec",
        "joined": 78,
        "exited": 9
      }
    ]
  },
  "branchSummary": [
    {
      "branch": "Main Branch",
      "revenueMinor": 6200000,
      "expenseMinor": 1800000,
      "students": 248,
      "occupancy": 92
    },
    {
      "branch": "Branch 2",
      "revenueMinor": 4800000,
      "expenseMinor": 1450000,
      "students": 180,
      "occupancy": 85
    },
    {
      "branch": "Kothrud Center",
      "revenueMinor": 2800000,
      "expenseMinor": 900000,
      "students": 95,
      "occupancy": 78
    },
    {
      "branch": "Nashik Branch",
      "revenueMinor": 1400000,
      "expenseMinor": 500000,
      "students": 42,
      "occupancy": 60
    }
  ]
} as const;


const suite3_toastMocks = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("sonner", () => ({ default: { success: suite3_toastMocks.success, error: suite3_toastMocks.error } }));
vi.mock("next/dynamic", () => ({ default: () => () => <div data-testid="admin-reports-dynamic-chart" /> }));
vi.mock("@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPanel", () => ({
  default: () => <section data-testid="dashboard-reports-analytics-view">Analytics view content</section>,
}));

const suite3_originalCreateObjectURL = Object.getOwnPropertyDescriptor(URL, "createObjectURL");
const suite3_originalRevokeObjectURL = Object.getOwnPropertyDescriptor(URL, "revokeObjectURL");
suite3_afterEach(() => {
  suite3_vi.useRealTimers();
  suite3_vi.restoreAllMocks();
  suite3_toastMocks.success.mockClear();
  suite3_toastMocks.error.mockClear();
  if (suite3_originalCreateObjectURL) Object.defineProperty(URL, "createObjectURL", suite3_originalCreateObjectURL);
  else Reflect.deleteProperty(URL, "createObjectURL");
  if (suite3_originalRevokeObjectURL) Object.defineProperty(URL, "revokeObjectURL", suite3_originalRevokeObjectURL);
  else Reflect.deleteProperty(URL, "revokeObjectURL");
});


describe("Consolidated from AdminDashboardReportsApiAndFixturesRegression.test.tsx", () => {


















suite0_describe('Original suite: AdminDashboardReportsAnalyticsApi.test.ts', () => {
  suite0_describe('fetchAdminDashboardReportsAnalytics frontend API contract boundary', () => {
    suite0_afterEach(() => suite0_vi.unstubAllEnvs());

    suite0_it('accepts an empty list under the shared API envelope without inventing records', async () => {
      suite0_vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
      suite0_mswTestServer.use(...suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_MSW_HANDLERS);
      await suite0_expect(suite0_fetchAdminDashboardReportsAnalytics()).resolves.toEqual([]);
    });


    suite0_it.each(['SERVER_500', 'UNAUTHORIZED'] as const)('uses the %s transport scenario to reject safely', async (scenario) => {
      suite0_vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
      suite0_mswTestServer.use(...suite0_createAdminDashboardReportsAnalyticsHandlers(scenario));
      await suite0_expect(suite0_fetchAdminDashboardReportsAnalytics()).rejects.toThrow();
    });

    suite0_it('models a network timeout as a transport failure, not an empty report list', async () => {
      suite0_vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
      suite0_mswTestServer.use(...suite0_createAdminDashboardReportsAnalyticsHandlers('TIMEOUT'));
      await suite0_expect(suite0_fetchAdminDashboardReportsAnalytics()).rejects.toThrow();
    });

    suite0_it('rejects a response shape that contradicts the current frontend schema', async () => {
      suite0_vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
      suite0_mswTestServer.use(suite0_http.get(suite0_ADMIN_DASHBOARD_REPORTS_API.LIST, () => suite0_HttpResponse.json({
        success: true,
        message: 'Malformed test response.',
        data: { records: [] },
        requestId: 'test-dashboard-reports-malformed',
      })));
      await suite0_expect(suite0_fetchAdminDashboardReportsAnalytics()).rejects.toThrow();
    });
  });
});


suite0_describe('Original suite: AdminDashboardReportsAnalyticsBranchSummary.test.tsx', () => {
  suite0_describe('Admin Reports branch summary responsive and localized output', () => {
    suite0_it('keeps a desktop table and exposes all branch metrics in mobile cards', () => {
      const { container } = suite0_render(<suite0_NextIntlClientProvider locale="en" messages={suite0_adminDashboardReportsAnalyticsEn}><suite0_AdminDashboardReportsAnalyticsSecondaryInsightsSection data={suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE} range="thisMonth" branches={suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.branchSummary} locale="en" /></suite0_NextIntlClientProvider>);
      suite0_expect(suite0_screen.getByRole('table')).toBeTruthy();
      suite0_expect(container.querySelector('.md\\:hidden')?.querySelectorAll('article').length).toBe(4);
      suite0_expect(suite0_screen.getAllByText('Main Branch').length).toBeGreaterThan(0);
      suite0_expect(suite0_screen.getAllByText('Occupancy').length).toBeGreaterThan(0);
    });

    suite0_it('uses the active locale for student and occupancy counts', () => {
      suite0_render(<suite0_NextIntlClientProvider locale="hi" messages={suite0_adminDashboardReportsAnalyticsHi}><suite0_AdminDashboardReportsAnalyticsSecondaryInsightsSection data={suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE} range="thisMonth" branches={suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.branchSummary} locale="hi" /></suite0_NextIntlClientProvider>);
      suite0_expect(suite0_screen.getAllByText('छात्र').length).toBeGreaterThan(0);
      suite0_expect(suite0_screen.getAllByText('अधिभोग').length).toBeGreaterThan(0);
    });
  });
});


suite0_describe('Original suite: AdminDashboardReportsAnalyticsExportUtils.test.ts', () => {
  suite0_describe('Admin Reports CSV export', () => {
    suite0_it('exports KPI and branch snapshots with explicit units', () => {
      const csv = suite0_buildAdminDashboardReportsAnalyticsCsv(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.kpis, suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.branchSummary, suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.currencyCode);
      suite0_expect(csv).toContain('"Section","Branch","Metric","Value","Unit"');
      suite0_expect(csv).toContain('"KPI Snapshot","","Total Revenue This Month","152000","INR"');
      suite0_expect(csv).toContain('"Branch Snapshot","Main Branch","Revenue","62000","INR"');
    });

    suite0_it('rejects invalid or fractional minor-unit values instead of showing zero', () => {
      for (const invalid of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
        suite0_expect(() => suite0_adminDashboardReportsAnalyticsMinorToMajor(invalid)).toThrow(RangeError);
      }
      suite0_expect(suite0_adminDashboardReportsAnalyticsMinorToMajor(0)).toBe(0);
      suite0_expect(suite0_adminDashboardReportsAnalyticsMinorToMajor(-100)).toBe(-1);
    });

    suite0_it('uses the currency-specific minor-unit scale for exports and display', () => {
      suite0_expect(suite0_adminDashboardReportsAnalyticsMinorToMajor(1234, 'JPY', 'en-US')).toBe(1234);
      suite0_expect(suite0_adminDashboardReportsAnalyticsMinorToMajor(1234, 'BHD', 'en-US')).toBe(1.234);
      suite0_expect(suite0_adminDashboardReportsAnalyticsFormatCurrency(1234, 'en', 'JPY')).toContain('1,234');
    });

    suite0_it('neutralizes spreadsheet formulas in user-controlled branch labels', () => {
      const branch = { ...suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.branchSummary[0]!, branch: '=1+1' };
      const csv = suite0_buildAdminDashboardReportsAnalyticsCsv([], [branch], 'INR');
      suite0_expect(csv).toContain("\"Branch Snapshot\",\"'=1+1\",\"Revenue\"");
    });

    suite0_it('preserves negative numeric metrics as numeric values instead of prefixing a text escape', () => {
      const branch = { ...suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.branchSummary[0]!, revenueMinor: 0, expenseMinor: 12500 };
      const csv = suite0_buildAdminDashboardReportsAnalyticsCsv([], [branch], 'INR');
      suite0_expect(csv).toContain('"Branch Snapshot","Main Branch","Net Profit","-125","INR"');
    });
  });


  suite0_describe('Admin Reports locale-aware number formatting', () => {
    suite0_it('uses the requested locale for non-currency counts', async () => {
      const { adminDashboardReportsAnalyticsFormatNumber } = await import('@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters');
      suite0_expect(adminDashboardReportsAnalyticsFormatNumber(12345, 'en')).toContain('12,345');
      suite0_expect(adminDashboardReportsAnalyticsFormatNumber(12345, 'hi')).not.toBe('12345');
      suite0_expect(adminDashboardReportsAnalyticsFormatNumber(Number.NaN, 'en')).toBe('—');
    });
  });
});


suite0_describe('Original suite: AdminDashboardReportsAnalyticsFixtures.test.ts', () => {
  suite0_describe('AdminDashboardReportsAnalytics fixture contract', () => {
    suite0_it('keeps the JSON fixture identical to the typed fixture and canonical shape', () => {
      suite0_expect(suite0_jsonFixture as suite0_AdminDashboardReportsAnalyticsDataset).toEqual(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE);
    });

    suite0_it('uses integer minor units for currency-bearing values', () => {
      for (const kpi of suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.kpis) {
        if (kpi.amountMinor !== null) {
          suite0_expect(Number.isInteger(kpi.amountMinor)).toBe(true);
        }
      }
      for (const item of suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.branchSummary) {
        suite0_expect(Number.isInteger(item.revenueMinor)).toBe(true);
        suite0_expect(Number.isInteger(item.expenseMinor)).toBe(true);
      }
    });

    suite0_it('reconciles KPI aggregates with the branch summary totals', () => {
      const revenue = suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.branchSummary.reduce((sum, row) => sum + row.revenueMinor, 0);
      const expenses = suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.branchSummary.reduce((sum, row) => sum + row.expenseMinor, 0);
      const revenueKpi = suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.kpis.find((item) => item.label === 'Total Revenue This Month');
      const expenseKpi = suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.kpis.find((item) => item.label === 'Total Expenses');
      const profitKpi = suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.kpis.find((item) => item.label === 'Net Profit');
      suite0_expect(revenueKpi?.amountMinor).toBe(revenue);
      suite0_expect(expenseKpi?.amountMinor).toBe(expenses);
      suite0_expect(profitKpi?.amountMinor).toBe(revenue - expenses);
    });

    suite0_it('keeps chart buckets aligned to each selected report range', () => {
      suite0_expect(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.incomeVsExpense.thisMonth.map((p) => p.month)).toEqual(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.revenueTrend.thisMonth.map((p) => p.month));
      suite0_expect(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.incomeVsExpense.thisMonth.map((p) => p.month)).toEqual(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.studentGrowth.thisMonth.map((p) => p.month));
      suite0_expect(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.incomeVsExpense.last3Months.map((p) => p.month)).toEqual(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.revenueTrend.last3Months.map((p) => p.month));
      suite0_expect(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.incomeVsExpense.last3Months.map((p) => p.month)).toEqual(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.studentGrowth.last3Months.map((p) => p.month));
      suite0_expect(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.revenueTrend.thisYear).toHaveLength(12);
      suite0_expect(suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.studentGrowth.thisYear).toHaveLength(12);
    });

    suite0_it('uses only documented semantic chart tokens', () => {
      const allowed = new Set(['chart-primary', 'chart-success', 'chart-warning', 'chart-info', 'chart-danger', 'chart-secondary']);
      for (const item of suite0_ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE.shiftOccupancy) {
        suite0_expect(allowed.has(item.token)).toBe(true);
      }
    });
  });
});

});


describe("Consolidated from AdminDashboardReportsContractStateRegression.test.tsx", () => {

















suite1_describe('Original suite: AdminDashboardReportsContract.test.ts', () => {
  const here = suite1_path.dirname(suite1_fileURLToPath(import.meta.url));
  const read = (relativePath: string) => {
    const requested = suite1_path.join(here, relativePath);
    const candidate = [requested, `${requested}.tsx`, `${requested}.ts`, `${requested}.json`].find(suite1_existsSync);
    if (!candidate) throw new Error(`Expected source contract file at ${relativePath}.`);
    return suite1_readFileSync(candidate, 'utf8');
  };

  suite1_describe('canonical dashboard reports contract', () => {
    suite1_it('keeps analytics sample metrics out of non-demo mode and labels pending live data', () => {
      const analytics = read('../components/AdminDashboardReportsAnalyticsPanel');
      const headerSection = read('../components/AdminDashboardReportsAnalyticsPageHeaderSection');
      const library = read('../page');
      suite1_expect(analytics).toContain('isFrontendDemoModeEnabled');
      suite1_expect(analytics).toContain('useAdminDashboardReportsAnalyticsViewState(isDemoMode)');
      suite1_expect(headerSection).toContain('LIVE_UNAVAILABLE_BANNER');
      suite1_expect(library).toContain('REPORTS_DATA_PENDING');
      suite1_expect(library).not.toContain('admin_reports_main');
    });

    suite1_it('uses the canonical dashboard reports URL and an isolated query-key namespace', () => {
      const canonicalRoute = '/admin/admin_dashboard/dashboard_reports';
      suite1_expect(suite1_ADMIN_DASHBOARD_REPORTS_ROUTES.ROOT).toBe(canonicalRoute);
      suite1_expect(suite1_ADMIN_DASHBOARD_REPORTS_ROUTES.ROOT).toBe(canonicalRoute);
      suite1_expect(suite1_ADMIN_ROUTES.DASHBOARD_REPORTS).toBe(canonicalRoute);
      suite1_expect(read('../../layout')).toContain('ADMIN_ROUTES.DASHBOARD_REPORTS');
      suite1_expect(suite1_ADMIN_DASHBOARD_REPORTS_ANALYTICS_QUERY_KEYS.all).toEqual(['admin_dashboard_reports']);
      suite1_expect(suite1_ADMIN_DASHBOARD_REPORTS_ANALYTICS_QUERY_KEYS.list({ branch: 'Main Branch' })).toEqual([
        'admin_dashboard_reports',
        'list',
        { branch: 'Main Branch' },
      ]);
    });

    suite1_it('offers analytics and library views on a single canonical route with no retired URL link', () => {
      const page = read('../page');
      const library = read('../page');
      suite1_expect(page).toContain("'analytics' | 'library'");
      suite1_expect(page).toContain('AdminDashboardReportsAnalyticsPanel');
      suite1_expect(page).toContain('AdminDashboardReportsLibrary');
      suite1_expect(library).not.toContain('REPORTS_LEGACY_LINK');
      suite1_expect(library).not.toContain('/admin/admin_dashboard/dashboard_reports/admin_reports_main');
    });
  });
});


suite1_describe('Original suite: AdminDashboardReportsExport.test.ts', () => {
  suite1_describe('Reports Library catalog export', () => {
    suite1_it('exports only local catalog metadata and marks report data unavailable', () => {
      const csv = suite1_serializeReportsLibraryCatalogCsv(suite1_ADMIN_DASHBOARD_REPORTS_FIXTURES);
      suite1_expect(csv).toContain('data_status');
      suite1_expect(csv).toContain('contract_pending');
      suite1_expect(csv).toContain('false');
      suite1_expect(csv).not.toContain('revenue');
    });
    suite1_it('escapes embedded CSV quotes', () => {
      const firstFixture = suite1_ADMIN_DASHBOARD_REPORTS_FIXTURES[0];
      if (!firstFixture) throw new Error('Expected at least one report catalog fixture.');
      const csv = suite1_serializeReportsLibraryCatalogCsv([{ ...firstFixture, id: 'title"test' }]);
      suite1_expect(csv).toContain('title""test');
    });
  });
});


suite1_describe('Original suite: useAdminDashboardReportsAnalyticsViewState.test.tsx', () => {
  suite1_describe('useAdminDashboardReportsAnalyticsViewState', () => {
    suite1_it('exposes demo fixture branches and supports range/branch selection', () => {
      const { result } = suite1_renderHook(() => suite1_useAdminDashboardReportsAnalyticsViewState(true));
      suite1_expect(result.current.data.branchSummary.length).toBeGreaterThan(0);
      suite1_act(() => result.current.setRange('thisYear'));
      suite1_expect(result.current.range).toBe('thisYear');
      const firstBranch = result.current.branchOptions[0];
      if (firstBranch) {
        suite1_act(() => result.current.setBranch(firstBranch));
        suite1_expect(result.current.filteredBranches.every((branch) => branch.branch === firstBranch)).toBe(true);
      }
    });
    suite1_it('does not expose demo data as live results when demo mode is disabled', () => {
      const { result } = suite1_renderHook(() => suite1_useAdminDashboardReportsAnalyticsViewState(false));
      suite1_expect(result.current.data.branchSummary).toEqual([]);
      suite1_expect(result.current.branchOptions).toEqual([]);
    });
  });
});


// Standalone harness scenario coverage (merged without changing assertions).
suite1_HarnessVitest.describe('dashboard reports analytics harness scenarios', () => {
  suite1_HarnessVitest.it('renders active feature content', () => {
    suite1_HarnessTestingLibrary.render(<suite1_HarnessScenarioComponent scenario="ACTIVE_RECORDS"><p>Active report analytics</p></suite1_HarnessScenarioComponent>);
    suite1_HarnessVitest.expect(suite1_HarnessTestingLibrary.screen.getByText('Active report analytics')).toBeTruthy();
  });
  suite1_HarnessVitest.it.each(suite1_HarnessScenarioList.filter((scenario) => scenario !== 'ACTIVE_RECORDS'))('renders the visible %s state', (scenario) => {
    suite1_HarnessTestingLibrary.render(<suite1_HarnessScenarioComponent scenario={scenario}><p>Must not be visible in a non-active state</p></suite1_HarnessScenarioComponent>);
    suite1_HarnessVitest.expect(suite1_HarnessTestingLibrary.screen.queryByText('Must not be visible in a non-active state')).toBeNull();
    suite1_HarnessVitest.expect(suite1_HarnessTestingLibrary.screen.getByTestId('admin_dashboard_reports_analytics-harness').getAttribute('data-scenario')).toBe(suite1_scenarioLabel(scenario));
    suite1_HarnessVitest.expect(suite1_HarnessTestingLibrary.screen.getByRole(scenario === 'EMPTY_DATA' ? 'status' : 'alert')).toBeTruthy();
  });
});

});


describe("Consolidated from AdminDashboardReportsVisualRegression.test.tsx", () => {









suite2_describe('Original suite: AdminDashboardReportsAnalyticsPageHeaderSection.test.tsx', () => {
  function renderHeader(isDemoMode: boolean) {
    suite2_render(
      <suite2_NextIntlClientProvider locale="en" messages={suite2_messages}>
        <suite2_AdminDashboardReportsAnalyticsPageHeaderSection
          range="last3Months"
          onRangeChange={suite2_vi.fn()}
          branch="All Branches"
          branchOptions={[]}
          onBranchChange={suite2_vi.fn()}
          isDemoMode={isDemoMode}
          onPrint={suite2_vi.fn()}
          onExportCsv={suite2_vi.fn()}
        />
      </suite2_NextIntlClientProvider>,
    );
  }

  suite2_describe('AdminDashboardReportsAnalyticsPageHeaderSection', () => {
    suite2_it('labels synthetic figures as demo data', () => {
      renderHeader(true);
      suite2_expect(suite2_screen.getByRole('status')).toHaveTextContent(
        'Demo mode: all figures and charts are sample data, not live business results.',
      );
    });

    suite2_it('explains why live figures are unavailable without a verified reports DTO', () => {
      renderHeader(false);
      suite2_expect(suite2_screen.getByRole('status')).toHaveTextContent(
        'Live report data is unavailable: the supplied scope does not define a complete reports DTO. Sample data is not shown outside demo mode.',
      );
    });
  });
});


suite2_describe('Original suite: AdminDashboardReportsAnalyticsToolbar.test.tsx', () => {
  function renderReportsToolbar(overrides: Partial<suite2_ComponentProps<typeof suite2_AdminDashboardReportsAnalyticsToolbar>> = {}) {
    const onRangeChange = suite2_vi.fn<(range: suite2_AdminDashboardReportsAnalyticsRange) => void>();
    const onBranchChange = suite2_vi.fn<(branch: string) => void>();
    const onPrint = suite2_vi.fn();
    const onExportCsv = suite2_vi.fn();
    const props: suite2_ComponentProps<typeof suite2_AdminDashboardReportsAnalyticsToolbar> = {
      range: 'last3Months', onRangeChange, branch: 'All Branches', branchOptions: ['Main Branch', 'Branch 2'],
      onBranchChange, isDemoMode: true, onPrint, onExportCsv, ...overrides,
    };
    suite2_render(<suite2_NextIntlClientProvider locale="en" messages={suite2_messages}><suite2_AdminDashboardReportsAnalyticsToolbar {...props} /></suite2_NextIntlClientProvider>);
    return { onRangeChange, onBranchChange, onPrint, onExportCsv };
  }

  suite2_describe('Admin Reports toolbar', () => {
    suite2_it('changes range with keyboard navigation and keeps the selected tab semantic', () => {
      const { onRangeChange } = renderReportsToolbar();
      const tablist = suite2_screen.getByRole('tablist', { name: 'Report date range' });
      suite2_fireEvent.keyDown(tablist, { key: 'End' });
      suite2_expect(onRangeChange).toHaveBeenCalledWith('thisYear');
      suite2_expect(document.activeElement).toBe(suite2_screen.getByRole('tab', { name: 'This year' }));
    });

    suite2_it('forwards branch, print, and CSV actions to the owning page', () => {
      const { onBranchChange, onPrint, onExportCsv } = renderReportsToolbar();
      suite2_fireEvent.change(suite2_screen.getByRole('combobox', { name: 'Filter by branch' }), { target: { value: 'Branch 2' } });
      suite2_fireEvent.click(suite2_screen.getByRole('button', { name: 'Print / Save PDF' }));
      suite2_fireEvent.click(suite2_screen.getByRole('button', { name: 'Export CSV' }));
      suite2_expect(onBranchChange).toHaveBeenCalledWith('Branch 2');
      suite2_expect(onPrint).toHaveBeenCalledOnce();
      suite2_expect(onExportCsv).toHaveBeenCalledOnce();
    });

    suite2_it('disables data-dependent controls outside demo mode', () => {
      renderReportsToolbar({ isDemoMode: false });
      suite2_expect((suite2_screen.getByRole('tab', { name: 'Last 3 months' }) as HTMLButtonElement).disabled).toBe(true);
      suite2_expect((suite2_screen.getByRole('combobox', { name: 'Filter by branch' }) as HTMLSelectElement).disabled).toBe(true);
      suite2_expect((suite2_screen.getByRole('button', { name: 'Export CSV' }) as HTMLButtonElement).disabled).toBe(true);
    });
  });
});

});



suite3_describe("Reports route and metadata library interactions", () => {
  function renderReportsPage() {
    return suite3_render(<suite3_NextIntlClientProvider locale="en" messages={suite3_pageMessages}><suite3_AdminDashboardReportsPage /></suite3_NextIntlClientProvider>);
  }

  suite3_it("switches between analytics and the report library without changing the page route", () => {
    renderReportsPage();
    const analyticsButton = suite3_screen.getByRole("button", { name: "Analytics" });
    const libraryButton = suite3_screen.getByRole("button", { name: "Report library" });
    suite3_expect(analyticsButton).toHaveAttribute("aria-pressed", "true");
    suite3_expect(libraryButton).toHaveAttribute("aria-pressed", "false");
    suite3_expect(suite3_screen.getByTestId("dashboard-reports-analytics-view")).toBeVisible();
    suite3_fireEvent.click(libraryButton);
    suite3_expect(libraryButton).toHaveAttribute("aria-pressed", "true");
    suite3_expect(analyticsButton).toHaveAttribute("aria-pressed", "false");
    suite3_expect(suite3_screen.getByRole("searchbox", { name: "Search reports" })).toBeVisible();
    suite3_expect(suite3_screen.getByText("Member directory summary")).toBeVisible();
    suite3_expect(suite3_screen.queryByTestId("dashboard-reports-analytics-view")).not.toBeInTheDocument();
    suite3_fireEvent.click(analyticsButton);
    suite3_expect(suite3_screen.getByTestId("dashboard-reports-analytics-view")).toBeVisible();
  });

  suite3_it("filters the metadata catalog and exposes a recoverable no-results state", async () => {
    renderReportsPage();
    suite3_fireEvent.click(suite3_screen.getByRole("button", { name: "Report library" }));
    const search = suite3_screen.getByRole("searchbox", { name: "Search reports" });
    suite3_expect(suite3_screen.getByText("Member directory summary")).toBeVisible();
    suite3_fireEvent.change(search, { target: { value: "Finance" } });
    await suite3_waitFor(() => suite3_expect(suite3_screen.getByText("Finance summary")).toBeVisible());
    suite3_expect(suite3_screen.queryByText("Member directory summary")).not.toBeInTheDocument();
    suite3_fireEvent.change(search, { target: { value: "not-a-report-category" } });
    await suite3_waitFor(() => suite3_expect(suite3_screen.getByRole("status")).toHaveTextContent("No reports match your search."));
    suite3_fireEvent.change(search, { target: { value: "" } });
    await suite3_waitFor(() => suite3_expect(suite3_screen.getByText("Member directory summary")).toBeVisible());
  });

  suite3_it("downloads a metadata-only CSV and reports successful dispatch", () => {
    suite3_vi.useFakeTimers();
    const createObjectURL = suite3_vi.fn(() => "blob:reports-library-catalog");
    Object.defineProperty(URL, "createObjectURL", { configurable: true, writable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, writable: true, value: suite3_vi.fn() });
    let downloadedFilename = "";
    suite3_vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function click(this: HTMLAnchorElement) {
      downloadedFilename = this.download;
    });
    renderReportsPage();
    suite3_fireEvent.click(suite3_screen.getByRole("button", { name: "Report library" }));
    suite3_fireEvent.click(suite3_screen.getByRole("button", { name: "Export catalog CSV" }));
    suite3_vi.runOnlyPendingTimers();
    suite3_expect(createObjectURL).toHaveBeenCalledOnce();
    suite3_expect(downloadedFilename).toBe("reports-library-catalog.csv");
    suite3_expect(suite3_toastMocks.success).toHaveBeenCalledOnce();
    suite3_expect(suite3_toastMocks.error).not.toHaveBeenCalled();
  });
});
