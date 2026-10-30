import type { ReactNode } from 'react';
import { AdminNavigationSidebarScenarioLabel, type AdminNavigationSidebarScenario } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/tests/harness/bootstrap';
import type { AdminNavigationSidebarHarnessProps } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/types/AdminNavigationSidebarComponentTypes';


/** Test-only wrapper for exercising this submodule under named states. It does not mock or claim a live API contract. */
export function AdminNavigationSidebarHarness({ children, scenario = 'ACTIVE' }: AdminNavigationSidebarHarnessProps) {
  return (
    <div data-testid="admin_navigation_sidebar-harness" data-scenario={AdminNavigationSidebarScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminNavigationSidebarHarnessProps };
