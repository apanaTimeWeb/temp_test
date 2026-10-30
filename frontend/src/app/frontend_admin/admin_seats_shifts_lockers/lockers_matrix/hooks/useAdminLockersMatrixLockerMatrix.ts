// DATA FLOW: lockers_matrix route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAdminLockersLockers } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/api/admin_lockers_matrix_api';
import { ADMIN_LOCKERS_MATRIX_QUERY_KEYS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/api/admin_lockers_matrix.query_keys';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';

/** Owns the locker-matrix server state. Unknown occupancy stays unknown because the observed schema does not guarantee it. */
export function useAdminLockersLockerMatrix() {
  return useQuery({
    queryKey: ADMIN_LOCKERS_MATRIX_QUERY_KEYS.list({ resource: 'locker-matrix' }),
    queryFn: async (): Promise<AdminLockersLockerMatrixViewModel[]> => {
      const records = await fetchAdminLockersLockers();
      return records.map((item) => {
        const declaredStatus = (item as { status?: unknown }).status;
        const status = declaredStatus === 'free' || declaredStatus === 'occupied' || declaredStatus === 'maintenance'
          ? declaredStatus
          : 'unknown';

        return {
          uuid: item.id,
          id: item.lockerNumber.replace(/^L-/, ''),
          status,
        };
      });
    },
  });
}
