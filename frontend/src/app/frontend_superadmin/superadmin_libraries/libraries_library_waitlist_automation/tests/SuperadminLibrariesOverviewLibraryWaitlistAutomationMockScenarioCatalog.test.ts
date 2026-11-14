// RESPONSIBILITY: Define source-level test coverage for libraries library waitlist automation using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> waitlist automation scenario catalog test -> module-local scenario metadata -> regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARY_WAITLIST_AUTOMATION_CANONICAL_SCENARIOS } from '../mocks/scenarios/SuperadminLibrariesOverviewLibraryWaitlistAutomationlibrary_waitlist_automation.MockScenarios';

describe('library_waitlist_automation canonical mock scenario catalog', () => {
  it('declares the required eight scenario states without inventing backend contracts', () => {
    expect(SUPERADMIN_LIBRARY_WAITLIST_AUTOMATION_CANONICAL_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      'ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED', 'LOADING', 'MUTATION_FAILURE', 'UNAVAILABLE_MUTATION',
    ]);
    expect(Object.fromEntries(SUPERADMIN_LIBRARY_WAITLIST_AUTOMATION_CANONICAL_SCENARIOS.map((scenario) => [scenario.id, scenario.executableWithoutBackendContract]))).toEqual({
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
    const source = readFileSync(new URL('../mocks/scenarios/SuperadminLibrariesOverviewLibraryWaitlistAutomationlibrary_waitlist_automation.MockScenarios.ts', import.meta.url), 'utf8');
    expect(source).not.toContain('SUPERADMIN_SYSTEM_WAITLIST_AUTOMATION_SCENARIOS');
  });
});
