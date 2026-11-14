// RESPONSIBILITY: Define source-level test coverage for libraries facility maintenance work orders using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_facility_maintenance_work_orders/tests/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersMockScenarioCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as scenarioCatalog from '../mocks/scenarios/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersfacility_maintenance_work_orders.MockScenarios';
const SUPERADMIN_FACILITY_MAINTENANCE_WORK_ORDERS_CANONICAL_SCENARIOS = scenarioCatalog.SUPERADMIN_FACILITY_MAINTENANCE_WORK_ORDERS_CANONICAL_SCENARIOS;

describe('facility_maintenance_work_orders canonical mock scenario catalog', () => {
  it('declares the required eight scenario states without inventing backend contracts', () => {
    expect(SUPERADMIN_FACILITY_MAINTENANCE_WORK_ORDERS_CANONICAL_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      'ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED', 'LOADING', 'MUTATION_FAILURE', 'UNAVAILABLE_MUTATION',
    ]);
    expect(Object.fromEntries(SUPERADMIN_FACILITY_MAINTENANCE_WORK_ORDERS_CANONICAL_SCENARIOS.map((scenario) => [scenario.id, scenario.executableWithoutBackendContract]))).toEqual({
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


describe('facility maintenance work orders bootstrap and scenario boundary', () => {
  it('executes the harness lifecycle without a re-export facade', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/tests/harness/bootstrap.ts'), 'utf8');
    expect(source).toContain('setupSystemMaintenanceMockServer();');
    expect(source).not.toMatch(/export\s+\*/);
  });

  it('does not export the unreferenced legacy four-state scenario constant', () => {
    expect(scenarioCatalog).not.toHaveProperty('SUPERADMIN_SYSTEM_MAINTENANCE_SCENARIOS');
    expect(scenarioCatalog).toHaveProperty('SUPERADMIN_FACILITY_MAINTENANCE_WORK_ORDERS_CANONICAL_SCENARIOS');
  });
});
