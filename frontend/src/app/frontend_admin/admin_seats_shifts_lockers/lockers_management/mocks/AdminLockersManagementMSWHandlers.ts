import { http, HttpResponse } from 'msw';
import { ADMIN_LOCKERS_URLS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/config/admin_lockers_management_lockers_url_config_source_routes';
import type {
  AdminLockersSeatStatus,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/config/admin_lockers_management.url_config';
import {
  ADMIN_LOCKERS_ALLOCATION_FEE_STATUS_BADGE_CLASS,
  ADMIN_LOCKERS_ALLOCATION_STATUS_BADGE_CLASS,
  ADMIN_LOCKERS_LOCKER_STATUS_BADGE_CLASS,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/config/admin_lockers_management.url_config';

/**
 * Demo-only records used by the local seat/locker/allocations preview.
 * These records are intentionally not treated as persisted backend data.
 */



export interface AdminLockersDemoSeat {
  id: string;
  seatNo: string;
  branch: string;
  status: AdminLockersSeatStatus;
  assignedTo: string;
  lastMaintenance: string;
}

export const ADMIN_LOCKERS_DEMO_SEATS: AdminLockersDemoSeat[] = [
  { id: '1', seatNo: 'S-042', branch: 'North Wing', status: 'Working', assignedTo: 'Elias Hawthorne', lastMaintenance: 'Oct 14, 2024' },
  { id: '2', seatNo: 'S-109', branch: 'South Archive', status: 'Maintenance', assignedTo: '—', lastMaintenance: 'Today' },
  { id: '3', seatNo: 'S-012', branch: 'Main Reading', status: 'Broken', assignedTo: '—', lastMaintenance: 'Pending' },
  { id: '4', seatNo: 'S-088', branch: 'North Wing', status: 'Working', assignedTo: 'Seraphina Vane', lastMaintenance: 'Nov 02, 2024' },
];

export type AdminLockersDemoLockerStatus = keyof typeof ADMIN_LOCKERS_LOCKER_STATUS_BADGE_CLASS;
export interface AdminLockersDemoLocker {
  id: string;
  lockerId: string;
  status: AdminLockersDemoLockerStatus;
  assignedTo: string;
  studentId: string;
  assignedSince: string;
}

export const ADMIN_LOCKERS_DEMO_LOCKERS: AdminLockersDemoLocker[] = [
  { id: '1', lockerId: 'A01', status: 'Occupied', assignedTo: 'Alex Chen', studentId: 'LIB-021', assignedSince: '01 Oct 2024' },
  { id: '2', lockerId: 'A02', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '3', lockerId: 'A05', status: 'Maintenance', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '4', lockerId: 'B04', status: 'Occupied', assignedTo: 'Maria Vargas', studentId: 'LIB-055', assignedSince: '15 Sep 2024' },
  { id: '5', lockerId: 'B06', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '6', lockerId: 'C10', status: 'Occupied', assignedTo: 'Ravi Kumar', studentId: 'LIB-099', assignedSince: '10 Oct 2024' },
];

/** Synthetic API response fixtures for tests/MSW only; not production or persisted records. */
export const ADMIN_LOCKERS_API_LOCKERS_FIXTURE = ADMIN_LOCKERS_DEMO_LOCKERS.map((locker) => ({
  id: locker.id,
  lockerNumber: locker.lockerId,
  isActive: locker.status !== 'Maintenance',
}));

export const ADMIN_LOCKERS_API_SEAT_MATRIX_FIXTURE = ADMIN_LOCKERS_DEMO_SEATS.map((seat) => ({
  id: seat.id,
  seatNumber: seat.seatNo,
  isActive: seat.status === 'Working',
  status: seat.status,
  student: seat.assignedTo,
}));

/** Test-only contract handlers; fixtures are synthetic and never indicate persisted state. */
export const ADMIN_LOCKERS_MSW_HANDLERS = [
  http.get(ADMIN_LOCKERS_URLS.LOCKERS, () => HttpResponse.json({ success: true, message: 'Synthetic locker fixture loaded.', data: ADMIN_LOCKERS_API_LOCKERS_FIXTURE, requestId: 'mock-lockers-management-lockers' })),
  http.get(ADMIN_LOCKERS_URLS.SEAT_MATRIX, () => HttpResponse.json({ success: true, message: 'Synthetic seat matrix fixture loaded.', data: ADMIN_LOCKERS_API_SEAT_MATRIX_FIXTURE, requestId: 'mock-lockers-management-seat-matrix' })),
];

export type AdminLockersDemoAllocationStatus = keyof typeof ADMIN_LOCKERS_ALLOCATION_STATUS_BADGE_CLASS;
export type AdminLockersDemoFeeStatus = keyof typeof ADMIN_LOCKERS_ALLOCATION_FEE_STATUS_BADGE_CLASS;
export interface AdminLockersDemoAllocation {
  studentName: string;
  smartId: string;
  phone: string;
  seatNo: string;
  shift: string;
  customSlots: string;
  lockerNo: string;
  feeStatus: AdminLockersDemoFeeStatus;
  validFrom: string;
  validTill: string;
  daysLeft: number;
  status: AdminLockersDemoAllocationStatus;
}

export const ADMIN_LOCKERS_DEMO_ALLOCATIONS: AdminLockersDemoAllocation[] = [
  { studentName: 'Alex Rivera', smartId: 'LIB-001', phone: '+91 9876543210', seatNo: 'S-02', shift: 'Morning', customSlots: '8AM–10AM, 5PM–8PM', lockerNo: 'A01', feeStatus: 'Paid', validFrom: '01 Oct 2024', validTill: '31 Oct 2024', daysLeft: 7, status: 'Active' },
  { studentName: 'Priya Sharma', smartId: 'LIB-002', phone: '+91 9123456789', seatNo: 'S-11', shift: 'Evening', customSlots: '—', lockerNo: '—', feeStatus: 'Paid', validFrom: '15 Sep 2024', validTill: '14 Oct 2024', daysLeft: 3, status: 'Active' },
  { studentName: 'Rohan Mehta', smartId: 'LIB-003', phone: '+91 9988776655', seatNo: 'S-22', shift: 'Morning', customSlots: '—', lockerNo: 'B04', feeStatus: 'Due', validFrom: '01 Sep 2024', validTill: '30 Sep 2024', daysLeft: -5, status: 'Expired' },
  { studentName: 'Sneha Patel', smartId: 'LIB-004', phone: '+91 9001122334', seatNo: 'S-36', shift: 'Full Day', customSlots: '—', lockerNo: '—', feeStatus: 'Paid', validFrom: '10 Oct 2024', validTill: '09 Nov 2024', daysLeft: 20, status: 'Active' },
  { studentName: 'Vikram Rao', smartId: 'LIB-005', phone: '+91 9888123456', seatNo: 'S-45', shift: 'Evening', customSlots: '6PM–9PM', lockerNo: 'C10', feeStatus: 'Paid', validFrom: '20 Oct 2024', validTill: '19 Nov 2024', daysLeft: 30, status: 'Active' },
  { studentName: 'Ananya Gupta', smartId: 'LIB-006', phone: '+91 9777123456', seatNo: 'S-08', shift: 'Morning', customSlots: '—', lockerNo: '—', feeStatus: 'Due', validFrom: '05 Oct 2024', validTill: '04 Oct 2024', daysLeft: 12, status: 'Suspended' },
];


export interface AdminLockersDemoMaintenanceLogEntry {
  id: string;
  num: number;
  date: string;
  remark: string;
  doneBy: string;
  statusBefore: AdminLockersSeatStatus;
  statusAfter: AdminLockersSeatStatus;
  cost: string;
}

export const ADMIN_LOCKERS_DEMO_MAINTENANCE_LOGS: Record<string, AdminLockersDemoMaintenanceLogEntry[]> = {
  'S-006': [
    { id: '1', num: 1, date: '10 Oct 2024', remark: 'Chair leg repaired', doneBy: 'Ramesh K.', statusBefore: 'Broken', statusAfter: 'Working', cost: '₹350' },
    { id: '2', num: 2, date: '15 Aug 2024', remark: 'Routine inspection', doneBy: 'Suresh M.', statusBefore: 'Working', statusAfter: 'Working', cost: '—' },
  ],
  'S-017': [
    { id: '3', num: 1, date: '15 Oct 2024', remark: 'Loose table joint — WIP', doneBy: 'Suresh M.', statusBefore: 'Working', statusAfter: 'Maintenance', cost: '—' },
  ],
  'S-029': [],
  'S-043': [
    { id: '4', num: 1, date: '05 Oct 2024', remark: 'Power socket replaced', doneBy: 'Ramesh K.', statusBefore: 'Broken', statusAfter: 'Working', cost: '₹200' },
    { id: '5', num: 2, date: '20 Jul 2024', remark: 'Socket loose — tightened', doneBy: 'Ramesh K.', statusBefore: 'Maintenance', statusAfter: 'Working', cost: '₹50' },
  ],
};

export const ADMIN_LOCKERS_DEMO_MAINTENANCE_SEAT_IDS = Object.keys(ADMIN_LOCKERS_DEMO_MAINTENANCE_LOGS);

export const ADMIN_LOCKERS_DEMO_MAINTENANCE_DAYS_SINCE: Record<string, number> = {
  'S-006': 14, 'S-017': 9, 'S-029': 62, 'S-043': 19,
};

export const ADMIN_LOCKERS_DEMO_MAINTENANCE_CURRENT_STATUS: Record<string, AdminLockersSeatStatus> = {
  'S-006': 'Working', 'S-017': 'Maintenance', 'S-029': 'Broken', 'S-043': 'Working',
};

export type AdminLockersDemoSeatHistoryReason = 'Admission' | 'Shift Change' | 'Seat Change';
export interface AdminLockersDemoSeatHistoryEntry {
  seatNo: string;
  studentName: string;
  smartId: string;
  shift: string;
  occupiedFrom: string;
  occupiedTill: string;
  duration: string;
  reason: AdminLockersDemoSeatHistoryReason;
}

export const ADMIN_LOCKERS_DEMO_SEAT_HISTORY: AdminLockersDemoSeatHistoryEntry[] = [
  { seatNo: 'S-12', studentName: 'Rahul Verma', smartId: 'LIB-088', shift: 'Morning', occupiedFrom: '01 Jan 2024', occupiedTill: '31 Mar 2024', duration: '90 days', reason: 'Admission' },
  { seatNo: 'S-12', studentName: 'Pooja Nair', smartId: 'LIB-045', shift: 'Morning', occupiedFrom: '01 Apr 2024', occupiedTill: '15 Jun 2024', duration: '75 days', reason: 'Seat Change' },
  { seatNo: 'S-12', studentName: 'Arjun Singh', smartId: 'LIB-112', shift: 'Morning', occupiedFrom: '01 Jul 2024', occupiedTill: '30 Sep 2024', duration: '91 days', reason: 'Shift Change' },
  { seatNo: 'S-07', studentName: 'Meera Joshi', smartId: 'LIB-033', shift: 'Evening', occupiedFrom: '15 Feb 2024', occupiedTill: '14 May 2024', duration: '89 days', reason: 'Admission' },
  { seatNo: 'S-07', studentName: 'Karan Malhotra', smartId: 'LIB-077', shift: 'Evening', occupiedFrom: '01 Jun 2024', occupiedTill: '10 Aug 2024', duration: '70 days', reason: 'Seat Change' },
  { seatNo: 'S-31', studentName: 'Divya Kapoor', smartId: 'LIB-099', shift: 'Full Day', occupiedFrom: '01 Mar 2024', occupiedTill: '31 Aug 2024', duration: '183 days', reason: 'Admission' },
];
