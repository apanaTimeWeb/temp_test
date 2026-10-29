/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerShiftsManagementSearchParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/types/ManagerShiftsManagementMainTypes';
import type { ReactNode } from 'react';

export type ManagerShiftsManagementEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerShiftsManagementPageProps = {
  searchParams?: Promise<ManagerShiftsManagementSearchParams>;
};
