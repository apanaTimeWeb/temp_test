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
  {
    id: '4',
    name: 'Night',
    occupied: 12,
    capacity: 30,
    booked: [{ startH: 22, endH: 24, label: 'Night Owls (12 students)' }],
    gaps: [{ startH: 23, endH: 24, seats: 5, revLoss: 500 }],
  },
  {
    id: '5',
    name: 'Full Day',
    occupied: 35,
    capacity: 50,
    booked: [{ startH: 6, endH: 22, label: 'Full Day Dedicated (35 students)' }],
    gaps: [{ startH: 14, endH: 16, seats: 4, revLoss: 400 }],
  },
];

export interface ShiftGapAuditRecord {
  id: string;
  branchName: string;
  shiftName: string;
  timings: string;
  totalSeats: number;
  assignedSeats: number;
  gapSeats: number;
  gapPercent: number;
  dailyGapLoss: number;
  monthlyLeakage: number;
  recommendation: string;
  priority: 'High' | 'Medium' | 'Low';
}

export const DEMO_GAP_RECORDS: readonly ShiftGapAuditRecord[] = [
  {
    id: 'gap-001',
    branchName: 'Downtown Central',
    shiftName: 'Afternoon Flexi',
    timings: '12:00 PM – 05:00 PM',
    totalSeats: 24,
    assignedSeats: 14,
    gapSeats: 10,
    gapPercent: 42,
    dailyGapLoss: 350,
    monthlyLeakage: 10500,
    recommendation: 'Launch promotional 20% discount coupon for post-lunch college students',
    priority: 'High',
  },
  {
    id: 'gap-002',
    branchName: 'Downtown Central',
    shiftName: 'Night Owl Slot',
    timings: '10:00 PM – 06:00 AM',
    totalSeats: 24,
    assignedSeats: 16,
    gapSeats: 8,
    gapPercent: 33,
    dailyGapLoss: 320,
    monthlyLeakage: 9600,
    recommendation: 'Offer free night beverages & high-speed backup to retain competitive exam night batches',
    priority: 'Medium',
  },
  {
    id: 'gap-003',
    branchName: 'Westside Branch',
    shiftName: 'Morning Early Bird',
    timings: '07:00 AM – 12:00 PM',
    totalSeats: 12,
    assignedSeats: 6,
    gapSeats: 6,
    gapPercent: 50,
    dailyGapLoss: 210,
    monthlyLeakage: 6300,
    recommendation: 'Target CA / UPSC aspirants with early morning silent study campaigns',
    priority: 'High',
  },
  {
    id: 'gap-004',
    branchName: 'Westside Branch',
    shiftName: 'Afternoon Slot',
    timings: '12:00 PM – 05:00 PM',
    totalSeats: 12,
    assignedSeats: 8,
    gapSeats: 4,
    gapPercent: 33,
    dailyGapLoss: 140,
    monthlyLeakage: 4200,
    recommendation: 'Combine with Evening slot for multi-shift discount package',
    priority: 'Medium',
  },
  {
    id: 'gap-005',
    branchName: 'North Hub',
    shiftName: 'Evening Rush',
    timings: '05:00 PM – 10:00 PM',
    totalSeats: 12,
    assignedSeats: 10,
    gapSeats: 2,
    gapPercent: 17,
    dailyGapLoss: 90,
    monthlyLeakage: 2700,
    recommendation: 'Near-optimal occupancy. Enable waitlist buffer to backfill remaining 2 seats',
    priority: 'Low',
  },
  {
    id: 'gap-006',
    branchName: 'North Hub',
    shiftName: 'Early Morning',
    timings: '06:00 AM – 11:00 AM',
    totalSeats: 12,
    assignedSeats: 5,
    gapSeats: 7,
    gapPercent: 58,
    dailyGapLoss: 245,
    monthlyLeakage: 7350,
    recommendation: 'Low early morning walk-ins near campus. Partner with nearby coaching institutes',
    priority: 'High',
  },
];
