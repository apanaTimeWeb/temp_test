import type { ReactNode } from 'react';
import { AdminSystemAutoScaleScenarioLabel, type AdminSystemAutoScaleScenario } from '@/app/frontend_admin/admin_system/system_auto_scale/tests/harness/bootstrap';
import type { AdminSystemAutoScaleHarnessProps } from '@/app/frontend_admin/admin_system/system_auto_scale/types/AdminSystemAutoScaleComponentTypes';


/** Test-only wrapper for exercising this submodule under named states. It does not mock or claim a live API contract. */
export function AdminSystemAutoScaleHarness({ children, scenario = 'ACTIVE' }: AdminSystemAutoScaleHarnessProps) {
  return (
    <div data-testid="admin_system_auto_scale-harness" data-scenario={AdminSystemAutoScaleScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminSystemAutoScaleHarnessProps };
