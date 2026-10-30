import type { AdminShiftsShiftGapFixture } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/types/AdminShiftsGapTypes';

/** Illustrative single-day gap data. The page hides these records outside explicit demo mode. */
export const ADMIN_SHIFTS_DEMO_SHIFT_GAPS: readonly AdminShiftsShiftGapFixture[] = [
  {
    id: '1',
    name: 'Morning',
    occupied: 38,
    capacity: 60,
    booked: [
      { startH: 6, endH: 10, label: 'Batch A (22 students)' },
      { startH: 10, endH: 12, label: 'Batch B (16 students)' },
    ],
    gaps: [{ startH: 8, endH: 10, seats: 6, revLoss: 600 }],
  },
  {
    id: '2',
    name: 'Afternoon',
    occupied: 18,
    capacity: 60,
    booked: [
      { startH: 12, endH: 14, label: 'Batch C (10 students)' },
      { startH: 16, endH: 18, label: 'Batch D (8 students)' },
    ],
    gaps: [{ startH: 14, endH: 16, seats: 12, revLoss: 960 }],
  },
  {
    id: '3',
    name: 'Evening',
    occupied: 24,
    capacity: 40,
    booked: [
      { startH: 18, endH: 20, label: 'Batch E (14 students)' },
      { startH: 20, endH: 22, label: 'Batch F (10 students)' },
    ],
    gaps: [{ startH: 19, endH: 21, seats: 8, revLoss: 800 }],
  },
];
