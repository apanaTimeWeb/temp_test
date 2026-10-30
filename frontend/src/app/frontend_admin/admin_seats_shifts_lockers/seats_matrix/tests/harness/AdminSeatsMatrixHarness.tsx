import type { ReactNode } from 'react';
import { AdminSeatsMatrixScenarioLabel, type AdminSeatsMatrixScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/tests/harness/bootstrap';
import type { AdminSeatsMatrixHarnessProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';


/** Test-only wrapper for exercising this submodule under named states. It does not mock or claim a live API contract. */
export function AdminSeatsMatrixHarness({ children, scenario = 'ACTIVE' }: AdminSeatsMatrixHarnessProps) {
  return (
    <div data-testid="admin_seats_matrix-harness" data-scenario={AdminSeatsMatrixScenarioLabel(scenario)}>
      {children}
    </div>
  );
}


export type { AdminSeatsMatrixHarnessProps };
