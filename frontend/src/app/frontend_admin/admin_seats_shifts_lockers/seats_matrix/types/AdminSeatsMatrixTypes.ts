import type { AdminSeatsMatrixScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSeatMatrixApiRecord {
  id?: string | number;
  [key: string]: unknown;
}


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
}

export type AdminSeatMatrixLockerMatrixStatus = 'free' | 'occupied' | 'maintenance' | 'unknown';
export interface AdminSeatMatrixLockerMatrixViewModel {
  id: string;
  uuid?: string;
  status: AdminSeatMatrixLockerMatrixStatus;
}
export interface AdminSeatMatrixShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  occupancy: number;
  capacity: number;
  active: boolean;
}
export interface AdminSeatMatrixBookedBlock {
  startH: number;
  endH: number;
  label: string;
}

export interface AdminSeatMatrixGapBlock {
  startH: number;
  endH: number;
  seats: number;
  revLoss: number;
}

export interface AdminSeatMatrixShiftGapFixture {
  id: string;
  name: string;
  occupied: number;
  capacity: number;
  booked: AdminSeatMatrixBookedBlock[];
  gaps: AdminSeatMatrixGapBlock[];
}

export interface AdminSeatsMatrixHarnessProps {
  children: ReactNode;
  scenario?: AdminSeatsMatrixScenario;
}
