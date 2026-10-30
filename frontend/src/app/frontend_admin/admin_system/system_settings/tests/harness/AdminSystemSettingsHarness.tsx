import type { ReactNode } from 'react';
import { AdminSystemSettingsScenarioLabel, type AdminSystemSettingsScenario } from '@/app/frontend_admin/admin_system/system_settings/tests/harness/bootstrap';
import type { AdminSystemSettingsHarnessProps } from '@/app/frontend_admin/admin_system/system_settings/types/AdminSystemSettingsComponentTypes';


/** Test-only scenario harness renders accessible state behavior without asserting a live settings contract. */
export function AdminSystemSettingsHarness({ children, scenario = 'ACTIVE' }: AdminSystemSettingsHarnessProps) {
  const label = AdminSystemSettingsScenarioLabel(scenario);
  if (scenario === 'EMPTY') return <section data-testid="admin_system_settings-harness" data-scenario={label} role="status">No settings data is available.</section>;
  if (scenario === 'SERVER_500') return <section data-testid="admin_system_settings-harness" data-scenario={label} role="alert">Settings are temporarily unavailable due to a server error.</section>;
  if (scenario === 'TIMEOUT') return <section data-testid="admin_system_settings-harness" data-scenario={label} role="alert">The settings request timed out. Retry the request.</section>;
  if (scenario === 'UNAUTHORIZED') return <section data-testid="admin_system_settings-harness" data-scenario={label} role="alert">Your session does not permit access to settings.</section>;
  return <div data-testid="admin_system_settings-harness" data-scenario={label}>{children}</div>;
}


export type { AdminSystemSettingsHarnessProps };
