import type { AdminAllocationsDemoAllocation } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/mocks/AdminAllocationsDemoFixtures';
import type { AdminAllocationsScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/tests/harness/bootstrap';
import type { ReactNode } from 'react';

/** Filter values are stable domain values, independent of translated labels. */
export type AdminAllocationsFilterValue = string;
export interface AdminAllocationsFilters {
  shiftFilter: AdminAllocationsFilterValue;
  statusFilter: AdminAllocationsFilterValue;
  dateFrom: string;
  dateTo: string;
}

export type Allocation = AdminAllocationsDemoAllocation;

export interface AdminAllocationsHarnessProps {
  children: ReactNode;
  scenario?: AdminAllocationsScenario;
}
