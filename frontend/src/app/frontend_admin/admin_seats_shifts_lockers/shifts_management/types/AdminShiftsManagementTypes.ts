import type { AdminShiftsManagementScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminShiftsApiRecord {
  id?: string | number;
  [key: string]: unknown;
}


export type AdminShiftsSeatMatrixStatus = 'free' | 'occupied' | 'expiring' | 'maintenance' | 'unknown';
export interface AdminShiftsSeatMatrixViewModel {
  id: string;
  uuid?: string;
  status: AdminShiftsSeatMatrixStatus;
  student?: string;
  smartId?: string;
  phone?: string;
  shift?: string;
  plan?: string;
  locker?: string;
  validFrom?: string;
  expiry?: string;
}

export type AdminShiftsLockerMatrixStatus = 'free' | 'occupied' | 'maintenance' | 'unknown';
export interface AdminShiftsLockerMatrixViewModel {
  id: string;
  uuid?: string;
  status: AdminShiftsLockerMatrixStatus;
}
export interface AdminShiftsShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  occupancy: number;
  capacity: number;
  active: boolean;
}
export interface AdminShiftsBookedBlock {
  startH: number;
  endH: number;
  label: string;
}

export interface AdminShiftsGapBlock {
  startH: number;
  endH: number;
  seats: number;
  revLoss: number;
}

export interface AdminShiftsShiftGapFixture {
  id: string;
  name: string;
  occupied: number;
  capacity: number;
  booked: AdminShiftsBookedBlock[];
  gaps: AdminShiftsGapBlock[];
}

export interface AdminShiftsManagementHarnessProps {
  children: ReactNode;
  scenario?: AdminShiftsManagementScenario;
}
