import type { ReactNode } from 'react';

export type AdminSeatsMatrixScenario = 'ACTIVE' | 'EMPTY' | 'SERVER_500' | 'TIMEOUT' | 'UNAUTHORIZED';

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
