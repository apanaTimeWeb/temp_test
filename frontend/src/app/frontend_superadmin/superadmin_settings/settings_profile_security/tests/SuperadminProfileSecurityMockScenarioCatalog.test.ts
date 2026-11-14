// RESPONSIBILITY: Define source-level test coverage for settings profile security using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_profile_security/tests/SuperadminProfileSecurityMockScenarioCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_PROFILE_SECURITY_CANONICAL_SCENARIOS } from '../mocks/scenarios/SuperadminProfileSecurityChangePasswordMockScenarios';

describe('profile_security canonical mock scenario catalog', () => {
  it('declares the required eight scenario states without inventing backend contracts', () => {
    expect(SUPERADMIN_PROFILE_SECURITY_CANONICAL_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      'ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED', 'LOADING', 'MUTATION_FAILURE', 'UNAVAILABLE_MUTATION',
    ]);
    expect(Object.fromEntries(SUPERADMIN_PROFILE_SECURITY_CANONICAL_SCENARIOS.map((scenario) => [scenario.id, scenario.executableWithoutBackendContract]))).toEqual({
  "ACTIVE": true,
  "EMPTY": true,
  "SERVER_500": false,
  "TIMEOUT": false,
  "UNAUTHORIZED": false,
  "LOADING": true,
  "MUTATION_FAILURE": false,
  "UNAVAILABLE_MUTATION": true
});
  });
});


describe('profile_security rendered data coverage', () => {
  it('keeps rendered login-history fields traceable to the leaf fixture and route configuration', () => {
    const page = readFileSync(new URL('../components/SuperadminProfileSecurityChangePasswordPageClient.tsx', import.meta.url), 'utf8');
    const fixture = readFileSync(new URL('../mocks/fixtures/SuperadminProfileSecurityChangePasswordSecurityMockFixtures.ts', import.meta.url), 'utf8');
    const config = readFileSync(new URL('../constants/SuperadminProfileSecurityChangePasswordStaticConstants.ts', import.meta.url), 'utf8');
    for (const field of ['date', 'ip', 'location', 'browser', 'status']) expect(page).toContain(`field: '${field}'`);
    expect(page).toContain('SUPERADMIN_PROFILE_SAMPLE_LOGIN_HISTORY');
    expect(page).toContain('SUPERADMIN_PROFILE_SAMPLE_SESSIONS');
    expect(fixture).toContain('SUPERADMIN_PROFILE_SAMPLE_LOGIN_HISTORY');
    expect(fixture).toContain('SUPERADMIN_PROFILE_SAMPLE_SESSIONS');
    expect(config).toContain('TAB_ICONS');
  });
});

