import type { AdminSeatsDemoSeatHistoryEntry } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/mocks/AdminSeatsHistoryDemoFixtures';
import type { AdminSeatsHistoryScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/tests/harness/bootstrap';
import type { ReactNode } from 'react';

/** Stable filter values for seat history; labels are supplied by next-intl. */
export type AdminSeatsHistoryFilterValue = string;
export interface AdminSeatsHistoryFilters { seatFilter: AdminSeatsHistoryFilterValue; search: string; dateFrom: string; dateTo: string }

export type SeatHistoryEntry = AdminSeatsDemoSeatHistoryEntry;

export interface AdminSeatsHistoryHarnessProps {
  children: ReactNode;
  scenario?: AdminSeatsHistoryScenario;
}
