// RESPONSIBILITY: Define source-level test coverage for libraries facility asset registry using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_facility_asset_registry/tests/SuperadminLibrariesOverviewFacilityAssetRegistryMockScenarioCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SUPERADMIN_FACILITY_ASSET_REGISTRY_CANONICAL_SCENARIOS } from '../mocks/scenarios/SuperadminLibrariesOverviewFacilityAssetRegistryfacility_asset_registry.MockScenarios';

describe('facility_asset_registry canonical mock scenario catalog', () => {
  it('declares the required eight scenario states without inventing backend contracts', () => {
    expect(SUPERADMIN_FACILITY_ASSET_REGISTRY_CANONICAL_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      'ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED', 'LOADING', 'MUTATION_FAILURE', 'UNAVAILABLE_MUTATION',
    ]);
    expect(Object.fromEntries(SUPERADMIN_FACILITY_ASSET_REGISTRY_CANONICAL_SCENARIOS.map((scenario) => [scenario.id, scenario.executableWithoutBackendContract]))).toEqual({
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


describe('facility asset registry harness bootstrap contract', () => {
  it('executes the leaf workflow bootstrap instead of re-exporting it', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/tests/harness/bootstrap.ts'), 'utf8');
    expect(source).toContain('setupAccountingAssetsMockServer();');
    expect(source).not.toMatch(/export\s+\*/);
  });
});
