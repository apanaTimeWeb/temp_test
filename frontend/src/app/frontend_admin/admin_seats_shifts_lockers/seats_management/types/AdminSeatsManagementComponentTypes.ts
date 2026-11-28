import type { AdminSeatsSeatStatus } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/constants/AdminSeatsManagementConstants';
import type { AdminSeatsDemoSeat } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/config/admin_seats_management.demo_data';
import type { ReactNode } from 'react';

export type AdminSeatsManagementScenario = 'ACTIVE' | 'EMPTY' | 'SERVER_500' | 'TIMEOUT' | 'UNAUTHORIZED';

export type SeatStatus = AdminSeatsSeatStatus;

export type Seat = AdminSeatsDemoSeat;

export interface AdminSeatsManagementHarnessProps {
  children: ReactNode;
  scenario?: AdminSeatsManagementScenario;
}
