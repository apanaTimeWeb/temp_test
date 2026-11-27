'use client';

import { ADMIN_SEAT_MATRIX_QUERY_KEYS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/api/admin_seats_matrix.query_keys';
import { fetchAdminSeatMatrixSeatMatrix } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/api/admin_seats_matrix_api';
import { ADMIN_SEAT_MATRIX_STATUS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config';
import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { useQuery } from '@tanstack/react-query';

const DEMO_STUDENT_NAMES = [
  'Aarav Sharma', 'Aditi Rao', 'Ananya Gupta', 'Aryan Verma', 'Bhavya Mishra',
  'Dev Patel', 'Diya Sen', 'Ishaan Malhotra', 'Kavya Nair', 'Manish Joshi',
  'Neha Choudhary', 'Pranav Kulkarni', 'Pooja Reddy', 'Rohan Saxena', 'Riya Kapoor',
  'Sahil Khan', 'Sanya Singhania', 'Siddharth Jain', 'Sneha Pillai', 'Tanvi Bhatia',
  'Utkarsh Pandey', 'Vaishnavi Mehta', 'Varun Dhawan', 'Zoya Sheikh'
];

const SHIFT_TYPES = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'];
const PLANS = ['Full Day Dedicated Desk', 'Flexi Shift Half Day', 'Night Owl Special', 'Weekend Warrior Pass'];

export function generateFallbackSeatMatrix(): AdminSeatMatrixSeatMatrixViewModel[] {
  const seats: AdminSeatMatrixSeatMatrixViewModel[] = [];

  // Downtown Central (BR-001) - 24 seats
  for (let i = 1; i <= 24; i++) {
    const seatId = String(i).padStart(2, '0');
    let status: AdminSeatMatrixSeatMatrixViewModel['status'] = 'occupied';
    if (i === 4 || i === 9 || i === 15 || i === 21 || i === 23) status = 'free';
    else if (i === 8 || i === 18) status = 'expiring';
    else if (i === 12) status = 'maintenance';

    const isAssigned = status === 'occupied' || status === 'expiring';
    const student = isAssigned ? DEMO_STUDENT_NAMES[(i - 1) % DEMO_STUDENT_NAMES.length] : undefined;
    const shift = isAssigned ? SHIFT_TYPES[(i * 2) % SHIFT_TYPES.length] : undefined;

    seats.push({
      id: seatId,
      uuid: `seat-dt-${seatId}`,
      status,
      student,
      smartId: isAssigned ? `SL-DT-${1000 + i}` : undefined,
      phone: isAssigned ? `98765${String(43210 + i).slice(-5)}` : undefined,
      shift,
      plan: isAssigned ? PLANS[i % PLANS.length] : undefined,
      locker: isAssigned && i % 2 === 0 ? `L-${String(i).padStart(2, '0')}` : undefined,
      validFrom: isAssigned ? '2026-04-01' : undefined,
      expiry: status === 'expiring' ? '2026-04-20' : isAssigned ? '2026-05-31' : undefined,
      branchId: 'BR-001',
      branchName: 'Downtown Central',
    });
  }

  // Westside Branch (BR-002) - 12 seats
  for (let i = 25; i <= 36; i++) {
    const seatId = String(i).padStart(2, '0');
    let status: AdminSeatMatrixSeatMatrixViewModel['status'] = 'occupied';
    if (i === 27 || i === 31 || i === 34 || i === 36) status = 'free';
    else if (i === 30) status = 'maintenance';

    const isAssigned = status === 'occupied';
    const student = isAssigned ? DEMO_STUDENT_NAMES[(i + 3) % DEMO_STUDENT_NAMES.length] : undefined;
    const shift = isAssigned ? SHIFT_TYPES[(i * 3) % SHIFT_TYPES.length] : undefined;

    seats.push({
      id: seatId,
      uuid: `seat-ws-${seatId}`,
      status,
      student,
      smartId: isAssigned ? `SL-WS-${2000 + i}` : undefined,
      phone: isAssigned ? `98111${String(54320 + i).slice(-5)}` : undefined,
      shift,
      plan: isAssigned ? PLANS[(i + 1) % PLANS.length] : undefined,
      locker: isAssigned && i % 3 === 0 ? `L-${String(i).padStart(2, '0')}` : undefined,
      validFrom: isAssigned ? '2026-04-05' : undefined,
      expiry: isAssigned ? '2026-05-15' : undefined,
      branchId: 'BR-002',
      branchName: 'Westside Branch',
    });
  }

  // North Hub (BR-003) - 12 seats
  for (let i = 37; i <= 48; i++) {
    const seatId = String(i).padStart(2, '0');
    let status: AdminSeatMatrixSeatMatrixViewModel['status'] = 'occupied';
    if (i === 39 || i === 44 || i === 47) status = 'free';
    else if (i === 42) status = 'expiring';

    const isAssigned = status === 'occupied' || status === 'expiring';
    const student = isAssigned ? DEMO_STUDENT_NAMES[(i + 5) % DEMO_STUDENT_NAMES.length] : undefined;
    const shift = isAssigned ? SHIFT_TYPES[(i * 4) % SHIFT_TYPES.length] : undefined;

    seats.push({
      id: seatId,
      uuid: `seat-nh-${seatId}`,
      status,
      student,
      smartId: isAssigned ? `SL-NH-${3000 + i}` : undefined,
      phone: isAssigned ? `99555${String(65430 + i).slice(-5)}` : undefined,
      shift,
      plan: isAssigned ? PLANS[(i + 2) % PLANS.length] : undefined,
      locker: isAssigned && i % 2 !== 0 ? `L-${String(i).padStart(2, '0')}` : undefined,
      validFrom: isAssigned ? '2026-04-10' : undefined,
      expiry: status === 'expiring' ? '2026-04-22' : isAssigned ? '2026-06-10' : undefined,
      branchId: 'BR-003',
      branchName: 'North Hub',
    });
  }

  return seats;
}

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
          const canonicalStatus = normalizedStatus === 'working' ? 'free' : normalizedStatus === 'assigned' ? 'occupied' : normalizedStatus;
          const status = !item.isActive || canonicalStatus === 'maintenance'
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
            branchId: typeof (item as Record<string, unknown>).branchId === 'string' ? (item as Record<string, unknown>).branchId as string : undefined,
            branchName: typeof (item as Record<string, unknown>).branchName === 'string' ? (item as Record<string, unknown>).branchName as string : undefined,
          };
        });
      } catch (err) {
        // Fallback for demo or when API is unreachable
        return generateFallbackSeatMatrix();
      }
    },
  });
}
