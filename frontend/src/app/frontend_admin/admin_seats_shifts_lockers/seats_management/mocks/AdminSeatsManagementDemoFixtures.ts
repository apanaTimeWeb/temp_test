/**
 * Demo-only records used by the local seat/locker/allocations preview.
 * These records are intentionally not treated as persisted backend data.
 */
import type {
  AdminSeatsSeatStatus,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/config/admin_seats_management_constants';
import {
  ADMIN_SEATS_ALLOCATION_FEE_STATUS_BADGE_CLASS,
  ADMIN_SEATS_ALLOCATION_STATUS_BADGE_CLASS,
  ADMIN_SEATS_LOCKER_STATUS_BADGE_CLASS,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/config/admin_seats_management_constants';

export interface AdminSeatsDemoSeat {
  id: string;
  seatNo: string;
  branch: string;
  status: AdminSeatsSeatStatus;
  assignedTo: string;
  lastMaintenance: string;
}

export const ADMIN_SEATS_DEMO_SEATS: AdminSeatsDemoSeat[] = [
  { id: '1', seatNo: 'S-042', branch: 'North Wing', status: 'Working', assignedTo: 'Elias Hawthorne', lastMaintenance: 'Oct 14, 2024' },
  { id: '2', seatNo: 'S-109', branch: 'South Archive', status: 'Maintenance', assignedTo: '—', lastMaintenance: 'Today' },
  { id: '3', seatNo: 'S-012', branch: 'Main Reading', status: 'Broken', assignedTo: '—', lastMaintenance: 'Pending' },
  { id: '4', seatNo: 'S-088', branch: 'North Wing', status: 'Working', assignedTo: 'Seraphina Vane', lastMaintenance: 'Nov 02, 2024' },
];

export type AdminSeatsDemoLockerStatus = keyof typeof ADMIN_SEATS_LOCKER_STATUS_BADGE_CLASS;
export interface AdminSeatsDemoLocker {
  id: string;
  lockerId: string;
  status: AdminSeatsDemoLockerStatus;
  assignedTo: string;
  studentId: string;
  assignedSince: string;
}

export const ADMIN_SEATS_DEMO_LOCKERS: AdminSeatsDemoLocker[] = [
  { id: '1', lockerId: 'A01', status: 'Occupied', assignedTo: 'Alex Chen', studentId: 'LIB-021', assignedSince: '01 Oct 2024' },
  { id: '2', lockerId: 'A02', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '3', lockerId: 'A05', status: 'Maintenance', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '4', lockerId: 'B04', status: 'Occupied', assignedTo: 'Maria Vargas', studentId: 'LIB-055', assignedSince: '15 Sep 2024' },
  { id: '5', lockerId: 'B06', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '6', lockerId: 'C10', status: 'Occupied', assignedTo: 'Ravi Kumar', studentId: 'LIB-099', assignedSince: '2024-10-10' },
];

export type AdminSeatsDemoAllocationStatus = keyof typeof ADMIN_SEATS_ALLOCATION_STATUS_BADGE_CLASS;
export type AdminSeatsDemoFeeStatus = keyof typeof ADMIN_SEATS_ALLOCATION_FEE_STATUS_BADGE_CLASS;
export interface AdminSeatsDemoAllocation {
  studentName: string;
  smartId: string;
  phone: string;
  seatNo: string;
  shift: string;
  customSlots: string;
  lockerNo: string;
  feeStatus: AdminSeatsDemoFeeStatus;
  validFrom: string;
  validTill: string;
  daysLeft: number;
  status: AdminSeatsDemoAllocationStatus;
}

export const ADMIN_SEATS_DEMO_ALLOCATIONS: AdminSeatsDemoAllocation[] = [
  { studentName: 'Alex Rivera', smartId: 'LIB-001', phone: '+91 9876543210', seatNo: 'S-02', shift: 'Morning', customSlots: '8AM–10AM, 5PM–8PM', lockerNo: 'A01', feeStatus: 'Paid', validFrom: '01 Oct 2024', validTill: '31 Oct 2024', daysLeft: 7, status: 'Active' },
  { studentName: 'Priya Sharma', smartId: 'LIB-002', phone: '+91 9123456789', seatNo: 'S-11', shift: 'Evening', customSlots: '—', lockerNo: '—', feeStatus: 'Paid', validFrom: '15 Sep 2024', validTill: '14 Oct 2024', daysLeft: 3, status: 'Active' },
  { studentName: 'Rohan Mehta', smartId: 'LIB-003', phone: '+91 9988776655', seatNo: 'S-22', shift: 'Morning', customSlots: '—', lockerNo: 'B04', feeStatus: 'Due', validFrom: '01 Sep 2024', validTill: '2024-09-30', daysLeft: -5, status: 'Expired' },
  { studentName: 'Sneha Patel', smartId: 'LIB-004', phone: '+91 9001122334', seatNo: 'S-36', shift: 'Full Day', customSlots: '—', lockerNo: '—', feeStatus: 'Paid', validFrom: '2024-10-10', validTill: '09 Nov 2024', daysLeft: 20, status: 'Active' },
  { studentName: 'Vikram Rao', smartId: 'LIB-005', phone: '+91 9888123456', seatNo: 'S-45', shift: 'Evening', customSlots: '6PM–9PM', lockerNo: 'C10', feeStatus: 'Paid', validFrom: '20 Oct 2024', validTill: '19 Nov 2024', daysLeft: 30, status: 'Active' },
  { studentName: 'Ananya Gupta', smartId: 'LIB-006', phone: '+91 9777123456', seatNo: 'S-08', shift: 'Morning', customSlots: '—', lockerNo: '—', feeStatus: 'Due', validFrom: '2024-10-05', validTill: '04 Oct 2024', daysLeft: 12, status: 'Suspended' },
];


export interface AdminSeatsDemoMaintenanceLogEntry {
  id: string;
  num: number;
  date: string;
  remark: string;
  doneBy: string;
  statusBefore: AdminSeatsSeatStatus;
  statusAfter: AdminSeatsSeatStatus;
  costMinor: number | null;
  currencyCode: 'INR';
}

export const ADMIN_SEATS_DEMO_MAINTENANCE_LOGS: Record<string, AdminSeatsDemoMaintenanceLogEntry[]> = {
  'S-006': [
    { id: '1', num: 1, date: '2024-10-10', remark: 'Chair leg repaired', doneBy: 'Ramesh K.', statusBefore: 'Broken', statusAfter: 'Working', costMinor: 35000, currencyCode: 'INR' },
    { id: '2', num: 2, date: '2024-08-15', remark: 'Routine inspection', doneBy: 'Suresh M.', statusBefore: 'Working', statusAfter: 'Working', costMinor: null, currencyCode: 'INR' },
  ],
  'S-017': [
    { id: '3', num: 1, date: '2024-10-15', remark: 'Loose table joint — WIP', doneBy: 'Suresh M.', statusBefore: 'Working', statusAfter: 'Maintenance', costMinor: null, currencyCode: 'INR' },
  ],
  'S-029': [],
  'S-043': [
    { id: '4', num: 1, date: '2024-10-05', remark: 'Power socket replaced', doneBy: 'Ramesh K.', statusBefore: 'Broken', statusAfter: 'Working', costMinor: 20000, currencyCode: 'INR' },
    { id: '5', num: 2, date: '2024-07-20', remark: 'Socket loose — tightened', doneBy: 'Ramesh K.', statusBefore: 'Maintenance', statusAfter: 'Working', costMinor: 5000, currencyCode: 'INR' },
  ],
};

export const ADMIN_SEATS_DEMO_MAINTENANCE_SEAT_IDS = Object.keys(ADMIN_SEATS_DEMO_MAINTENANCE_LOGS);

export const ADMIN_SEATS_DEMO_MAINTENANCE_DAYS_SINCE: Record<string, number> = {
  'S-006': 14, 'S-017': 9, 'S-029': 62, 'S-043': 19,
};

export const ADMIN_SEATS_DEMO_MAINTENANCE_CURRENT_STATUS: Record<string, AdminSeatsSeatStatus> = {
  'S-006': 'Working', 'S-017': 'Maintenance', 'S-029': 'Broken', 'S-043': 'Working',
};

export type AdminSeatsDemoSeatHistoryReason = 'Admission' | 'Shift Change' | 'Seat Change';
export interface AdminSeatsDemoSeatHistoryEntry {
  seatNo: string;
  studentName: string;
  smartId: string;
  shift: string;
  occupiedFrom: string;
  occupiedTill: string;
  duration: string;
  reason: AdminSeatsDemoSeatHistoryReason;
}

export const ADMIN_SEATS_DEMO_SEAT_HISTORY: AdminSeatsDemoSeatHistoryEntry[] = [
  { seatNo: 'S-12', studentName: 'Rahul Verma', smartId: 'LIB-088', shift: 'Morning', occupiedFrom: '2024-01-01', occupiedTill: '2024-03-31', duration: '90 days', reason: 'Admission' },
  { seatNo: 'S-12', studentName: 'Pooja Nair', smartId: 'LIB-045', shift: 'Morning', occupiedFrom: '2024-04-01', occupiedTill: '2024-06-15', duration: '75 days', reason: 'Seat Change' },
  { seatNo: 'S-12', studentName: 'Arjun Singh', smartId: 'LIB-112', shift: 'Morning', occupiedFrom: '2024-07-01', occupiedTill: '2024-09-30', duration: '91 days', reason: 'Shift Change' },
  { seatNo: 'S-07', studentName: 'Meera Joshi', smartId: 'LIB-033', shift: 'Evening', occupiedFrom: '2024-02-15', occupiedTill: '2024-05-14', duration: '89 days', reason: 'Admission' },
  { seatNo: 'S-07', studentName: 'Karan Malhotra', smartId: 'LIB-077', shift: 'Evening', occupiedFrom: '2024-06-01', occupiedTill: '2024-08-10', duration: '70 days', reason: 'Seat Change' },
  { seatNo: 'S-31', studentName: 'Divya Kapoor', smartId: 'LIB-099', shift: 'Full Day', occupiedFrom: '2024-03-01', occupiedTill: '2024-08-31', duration: '183 days', reason: 'Admission' },
];
