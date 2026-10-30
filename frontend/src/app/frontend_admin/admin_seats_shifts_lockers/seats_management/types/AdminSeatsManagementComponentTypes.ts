import type { AdminSeatsDemoSeat } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/mocks/AdminSeatsManagementDemoFixtures';
import type { AdminSeatsManagementScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/tests/harness/bootstrap';
import type { AdminSeatsSeatStatus } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/config/admin_seats_management_constants';
import type { ReactNode } from 'react';

export type SeatStatus = AdminSeatsSeatStatus;

export type Seat = AdminSeatsDemoSeat;

export interface AdminSeatsManagementHarnessProps {
  children: ReactNode;
  scenario?: AdminSeatsManagementScenario;
}
