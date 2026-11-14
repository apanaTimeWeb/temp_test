// RESPONSIBILITY: Define source-level test coverage for system health overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_health_overview/tests/SuperadminSystemHealthOverviewFixtures.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS, SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE, SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE, SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS, SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures';

describe('superadmin system-health sample fixture integrity', () => {
  it('uses stable unique IDs and bounded illustrative progress values', () => {
    expect(new Set(SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE.map((row) => row.id)).size).toBe(SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE.length);
    expect(new Set(SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE.map((row) => row.id)).size).toBe(SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE.length);
    for (const row of SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE) {
      expect(row.usage).toBeGreaterThanOrEqual(0);
      expect(row.usage).toBeLessThanOrEqual(100);
    }
    for (const row of SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE) {
      expect(row.pct).toBeGreaterThanOrEqual(0);
      expect(row.pct).toBeLessThanOrEqual(100);
    }
  });

  it('never labels unconnected mock integrations or cron jobs as operational', () => {
    expect(SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS.every((row) => row.status === 'Not connected')).toBe(true);
    expect(SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS.every((row) => row.status === 'Not connected' && row.lastRun === 'Not verified')).toBe(true);
  });

  it('keeps stable identities for every network metric and shows sample/illustrative labels', () => {
    expect(new Set(SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS.map((row) => row.id)).size).toBe(SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS.length);
    expect(SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS.every((row) => /sample/i.test(row.label) && /illustrative/i.test(row.trend))).toBe(true);
  });


  it('localizes every displayed fixture label through module-owned keys', () => {
    expect(SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE.every((item) => Boolean(item.nameKey))).toBe(true);
    expect(SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE.every((item) => Boolean(item.nameKey) && Boolean(item.metricKey))).toBe(true);
    expect(SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS.every((item) => Boolean(item.labelKey) && Boolean(item.trendKey))).toBe(true);
    expect(SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS.every((item) => Boolean(item.nameKey) && Boolean(item.statusKey))).toBe(true);
    expect(SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS.every((item) => Boolean(item.nameKey) && Boolean(item.scheduleKey) && Boolean(item.lastRunKey) && Boolean(item.statusKey))).toBe(true);
  });
});
