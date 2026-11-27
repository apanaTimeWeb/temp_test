export type ManagerAttendanceQrScannerDemoStudent = {
  id: string;
  smartId: string;
  name: string;
  initials: string;
  shift: string;
  consecutiveAbsent: number;
  status: 'present' | 'absent' | 'late' | null;
  inTime: string;
  outTime: string;
};

export const MANAGER_ENGAGEMENT_DEMO_ATTENDANCE: readonly ManagerAttendanceQrScannerDemoStudent[] = [
  { id: '1', smartId: 'SL-001', name: 'Rahul Sharma', initials: 'RS', shift: 'Morning', consecutiveAbsent: 0, status: null, inTime: '09:00', outTime: '13:00' },
  { id: '2', smartId: 'SL-002', name: 'Priya Verma', initials: 'PV', shift: 'Morning', consecutiveAbsent: 4, status: null, inTime: '', outTime: '' },
  { id: '3', smartId: 'SL-003', name: 'Amit Kumar', initials: 'AK', shift: 'Afternoon', consecutiveAbsent: 0, status: null, inTime: '13:00', outTime: '18:00' },
  { id: '4', smartId: 'SL-004', name: 'Sneha Patel', initials: 'SP', shift: 'Morning', consecutiveAbsent: 7, status: null, inTime: '', outTime: '' },
  { id: '5', smartId: 'SL-005', name: 'Rohan Das', initials: 'RD', shift: 'Evening', consecutiveAbsent: 0, status: null, inTime: '18:00', outTime: '22:00' },
  { id: '6', smartId: 'SL-006', name: 'Kavita Singh', initials: 'KS', shift: 'Afternoon', consecutiveAbsent: 0, status: null, inTime: '13:00', outTime: '18:00' },
  { id: '7', smartId: 'SL-007', name: 'Arjun Mehta', initials: 'AM', shift: 'Morning', consecutiveAbsent: 2, status: null, inTime: '', outTime: '' },
  { id: '8', smartId: 'SL-008', name: 'Nisha Gupta', initials: 'NG', shift: 'Evening', consecutiveAbsent: 0, status: null, inTime: '18:00', outTime: '22:00' },
];

export type ManagerAttendanceQrScannerDemoAbsentee = {
  id: string;
  name: string;
  initials: string;
  smartId: string;
  shift: string;
  daysAbsent: number;
  lastSeen: string;
  parentPhone: string;
  parentEmail: string;
  notified: boolean;
};

export const MANAGER_ENGAGEMENT_DEMO_ABSENTEES: readonly ManagerAttendanceQrScannerDemoAbsentee[] = [
  { id: '1', name: 'Priya Verma', initials: 'PV', smartId: 'SL-002', shift: 'Morning', daysAbsent: 4, lastSeen: '2026-04-08', parentPhone: '+91 98••••1234', parentEmail: 'parent1@email.com', notified: false },
  { id: '2', name: 'Sneha Patel', initials: 'SP', smartId: 'SL-004', shift: 'Morning', daysAbsent: 8, lastSeen: '2026-04-04', parentPhone: '+91 97••••5678', parentEmail: 'parent2@email.com', notified: false },
  { id: '3', name: 'Deepak Mishra', initials: 'DM', smartId: 'SL-008', shift: 'Afternoon', daysAbsent: 3, lastSeen: '2026-04-09', parentPhone: '+91 96••••9012', parentEmail: 'parent3@email.com', notified: false },
  { id: '4', name: 'Anita Roy', initials: 'AR', smartId: 'SL-011', shift: 'Evening', daysAbsent: 12, lastSeen: '2026-03-31', parentPhone: '+91 95••••3456', parentEmail: 'parent4@email.com', notified: true },
  { id: '5', name: 'Vikram Nair', initials: 'VN', smartId: 'SL-015', shift: 'Morning', daysAbsent: 5, lastSeen: '2026-04-07', parentPhone: '+91 94••••7890', parentEmail: 'parent5@email.com', notified: false },
];

export interface ManagerQrScannerDirectoryMember {
  id: string;
  name: string;
  phone: string;
  seat?: string;
  shift?: string;
}

export const MANAGER_QR_SCANNER_DEMO_MEMBERS: readonly ManagerQrScannerDirectoryMember[] = [
  { id: 'LIB-001', name: 'Rahul Sharma', phone: '+91 98765 11001', seat: 'A-01', shift: 'Morning' },
  { id: 'LIB-002', name: 'Priya Nair', phone: '+91 98765 11002', seat: 'A-02', shift: 'Morning' },
  { id: 'LIB-003', name: 'Amit Verma', phone: '+91 98765 11003', seat: 'A-03', shift: 'Afternoon' },
  { id: 'LIB-004', name: 'Neha Singh', phone: '+91 98765 11004', seat: 'B-01', shift: 'Morning' },
  { id: 'LIB-005', name: 'Vikas Yadav', phone: '+91 98765 11005', seat: 'B-02', shift: 'Evening' },
  { id: 'LIB-006', name: 'Kavita Rao', phone: '+91 98765 11006', seat: 'C-01', shift: 'Morning' },
  { id: 'LIB-007', name: 'Suresh Iyer', phone: '+91 98765 11007', seat: 'C-02', shift: 'Evening' },
  { id: 'LIB-008', name: 'Deepak Joshi', phone: '+91 98765 11008', seat: 'D-01', shift: 'Full Day' },
  { id: 'LIB-009', name: 'Pooja Kapoor', phone: '+91 98765 11009', seat: 'D-02', shift: 'Evening' },
  { id: 'LIB-010', name: 'Manish Tiwari', phone: '+91 98765 11010', seat: 'E-01', shift: 'Morning' },
];
