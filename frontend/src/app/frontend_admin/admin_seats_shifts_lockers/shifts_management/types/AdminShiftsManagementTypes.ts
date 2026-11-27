import type { AdminShiftsManagementScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminShiftsShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  occupancy: number;
  capacity: number;
  active: boolean;
  branchName?: string;
  branchId?: string;
  monthlyPrice?: number;
}

export interface AdminShiftsManagementHarnessProps {
  children: ReactNode;
  scenario?: AdminShiftsManagementScenario;
}
