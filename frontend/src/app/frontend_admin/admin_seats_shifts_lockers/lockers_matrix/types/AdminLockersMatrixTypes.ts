import type { AdminLockersMatrixScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminLockersApiRecord {
  id?: string | number;
  [key: string]: unknown;
}


export type AdminLockersSeatMatrixStatus = 'free' | 'occupied' | 'expiring' | 'maintenance' | 'unknown';
export interface AdminLockersSeatMatrixViewModel {
  id: string;
  uuid?: string;
  status: AdminLockersSeatMatrixStatus;
  student?: string;
  smartId?: string;
  phone?: string;
  shift?: string;
  plan?: string;
  locker?: string;
  validFrom?: string;
  expiry?: string;
}

export type AdminLockersLockerMatrixStatus = 'free' | 'occupied' | 'maintenance' | 'unknown';
export interface AdminLockersLockerMatrixViewModel {
  id: string;
  uuid?: string;
  status: AdminLockersLockerMatrixStatus;
}
export interface AdminLockersShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  occupancy: number;
  capacity: number;
  active: boolean;
}
export interface AdminLockersBookedBlock {
  startH: number;
  endH: number;
  label: string;
}

export interface AdminLockersGapBlock {
  startH: number;
  endH: number;
  seats: number;
  revLoss: number;
}

export interface AdminLockersShiftGapFixture {
  id: string;
  name: string;
  occupied: number;
  capacity: number;
  booked: AdminLockersBookedBlock[];
  gaps: AdminLockersGapBlock[];
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
