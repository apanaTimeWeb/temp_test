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
