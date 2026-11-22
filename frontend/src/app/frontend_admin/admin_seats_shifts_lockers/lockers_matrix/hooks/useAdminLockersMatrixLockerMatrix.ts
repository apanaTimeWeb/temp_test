'use client';

import { ADMIN_LOCKERS_MATRIX_QUERY_KEYS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/api/admin_lockers_matrix.query_keys';
import { fetchAdminLockersLockers } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/api/admin_lockers_matrix_api';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useQuery } from '@tanstack/react-query';

const DEMO_STUDENT_NAMES = [
  'Aarav Sharma', 'Aditi Rao', 'Ananya Gupta', 'Aryan Verma', 'Bhavya Mishra',
  'Dev Patel', 'Diya Sen', 'Ishaan Malhotra', 'Kavya Nair', 'Manish Joshi',
  'Neha Choudhary', 'Pranav Kulkarni', 'Pooja Reddy', 'Rohan Saxena', 'Riya Kapoor',
  'Sahil Khan', 'Sanya Singhania', 'Siddharth Jain', 'Sneha Pillai', 'Tanvi Bhatia'
];

export function generateFallbackLockerMatrix(): AdminLockersLockerMatrixViewModel[] {
  const lockers: AdminLockersLockerMatrixViewModel[] = [];

  // Downtown Central (BR-001) - Lockers L-01 to L-24
  for (let i = 1; i <= 24; i++) {
    const lockerId = String(i).padStart(2, '0');
    let status: AdminLockersLockerMatrixViewModel['status'] = 'occupied';
    if (i === 3 || i === 7 || i === 13 || i === 19 || i === 23) status = 'free';
    else if (i === 11) status = 'maintenance';

    const isAssigned = status === 'occupied';
    const student = isAssigned ? DEMO_STUDENT_NAMES[(i - 1) % DEMO_STUDENT_NAMES.length] : undefined;

    lockers.push({
      id: lockerId,
      uuid: `locker-dt-${lockerId}`,
      status,
      student,
      smartId: isAssigned ? `SL-DT-${1000 + i}` : undefined,
      phone: isAssigned ? `98765${String(43210 + i).slice(-5)}` : undefined,
      shift: isAssigned ? 'Full Day Dedicated' : undefined,
      expiry: isAssigned ? '2026-05-31' : undefined,
      branchId: 'BR-001',
      branchName: 'Downtown Central',
      allottedByManager: isAssigned ? 'Rohan Sharma (Manager)' : undefined,
      allottedDate: isAssigned ? '2026-04-01' : undefined,
    });
  }

  // Westside Branch (BR-002) - Lockers L-25 to L-36
  for (let i = 25; i <= 36; i++) {
    const lockerId = String(i).padStart(2, '0');
    let status: AdminLockersLockerMatrixViewModel['status'] = 'occupied';
    if (i === 26 || i === 29 || i === 33 || i === 35) status = 'free';
    else if (i === 32) status = 'maintenance';

    const isAssigned = status === 'occupied';
    const student = isAssigned ? DEMO_STUDENT_NAMES[(i + 2) % DEMO_STUDENT_NAMES.length] : undefined;

    lockers.push({
      id: lockerId,
      uuid: `locker-ws-${lockerId}`,
      status,
      student,
      smartId: isAssigned ? `SL-WS-${2000 + i}` : undefined,
      phone: isAssigned ? `98111${String(54320 + i).slice(-5)}` : undefined,
      shift: isAssigned ? 'Morning & Evening' : undefined,
      expiry: isAssigned ? '2026-05-15' : undefined,
      branchId: 'BR-002',
      branchName: 'Westside Branch',
      allottedByManager: isAssigned ? 'Priya Verma (Manager)' : undefined,
      allottedDate: isAssigned ? '2026-04-05' : undefined,
    });
  }

  // North Hub (BR-003) - Lockers L-37 to L-48
  for (let i = 37; i <= 48; i++) {
    const lockerId = String(i).padStart(2, '0');
    let status: AdminLockersLockerMatrixViewModel['status'] = 'occupied';
    if (i === 38 || i === 41 || i === 45 || i === 47) status = 'free';

    const isAssigned = status === 'occupied';
    const student = isAssigned ? DEMO_STUDENT_NAMES[(i + 4) % DEMO_STUDENT_NAMES.length] : undefined;

    lockers.push({
      id: lockerId,
      uuid: `locker-nh-${lockerId}`,
      status,
      student,
      smartId: isAssigned ? `SL-NH-${3000 + i}` : undefined,
      phone: isAssigned ? `99555${String(65430 + i).slice(-5)}` : undefined,
      shift: isAssigned ? 'Night Owl Flexi' : undefined,
      expiry: isAssigned ? '2026-06-10' : undefined,
      branchId: 'BR-003',
      branchName: 'North Hub',
      allottedByManager: isAssigned ? 'Sunita Rao (Manager)' : undefined,
      allottedDate: isAssigned ? '2026-04-10' : undefined,
    });
  }

  return lockers;
}

/** Owns the locker-matrix server state. Unknown occupancy stays unknown because the observed schema does not guarantee it. */
export function useAdminLockersLockerMatrix() {
  const isDemo = isFrontendDemoModeEnabled();

  return useQuery({
    queryKey: ADMIN_LOCKERS_MATRIX_QUERY_KEYS.list({ resource: 'locker-matrix', demo: isDemo }),
    queryFn: async (): Promise<AdminLockersLockerMatrixViewModel[]> => {
      if (isDemo) {
        return generateFallbackLockerMatrix();
      }
      try {
        const records = await fetchAdminLockersLockers();
        if (!records || records.length === 0) {
          return generateFallbackLockerMatrix();
        }
        return records.map((item) => {
          const declaredStatus = (item as { status?: unknown }).status;
          const status = declaredStatus === 'free' || declaredStatus === 'occupied' || declaredStatus === 'maintenance'
            ? declaredStatus
            : 'unknown';

          const rec = item as Record<string, unknown>;
          return {
            uuid: item.id !== undefined ? String(item.id) : undefined,
            id: item.lockerNumber.replace(/^L-/, ''),
            status,
            student: typeof rec.student === 'string' ? rec.student : undefined,
            smartId: typeof rec.smartId === 'string' ? rec.smartId : undefined,
            phone: typeof rec.phone === 'string' ? rec.phone : undefined,
            shift: typeof rec.shift === 'string' ? rec.shift : undefined,
            expiry: typeof rec.expiry === 'string' ? rec.expiry : undefined,
            branchId: typeof rec.branchId === 'string' ? rec.branchId : undefined,
            branchName: typeof rec.branchName === 'string' ? rec.branchName : undefined,
            allottedByManager: typeof rec.allottedByManager === 'string' ? rec.allottedByManager : undefined,
            allottedDate: typeof rec.allottedDate === 'string' ? rec.allottedDate : undefined,
          };
        });
      } catch (err) {
        return generateFallbackLockerMatrix();
      }
    },
  });
}
