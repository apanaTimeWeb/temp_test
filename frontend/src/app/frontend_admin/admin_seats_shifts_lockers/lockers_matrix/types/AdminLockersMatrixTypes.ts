import type { AdminLockersMatrixScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminLockersLockerMatrixStatus = 'free' | 'occupied' | 'maintenance' | 'unknown';
export interface AdminLockersLockerMatrixViewModel {
  id: string;
  uuid?: string;
  status: AdminLockersLockerMatrixStatus;
  student?: string;
  smartId?: string;
  phone?: string;
  shift?: string;
  expiry?: string;
  branchId?: string;
  branchName?: string;
  allottedByManager?: string;
  allottedDate?: string;
}

export interface AdminLockersLockerMatrixStatsProps {
  total: number;
  free: number;
  occupied: number;
  maintenance: number;
  unknown: number;
}

export interface AdminLockersMatrixHarnessProps {
  children: ReactNode;
  scenario?: AdminLockersMatrixScenario;
}
