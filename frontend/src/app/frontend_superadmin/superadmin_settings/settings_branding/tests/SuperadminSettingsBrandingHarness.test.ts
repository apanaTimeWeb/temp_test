// RESPONSIBILITY: Define source-level test coverage for settings branding using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_branding/tests/SuperadminSettingsBrandingHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SETTINGS_BRANDING_ROUTES as __SUPERADMIN_SETTINGS_BRANDING_ROUTES } from "@/app/frontend_superadmin/superadmin_settings/settings_branding/config/superadmin_settings_branding.url_config";
import { SUPERADMIN_SETTINGS_BRANDING_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/api/superadmin_settings_branding.query_keys';

describe('settings_branding standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SETTINGS_BRANDING_ROUTES.SUPERADMIN_SYSTEM_BRANDING_URLS.PAGE).toBe('/superadmin/superadmin_settings/settings_branding');
    expect(__SUPERADMIN_SETTINGS_BRANDING_ROUTES.SUPERADMIN_SYSTEM_BRANDING_URLS.SCREEN).toBe("/superadmin/superadmin_settings/settings_branding");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_SETTINGS_BRANDING_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_settings", "settings_branding"]);
  });
});
