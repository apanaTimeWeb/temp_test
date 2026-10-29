/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerShiftsMigrationSearchParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationMainTypes';
import type { ReactNode } from 'react';

export type ManagerShiftsMigrationEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type PayMode = 'Cash' | 'UPI' | 'Card';

export type PendingConfirmation = { message: string; cancelLabel: string; continueLabel: string; resolve: (confirmed: boolean) => void };

export type ManagerShiftsMigrationPageProps = {
  searchParams?: Promise<ManagerShiftsMigrationSearchParams>;
};
