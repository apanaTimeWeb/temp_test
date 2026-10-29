/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerLockersMatrixSearchParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/types/ManagerLockersMatrixMainTypes';

export type ManagerLockersMatrixPageProps = {
  searchParams?: Promise<ManagerLockersMatrixSearchParams>;
};
