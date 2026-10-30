/**
 * Demo-only records used by the local seat/locker/allocations preview.
 * These records are intentionally not treated as persisted backend data.
 */
import type {
  AdminAllocationsSeatStatus,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/config/admin_allocations.url_config';
import {
  ADMIN_ALLOCATIONS_ALLOCATION_FEE_STATUS_BADGE_CLASS,
  ADMIN_ALLOCATIONS_ALLOCATION_STATUS_BADGE_CLASS,
  ADMIN_ALLOCATIONS_LOCKER_STATUS_BADGE_CLASS,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/config/admin_allocations.url_config';

export interface AdminAllocationsDemoSeat {
  id: string;
  seatNo: string;
  branch: string;
  status: AdminAllocationsSeatStatus;
  assignedTo: string;
  lastMaintenance: string;
}

export const ADMIN_ALLOCATIONS_DEMO_SEATS: AdminAllocationsDemoSeat[] = [
  { id: '1', seatNo: 'S-042', branch: 'North Wing', status: 'Working', assignedTo: 'Elias Hawthorne', lastMaintenance: 'Oct 14, 2024' },
  { id: '2', seatNo: 'S-109', branch: 'South Archive', status: 'Maintenance', assignedTo: '—', lastMaintenance: 'Today' },
  { id: '3', seatNo: 'S-012', branch: 'Main Reading', status: 'Broken', assignedTo: '—', lastMaintenance: 'Pending' },
  { id: '4', seatNo: 'S-088', branch: 'North Wing', status: 'Working', assignedTo: 'Seraphina Vane', lastMaintenance: 'Nov 02, 2024' },
];

export type AdminAllocationsDemoLockerStatus = keyof typeof ADMIN_ALLOCATIONS_LOCKER_STATUS_BADGE_CLASS;
export interface AdminAllocationsDemoLocker {
  id: string;
  lockerId: string;
  status: AdminAllocationsDemoLockerStatus;
  assignedTo: string;
  studentId: string;
  assignedSince: string;
}

export const ADMIN_ALLOCATIONS_DEMO_LOCKERS: AdminAllocationsDemoLocker[] = [
  { id: '1', lockerId: 'A01', status: 'Occupied', assignedTo: 'Alex Chen', studentId: 'LIB-021', assignedSince: '01 Oct 2024' },
  { id: '2', lockerId: 'A02', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '3', lockerId: 'A05', status: 'Maintenance', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '4', lockerId: 'B04', status: 'Occupied', assignedTo: 'Maria Vargas', studentId: 'LIB-055', assignedSince: '15 Sep 2024' },
  { id: '5', lockerId: 'B06', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '6', lockerId: 'C10', status: 'Occupied', assignedTo: 'Ravi Kumar', studentId: 'LIB-099', assignedSince: '10 Oct 2024' },
];

export type AdminAllocationsDemoAllocationStatus = keyof typeof ADMIN_ALLOCATIONS_ALLOCATION_STATUS_BADGE_CLASS;
export type AdminAllocationsDemoFeeStatus = keyof typeof ADMIN_ALLOCATIONS_ALLOCATION_FEE_STATUS_BADGE_CLASS;
export interface AdminAllocationsDemoAllocation {
  studentName: string;
  smartId: string;
  phone: string;
  seatNo: string;
  shift: string;
  customSlots: string;
  lockerNo: string;
  feeStatus: AdminAllocationsDemoFeeStatus;
  validFrom: string;
  validTill: string;
  daysLeft: number;
  status: AdminAllocationsDemoAllocationStatus;
}

function adminAllocationsDemoDateOffset(offsetDays: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date).replace(/ /g, ' ');
}

export const ADMIN_ALLOCATIONS_DEMO_ALLOCATIONS: AdminAllocationsDemoAllocation[] = [
  { studentName: 'Alex Rivera', smartId: 'LIB-001', phone: '+91 9876543210', seatNo: 'S-02', shift: 'Morning', customSlots: '8AM–10AM, 5PM–8PM', lockerNo: 'A01', feeStatus: 'Paid', validFrom: adminAllocationsDemoDateOffset(-1), validTill: adminAllocationsDemoDateOffset(30), daysLeft: 30, status: 'Active' },
  { studentName: 'Priya Sharma', smartId: 'LIB-002', phone: '+91 9123456789', seatNo: 'S-11', shift: 'Evening', customSlots: '—', lockerNo: '—', feeStatus: 'Paid', validFrom: adminAllocationsDemoDateOffset(-30), validTill: adminAllocationsDemoDateOffset(3), daysLeft: 3, status: 'Active' },
  { studentName: 'Rohan Mehta', smartId: 'LIB-003', phone: '+91 9988776655', seatNo: 'S-22', shift: 'Morning', customSlots: '—', lockerNo: 'B04', feeStatus: 'Due', validFrom: adminAllocationsDemoDateOffset(-35), validTill: adminAllocationsDemoDateOffset(-5), daysLeft: -5, status: 'Expired' },
  { studentName: 'Sneha Patel', smartId: 'LIB-004', phone: '+91 9001122334', seatNo: 'S-36', shift: 'Full Day', customSlots: '—', lockerNo: '—', feeStatus: 'Paid', validFrom: adminAllocationsDemoDateOffset(-10), validTill: adminAllocationsDemoDateOffset(20), daysLeft: 20, status: 'Active' },
  { studentName: 'Vikram Rao', smartId: 'LIB-005', phone: '+91 9888123456', seatNo: 'S-45', shift: 'Evening', customSlots: '6PM–9PM', lockerNo: 'C10', feeStatus: 'Paid', validFrom: adminAllocationsDemoDateOffset(0), validTill: adminAllocationsDemoDateOffset(30), daysLeft: 30, status: 'Active' },
  { studentName: 'Ananya Gupta', smartId: 'LIB-006', phone: '+91 9777123456', seatNo: 'S-08', shift: 'Morning', customSlots: '—', lockerNo: '—', feeStatus: 'Due', validFrom: adminAllocationsDemoDateOffset(-5), validTill: adminAllocationsDemoDateOffset(12), daysLeft: 12, status: 'Suspended' },
];


export interface AdminAllocationsDemoMaintenanceLogEntry {
  id: string;
  num: number;
  date: string;
  remark: string;
  doneBy: string;
  statusBefore: AdminAllocationsSeatStatus;
  statusAfter: AdminAllocationsSeatStatus;
  costMinor: number | null;
  currencyCode: 'INR';
}

export const ADMIN_ALLOCATIONS_DEMO_MAINTENANCE_LOGS: Record<string, AdminAllocationsDemoMaintenanceLogEntry[]> = {
  'S-006': [
    { id: '1', num: 1, date: '10 Oct 2024', remark: 'Chair leg repaired', doneBy: 'Ramesh K.', statusBefore: 'Broken', statusAfter: 'Working', costMinor: 35000, currencyCode: 'INR' },
    { id: '2', num: 2, date: '15 Aug 2024', remark: 'Routine inspection', doneBy: 'Suresh M.', statusBefore: 'Working', statusAfter: 'Working', costMinor: null, currencyCode: 'INR' },
  ],
  'S-017': [
    { id: '3', num: 1, date: '15 Oct 2024', remark: 'Loose table joint — WIP', doneBy: 'Suresh M.', statusBefore: 'Working', statusAfter: 'Maintenance', costMinor: null, currencyCode: 'INR' },
  ],
  'S-029': [],
  'S-043': [
    { id: '4', num: 1, date: '05 Oct 2024', remark: 'Power socket replaced', doneBy: 'Ramesh K.', statusBefore: 'Broken', statusAfter: 'Working', costMinor: 20000, currencyCode: 'INR' },
    { id: '5', num: 2, date: '20 Jul 2024', remark: 'Socket loose — tightened', doneBy: 'Ramesh K.', statusBefore: 'Maintenance', statusAfter: 'Working', costMinor: 5000, currencyCode: 'INR' },
  ],
};

export const ADMIN_ALLOCATIONS_DEMO_MAINTENANCE_SEAT_IDS = Object.keys(ADMIN_ALLOCATIONS_DEMO_MAINTENANCE_LOGS);

export const ADMIN_ALLOCATIONS_DEMO_MAINTENANCE_DAYS_SINCE: Record<string, number> = {
  'S-006': 14, 'S-017': 9, 'S-029': 62, 'S-043': 19,
};

export const ADMIN_ALLOCATIONS_DEMO_MAINTENANCE_CURRENT_STATUS: Record<string, AdminAllocationsSeatStatus> = {
  'S-006': 'Working', 'S-017': 'Maintenance', 'S-029': 'Broken', 'S-043': 'Working',
};

export type AdminAllocationsDemoSeatHistoryReason = 'Admission' | 'Shift Change' | 'Seat Change';
export interface AdminAllocationsDemoSeatHistoryEntry {
  seatNo: string;
  studentName: string;
  smartId: string;
  shift: string;
  occupiedFrom: string;
  occupiedTill: string;
  duration: string;
  reason: AdminAllocationsDemoSeatHistoryReason;
}

export const ADMIN_ALLOCATIONS_DEMO_SEAT_HISTORY: AdminAllocationsDemoSeatHistoryEntry[] = [
  { seatNo: 'S-12', studentName: 'Rahul Verma', smartId: 'LIB-088', shift: 'Morning', occupiedFrom: '01 Jan 2024', occupiedTill: '31 Mar 2024', duration: '90 days', reason: 'Admission' },
  { seatNo: 'S-12', studentName: 'Pooja Nair', smartId: 'LIB-045', shift: 'Morning', occupiedFrom: '01 Apr 2024', occupiedTill: '15 Jun 2024', duration: '75 days', reason: 'Seat Change' },
  { seatNo: 'S-12', studentName: 'Arjun Singh', smartId: 'LIB-112', shift: 'Morning', occupiedFrom: '01 Jul 2024', occupiedTill: '30 Sep 2024', duration: '91 days', reason: 'Shift Change' },
  { seatNo: 'S-07', studentName: 'Meera Joshi', smartId: 'LIB-033', shift: 'Evening', occupiedFrom: '15 Feb 2024', occupiedTill: '14 May 2024', duration: '89 days', reason: 'Admission' },
  { seatNo: 'S-07', studentName: 'Karan Malhotra', smartId: 'LIB-077', shift: 'Evening', occupiedFrom: '01 Jun 2024', occupiedTill: '10 Aug 2024', duration: '70 days', reason: 'Seat Change' },
  { seatNo: 'S-31', studentName: 'Divya Kapoor', smartId: 'LIB-099', shift: 'Full Day', occupiedFrom: '01 Mar 2024', occupiedTill: '31 Aug 2024', duration: '183 days', reason: 'Admission' },
];
