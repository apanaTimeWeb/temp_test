// RESPONSIBILITY: Define source-level test coverage for settings overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_overview/tests/SuperadminSettingsOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SETTINGS_OVERVIEW_ROUTES as __SUPERADMIN_SETTINGS_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_settings/settings_overview/config/superadmin_settings_overview.url_config";
import { SUPERADMIN_SETTINGS_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/api/superadmin_settings_overview.query_keys';

describe('settings_overview standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SETTINGS_OVERVIEW_ROUTES.SUPERADMIN_SETTINGS_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_settings');
    expect(__SUPERADMIN_SETTINGS_OVERVIEW_ROUTES.SUPERADMIN_SETTINGS_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_settings/settings_overview");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_SETTINGS_OVERVIEW_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_settings", "settings_overview"]);
  });
});
