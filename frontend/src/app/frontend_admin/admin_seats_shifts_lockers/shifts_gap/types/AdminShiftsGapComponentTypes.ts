import type { AdminShiftsGapScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminShiftsGapHarnessProps {
  children: ReactNode;
  scenario?: AdminShiftsGapScenario;
}
