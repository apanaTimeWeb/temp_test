import type { AdminSeatsMatrixScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminSeatMatrixSeatMatrixStatus = 'free' | 'occupied' | 'expiring' | 'maintenance' | 'unknown';
export interface AdminSeatMatrixSeatMatrixViewModel {
  id: string;
  uuid?: string;
  status: AdminSeatMatrixSeatMatrixStatus;
  student?: string;
  smartId?: string;
  phone?: string;
  shift?: string;
  plan?: string;
  locker?: string;
  validFrom?: string;
  expiry?: string;
  branchId?: string;
  branchName?: string;
}

export interface AdminSeatsMatrixHarnessProps {
  children: ReactNode;
  scenario?: AdminSeatsMatrixScenario;
}
