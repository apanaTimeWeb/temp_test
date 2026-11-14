// RESPONSIBILITY: Define source-level test coverage for libraries profile configuration using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_profile_configuration/tests/SuperadminLibrariesProfileConfigurationHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_ROUTES as __SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/config/superadmin_libraries_profile_configuration.url_config";
import { SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/api/superadmin_libraries_profile_configuration.query_keys';
import { SuperadminLibrariesProfileConfigurationSchema } from '../schemas/SuperadminLibrariesProfileConfigurationSchema';

describe('libraries_profile_configuration standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_ROUTES.SUPERADMIN_SYSTEM_PROFILE_URLS.PAGE).toBe('/superadmin/superadmin_libraries/libraries_profile_configuration');
    expect(__SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_ROUTES.SUPERADMIN_SYSTEM_PROFILE_URLS.SCREEN).toBe("/superadmin/superadmin_libraries/libraries_profile_configuration");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_libraries", "libraries_profile_configuration"]);
  });
  it('rejects separator-only phone values and accepts formatted digits', () => {
    const base = { fullName: 'Test Member', email: 'member@example.invalid' };
    expect(SuperadminLibrariesProfileConfigurationSchema.safeParse({ ...base, phone: '-------' }).success).toBe(false);
    expect(SuperadminLibrariesProfileConfigurationSchema.safeParse({ ...base, phone: '+91 (98765) 43210' }).success).toBe(true);
  });
});
