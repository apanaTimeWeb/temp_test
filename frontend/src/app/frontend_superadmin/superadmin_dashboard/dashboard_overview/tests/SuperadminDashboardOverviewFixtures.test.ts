// RESPONSIBILITY: Define source-level test coverage for dashboard overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_dashboard/dashboard_overview/tests/SuperadminDashboardOverviewFixtures.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMIN_DASHBOARD_RECENT_LIBRARIES_TABLE_PLAN_CLS } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewStaticConstants';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_DASHBOARD_FIXTURE, SUPERADMIN_DASHBOARD_RECENT_ACTIVITY_FIXTURE } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/mocks/fixtures/SuperadminDashboardOverviewMockFixtures';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES as __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";

describe('superadmin dashboard sample fixture integrity', () => {
  it('uses unique stable KPI titles and activity IDs', () => {
    const titles = SUPERADMIN_DASHBOARD_FIXTURE.kpiCards.map((card) => card.title);
    const activityIds = SUPERADMIN_DASHBOARD_RECENT_ACTIVITY_FIXTURE.map((item) => item.id);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(activityIds).size).toBe(activityIds.length);
  });

  it('localizes all rendered sample-copy values with module-owned keys', () => {
    expect(SUPERADMIN_DASHBOARD_FIXTURE.kpiCards.every((card) => Boolean(card.titleKey) && Boolean(card.subtitleKey || !card.subtitle) && Boolean(card.alertKey || !card.alert))).toBe(true);
    expect(SUPERADMIN_DASHBOARD_FIXTURE.actionItems.every((item) => Boolean(item.titleKey) && Boolean(item.actionLabelKey))).toBe(true);
    expect(SUPERADMIN_DASHBOARD_RECENT_ACTIVITY_FIXTURE.every((item) => Boolean(item.titleKey) && Boolean(item.descriptionKey) && Boolean(item.timeLabelKey))).toBe(true);
  });

  it('keeps recent activity navigation within known module routes', () => {
    const allowedTargets = new Set<string>(Object.values(__SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.SUPERADMIN_DASHBOARD_OVERVIEW_URLS));
    expect(SUPERADMIN_DASHBOARD_RECENT_ACTIVITY_FIXTURE.every((item) => allowedTargets.has(item.href))).toBe(true);
    expect(SUPERADMIN_DASHBOARD_FIXTURE.actionItems.every((item) => allowedTargets.has(item.actionUrl))).toBe(true);
  });
  it('has an explicit plan visual mapping for every sample fixture tier', () => { expect(new Set(SUPERADMIN_DASHBOARD_FIXTURE.recentLibraries.map((row) => row.plan)).size).toBeGreaterThan(0); for (const row of SUPERADMIN_DASHBOARD_FIXTURE.recentLibraries) expect(SUPERADMIN_DASHBOARD_RECENT_LIBRARIES_TABLE_PLAN_CLS).toHaveProperty(row.plan); });
});
