import type { ReactNode } from 'react';
import { AdminSystemPowerSavingScenarioLabel, type AdminSystemPowerSavingScenario } from '@/app/frontend_admin/admin_system/system_power_saving/tests/harness/bootstrap';
import type { AdminSystemPowerSavingHarnessProps } from '@/app/frontend_admin/admin_system/system_power_saving/types/AdminSystemPowerSavingComponentTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminSystemPowerSavingHarness({ children, scenario = 'ACTIVE' }: AdminSystemPowerSavingHarnessProps) {
  return (
    <div data-testid="admin_system_power_saving-harness" data-scenario={AdminSystemPowerSavingScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_system_power_saving-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_system_power_saving-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_system_power_saving-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_system_power_saving-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminSystemPowerSavingHarnessProps };
