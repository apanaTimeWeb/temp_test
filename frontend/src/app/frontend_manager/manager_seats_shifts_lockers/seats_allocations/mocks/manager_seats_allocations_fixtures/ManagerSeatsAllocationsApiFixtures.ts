/** Synthetic test-only payloads for existing read contracts; never represent persisted seat or locker changes. */
export const MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE = [
  { id: 'test-seat-001', seatNumber: 'S-001', status: 'occupied', studentName: 'Test Student A', smartId: 'TEST-001', shift: 'Morning', expiryDate: '2026-11-30' },
  { id: 'test-seat-002', seatNumber: 'S-002', status: 'available', shift: 'Evening' },
  { id: 'test-seat-003', seatNumber: 'S-003', status: 'maintenance' },
  { id: 'test-seat-004', seatNumber: 'S-004', status: 'future-status-test' },
];
export const MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE = [
  { id: 'test-locker-001', lockerNumber: 'L-001', status: 'occupied', studentName: 'Test Student B', smartId: 'TEST-002', location: 'A-Block' },
  { id: 'test-locker-002', lockerNumber: 'L-002', status: 'available', location: 'A-Block' },
  { id: 'test-locker-003', lockerNumber: 'L-003', status: 'maintenance' },
  { id: 'test-locker-004', lockerNumber: 'L-004', status: 'future-status-test' },
];
export const MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE = [
  { id: 'test-allocation-001', studentName: 'Test Student A', smartId: 'TEST-001', seatNo: 'S-001', shift: 'Morning', customSlots: '06:00–12:00', lockerNo: 'L-001', validFrom: '2026-10-01', validTill: '2026-10-31', daysLeft: 14, status: 'Active' },
  { id: 'test-allocation-002', studentName: 'Test Student B', smartId: 'TEST-002', seatNo: 'S-012', shift: 'Evening', validFrom: '2026-10-01', validTill: '2026-10-31', daysLeft: 14, status: 'UnrecognizedTestStatus' },
];
export const MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE = [
  { seatNo: 'S-001', studentName: 'Test Student A', smartId: 'TEST-001', shift: 'Morning', occupiedFrom: '2026-09-01', occupiedTill: '2026-10-01', duration: '30 days', reason: 'Admission' },
  { seatNo: 'S-012', studentName: 'Test Student B', smartId: 'TEST-002', shift: 'Evening', occupiedFrom: '2026-08-01', occupiedTill: '2026-09-01', reason: 'FutureReasonTest' },
];
export const MANAGER_SEATS_SHIFTS_LOCKERS_EMPTY_FIXTURE: Record<string, unknown>[] = [];
