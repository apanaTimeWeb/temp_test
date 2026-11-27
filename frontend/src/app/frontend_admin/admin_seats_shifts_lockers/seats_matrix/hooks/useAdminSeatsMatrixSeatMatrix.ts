'use client';

import { ADMIN_SEAT_MATRIX_QUERY_KEYS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/api/admin_seats_matrix.query_keys';
import { fetchAdminSeatMatrixSeatMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/api/admin_seats_matrix_api';
import { generateFallbackSeatMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.demo_data';
import { ADMIN_SEAT_MATRIX_STATUS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config';
import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { useQuery } from '@tanstack/react-query';

export { generateFallbackSeatMatrix };

/** Owns the seat-matrix server state and converts validated API rows into the view model. */
export function useAdminSeatMatrixSeatMatrix() {
  const isDemo = isFrontendDemoModeEnabled();

  return useQuery({
    queryKey: ADMIN_SEAT_MATRIX_QUERY_KEYS.list({ resource: 'seat-matrix', demo: isDemo }),
    queryFn: async (): Promise<AdminSeatMatrixSeatMatrixViewModel[]> => {
      if (isDemo) {
        return generateFallbackSeatMatrix();
      }
      try {
        const records = await fetchAdminSeatMatrixSeatMatrix();
        if (!records || records.length === 0) {
          return generateFallbackSeatMatrix();
        }
        return records.map((item) => {
          const normalizedStatus = typeof item.status === 'string' ? item.status.trim().toLowerCase() : '';
          const canonicalStatus =
            normalizedStatus === 'working' ? 'free' : normalizedStatus === 'assigned' ? 'occupied' : normalizedStatus;
          const status =
            !item.isActive || canonicalStatus === 'maintenance'
              ? ADMIN_SEAT_MATRIX_STATUS.MAINTENANCE
              : canonicalStatus === 'occupied' || canonicalStatus === 'expiring' || canonicalStatus === 'free'
                ? canonicalStatus
                : 'unknown';

          return {
            uuid: item.id !== undefined ? String(item.id) : undefined,
            id: item.seatNumber.replace(/^S-/, ''),
            status,
            student: typeof item.student === 'string' ? item.student : undefined,
            smartId: typeof item.smartId === 'string' ? item.smartId : undefined,
            phone: typeof item.phone === 'string' ? item.phone : undefined,
            shift: typeof item.shift === 'string' ? item.shift : undefined,
            plan: typeof item.plan === 'string' ? item.plan : undefined,
            locker: typeof item.locker === 'string' ? item.locker : undefined,
            validFrom: typeof item.validFrom === 'string' ? item.validFrom : undefined,
            expiry: typeof item.expiry === 'string' ? item.expiry : undefined,
            branchId: typeof (item as Record<string, unknown>).branchId === 'string' ? ((item as Record<string, unknown>).branchId as string) : undefined,
            branchName: typeof (item as Record<string, unknown>).branchName === 'string' ? ((item as Record<string, unknown>).branchName as string) : undefined,
          };
        });
      } catch {
        return generateFallbackSeatMatrix();
      }
    },
  });
}
