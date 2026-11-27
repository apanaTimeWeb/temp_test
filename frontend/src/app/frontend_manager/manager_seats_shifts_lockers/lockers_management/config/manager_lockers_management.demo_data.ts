export interface ManagerLockersManagementSampleLocker {
  id: string;
  lockerId: string;
  status: 'Free' | 'Occupied' | 'Maintenance' | 'Expired';
  assignedTo: string;
  studentId: string;
  assignedSince: string;
  keyNumber?: string;
  expiryDate?: string;
  seatNo?: string;
  lostKeyReported?: boolean;
  lostKeyFine?: number;
}

export const MANAGER_LOCKERS_SEAT_MATRIX_DEMO = [
  { id: 'test-seat-001', seatNumber: 'S-001', status: 'occupied', studentName: 'Test Student A', smartId: 'TEST-001', shift: 'Morning', expiryDate: '2026-11-30' },
  { id: 'test-seat-002', seatNumber: 'S-002', status: 'available', shift: 'Evening' },
  { id: 'test-seat-003', seatNumber: 'S-003', status: 'maintenance' },
  { id: 'test-seat-004', seatNumber: 'S-004', status: 'future-status-test' },
];

export const MANAGER_LOCKERS_API_DEMO = [
  { id: 'test-locker-001', lockerNumber: 'L-001', status: 'occupied', studentName: 'Test Student B', smartId: 'TEST-002', location: 'A-Block' },
  { id: 'test-locker-002', lockerNumber: 'L-002', status: 'available', location: 'A-Block' },
  { id: 'test-locker-003', lockerNumber: 'L-003', status: 'maintenance' },
  { id: 'test-locker-004', lockerNumber: 'L-004', status: 'future-status-test' },
];

export const MANAGER_LOCKERS_ALLOCATIONS_DEMO = [
  { id: 'test-allocation-001', studentName: 'Test Student A', smartId: 'TEST-001', seatNo: 'S-001', shift: 'Morning', customSlots: '06:00–12:00', lockerNo: 'L-001', validFrom: '2026-10-01', validTill: '2026-10-31', daysLeft: 14, status: 'Active' },
  { id: 'test-allocation-002', studentName: 'Test Student B', smartId: 'TEST-002', seatNo: 'S-012', shift: 'Evening', validFrom: '2026-10-01', validTill: '2026-10-31', daysLeft: 14, status: 'UnrecognizedTestStatus' },
];

export const MANAGER_LOCKERS_HISTORY_DEMO = [
  { seatNo: 'S-001', studentName: 'Test Student A', smartId: 'TEST-001', shift: 'Morning', occupiedFrom: '2026-09-01', occupiedTill: '2026-10-01', duration: '30 days', reason: 'Admission' },
  { seatNo: 'S-012', studentName: 'Test Student B', smartId: 'TEST-002', shift: 'Evening', occupiedFrom: '2026-08-01', occupiedTill: '2026-09-01', reason: 'FutureReasonTest' },
];

export const MANAGER_LOCKERS_SAMPLE_DATA: ManagerLockersManagementSampleLocker[] = [
  { id: '1', lockerId: 'A01', status: 'Occupied', assignedTo: 'Alex Chen', studentId: 'LIB-021', assignedSince: '2024-10-01', keyNumber: 'KEY-A01', expiryDate: '2026-12-31', seatNo: 'S-01' },
  { id: '2', lockerId: 'A02', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-A02' },
  { id: '3', lockerId: 'A03', status: 'Occupied', assignedTo: 'Pooja Verma', studentId: 'LIB-114', assignedSince: '2024-10-15', keyNumber: 'KEY-A03', expiryDate: '2026-12-15', seatNo: 'S-03' },
  { id: '4', lockerId: 'A04', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-A04' },
  { id: '5', lockerId: 'A05', status: 'Maintenance', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-A05' },
  { id: '6', lockerId: 'A06', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-A06' },
  { id: '7', lockerId: 'B01', status: 'Occupied', assignedTo: 'Suresh Raina', studentId: 'LIB-180', assignedSince: '2024-09-20', keyNumber: 'KEY-B01', expiryDate: '2026-11-30', seatNo: 'S-14' },
  { id: '8', lockerId: 'B02', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-B02' },
  { id: '9', lockerId: 'B03', status: 'Occupied', assignedTo: 'Neha Sharma', studentId: 'LIB-205', assignedSince: '2024-10-05', keyNumber: 'KEY-B03', expiryDate: '2026-12-05', seatNo: 'S-09' },
  { id: '10', lockerId: 'B04', status: 'Occupied', assignedTo: 'Maria Vargas', studentId: 'LIB-055', assignedSince: '2024-09-15', keyNumber: 'KEY-B04', expiryDate: '2026-10-15', seatNo: 'S-05' },
  { id: '11', lockerId: 'B05', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-B05' },
  { id: '12', lockerId: 'B06', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-B06' },
  { id: '13', lockerId: 'C01', status: 'Occupied', assignedTo: 'Aditya Roy', studentId: 'LIB-310', assignedSince: '2024-10-12', keyNumber: 'KEY-C01', expiryDate: '2026-12-12', seatNo: 'S-22' },
  { id: '14', lockerId: 'C02', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-C02' },
  { id: '15', lockerId: 'C03', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-C03' },
  { id: '16', lockerId: 'C04', status: 'Maintenance', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-C04' },
  { id: '17', lockerId: 'C05', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—', keyNumber: 'KEY-C05' },
  { id: '18', lockerId: 'C10', status: 'Occupied', assignedTo: 'Ravi Kumar', studentId: 'LIB-099', assignedSince: '2024-10-10', keyNumber: 'KEY-C10', expiryDate: '2026-10-31', seatNo: 'S-18' },
];
