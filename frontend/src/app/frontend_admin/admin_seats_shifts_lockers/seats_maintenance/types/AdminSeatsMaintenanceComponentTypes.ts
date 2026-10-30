import type { AdminSeatsDemoMaintenanceLogEntry } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/mocks/AdminSeatsMaintenanceDemoFixtures';
import type { AdminSeatsMaintenanceScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/tests/harness/bootstrap';
import type { AdminSeatsSeatStatus } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/config/admin_seats_maintenance_constants';
import type { ReactNode } from 'react';

export type SeatStatus = AdminSeatsSeatStatus;

export type LogEntry = AdminSeatsDemoMaintenanceLogEntry;

export interface AdminSeatsMaintenanceHarnessProps {
  children: ReactNode;
  scenario?: AdminSeatsMaintenanceScenario;
}
