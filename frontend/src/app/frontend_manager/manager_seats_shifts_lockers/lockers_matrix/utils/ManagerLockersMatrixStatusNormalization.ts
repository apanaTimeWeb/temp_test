import type { AllocationStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/types/ManagerLockersMatrixTypes';

/** Do not coerce unrecognized allocation states into Active. */
export function normalizeManagerSeatsAllocationStatus(status: unknown): AllocationStatus {
  if (status === 'Active' || status === 'Expired' || status === 'Suspended') return status;
  return 'unknown';
}
