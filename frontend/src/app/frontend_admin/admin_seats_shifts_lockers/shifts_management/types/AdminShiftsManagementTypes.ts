import type { ReactNode } from 'react';

export type AdminShiftsManagementScenario = 'ACTIVE' | 'EMPTY' | 'SERVER_500' | 'TIMEOUT' | 'UNAUTHORIZED';

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
