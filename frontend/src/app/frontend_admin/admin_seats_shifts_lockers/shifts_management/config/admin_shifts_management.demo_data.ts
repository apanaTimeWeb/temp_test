import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';

/** Illustrative shifts shown only when explicit frontend demo mode is enabled. */
export const ADMIN_SHIFTS_DEMO_SHIFTS: readonly AdminShiftsShift[] = [
  { id: '1', name: 'Morning', startTime: '06:00', endTime: '12:00', occupancy: 32, capacity: 40, active: true, branchId: 'BR-001', branchName: 'Downtown Central', monthlyPrice: 700 },
  { id: '2', name: 'Afternoon', startTime: '12:00', endTime: '18:00', occupancy: 18, capacity: 40, active: true, branchId: 'BR-001', branchName: 'Downtown Central', monthlyPrice: 650 },
  { id: '3', name: 'Evening', startTime: '18:00', endTime: '22:00', occupancy: 24, capacity: 40, active: true, branchId: 'BR-002', branchName: 'Westside Branch', monthlyPrice: 700 },
  { id: '4', name: 'Night Owl Shift', startTime: '22:00', endTime: '06:00', occupancy: 12, capacity: 30, active: true, branchId: 'BR-003', branchName: 'North Hub', monthlyPrice: 600 },
  { id: '5', name: 'Early Bird Weekend', startTime: '05:00', endTime: '11:00', occupancy: 0, capacity: 35, active: false, branchId: 'BR-001', branchName: 'Downtown Central', monthlyPrice: 500 },
];
