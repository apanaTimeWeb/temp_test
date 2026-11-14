// RESPONSIBILITY: Define source-level test coverage for libraries onboarding setup using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> onboarding setup scenario catalog test -> module-local scenario metadata -> regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_CANONICAL_SCENARIOS } from '../mocks/scenarios/SuperadminLibrariesOnboardingSetuplibraries_onboarding_setup.MockScenarios';

describe('libraries_onboarding_setup canonical mock scenario catalog', () => {
  it('declares the required eight scenario states without inventing backend contracts', () => {
    expect(SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_CANONICAL_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      'ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED', 'LOADING', 'MUTATION_FAILURE', 'UNAVAILABLE_MUTATION',
    ]);
    expect(Object.fromEntries(SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_CANONICAL_SCENARIOS.map((scenario) => [scenario.id, scenario.executableWithoutBackendContract]))).toEqual({
      ACTIVE: true,
      EMPTY: true,
      SERVER_500: false,
      TIMEOUT: false,
      UNAUTHORIZED: false,
      LOADING: true,
      MUTATION_FAILURE: false,
      UNAVAILABLE_MUTATION: true,
    });
  });

  it('does not retain the unreferenced legacy four-state scenario export', () => {
    const source = readFileSync(new URL('../mocks/scenarios/SuperadminLibrariesOnboardingSetuplibraries_onboarding_setup.MockScenarios.ts', import.meta.url), 'utf8');
    expect(source).not.toContain('SUPERADMIN_SETUP_WIZARD_OVERVIEW_SCENARIOS');
  });
});
