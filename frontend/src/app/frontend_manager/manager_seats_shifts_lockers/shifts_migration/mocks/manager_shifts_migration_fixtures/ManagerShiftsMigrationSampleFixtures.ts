/** Static preview data only; these values are not live allocations and must not imply persisted changes. */
export interface ManagerShiftsMigrationSampleShift { id: string; name: string; startTime: string; endTime: string; occupancy: number; capacity: number; active: boolean; }
export interface ManagerShiftsMigrationSampleLocker { id: string; lockerId: string; status: 'Free' | 'Occupied' | 'Maintenance'; assignedTo: string; studentId: string; assignedSince: string; }
export interface ManagerShiftsMigrationSampleSeat { id: string; seatNo: string; branch: string; status: 'Working' | 'Maintenance' | 'Broken'; assignedTo: string; lastMaintenance: string; }
export interface ManagerShiftsMigrationSampleBookedBlock { startH: number; endH: number; label: string; }
export interface ManagerShiftsMigrationSampleGapBlock { startH: number; endH: number; seats: number; revLoss: number; }
export interface ManagerShiftsMigrationSampleShiftGap { id: string; name: string; occupied: number; capacity: number; booked: ManagerShiftsMigrationSampleBookedBlock[]; gaps: ManagerShiftsMigrationSampleGapBlock[]; }
export interface ManagerShiftsMigrationSampleMigrationStudent { id: string; name: string; smartId: string; currentShift: string; currentSeat: string; validTill: string; plan: string; dailyRate: number; }
export interface ManagerShiftsMigrationSampleMigrationShift { name: string; seats: number; rate: number; }

export const MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SHIFTS: ManagerShiftsMigrationSampleShift[] = [
  { id: '1', name: 'Morning',   startTime: '06:00', endTime: '12:00', occupancy: 32, capacity: 40, active: true  },
  { id: '2', name: 'Afternoon', startTime: '12:00', endTime: '18:00', occupancy: 18, capacity: 40, active: true  },
  { id: '3', name: 'Evening',   startTime: '18:00', endTime: '22:00', occupancy: 0,  capacity: 40, active: false },
];

export const MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_LOCKERS: ManagerShiftsMigrationSampleLocker[] = [
  { id: '1', lockerId: 'A01', status: 'Occupied', assignedTo: 'Alex Chen', studentId: 'LIB-021', assignedSince: '2024-10-01' },
  { id: '2', lockerId: 'A02', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '3', lockerId: 'A05', status: 'Maintenance', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '4', lockerId: 'B04', status: 'Occupied', assignedTo: 'Maria Vargas', studentId: 'LIB-055', assignedSince: '2024-09-15' },
  { id: '5', lockerId: 'B06', status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' },
  { id: '6', lockerId: 'C10', status: 'Occupied', assignedTo: 'Ravi Kumar', studentId: 'LIB-099', assignedSince: '2024-10-10' },
];

export const MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SEATS: ManagerShiftsMigrationSampleSeat[] = [
  { id: '1', seatNo: 'S-042', branch: 'North Wing', status: 'Working', assignedTo: 'Elias Hawthorne', lastMaintenance: '2024-10-14' },
  { id: '2', seatNo: 'S-109', branch: 'South Archive', status: 'Maintenance', assignedTo: '—', lastMaintenance: 'Today' },
  { id: '3', seatNo: 'S-012', branch: 'Main Reading', status: 'Broken', assignedTo: '—', lastMaintenance: 'Pending' },
  { id: '4', seatNo: 'S-088', branch: 'North Wing', status: 'Working', assignedTo: 'Seraphina Vane', lastMaintenance: '2024-11-02' },
];

export const MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SHIFT_GAPS: ManagerShiftsMigrationSampleShiftGap[] = [
  {
    id: '1', name: 'Morning', occupied: 38, capacity: 60,
    booked: [
      { startH: 6,  endH: 10, label: 'Batch A (22 students)' },
      { startH: 10, endH: 12, label: 'Batch B (16 students)' },
    ],
    gaps: [{ startH: 8, endH: 10, seats: 6, revLoss: 60000 }],
  },
  {
    id: '2', name: 'Afternoon', occupied: 18, capacity: 60,
    booked: [
      { startH: 12, endH: 14, label: 'Batch C (10 students)' },
      { startH: 16, endH: 18, label: 'Batch D (8 students)'  },
    ],
    gaps: [{ startH: 14, endH: 16, seats: 12, revLoss: 96000 }],
  },
  {
    id: '3', name: 'Evening', occupied: 24, capacity: 40,
    booked: [
      { startH: 18, endH: 20, label: 'Batch E (14 students)' },
      { startH: 20, endH: 22, label: 'Batch F (10 students)' },
    ],
    gaps: [{ startH: 19, endH: 21, seats: 8, revLoss: 80000 }],
  },
];

export const MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_STUDENTS: ManagerShiftsMigrationSampleMigrationStudent[] = [
  { id: '1', name: 'Alex Rivera',  smartId: 'LIB-88429', currentShift: 'Morning',  currentSeat: 'A-12', validTill: '2025-04-30', plan: 'Monthly plan', dailyRate: 3300 },
  { id: '2', name: 'Priya Sharma', smartId: 'LIB-00234', currentShift: 'Evening',  currentSeat: 'B-05', validTill: '2025-05-15', plan: 'Monthly plan', dailyRate: 4000 },
  { id: '3', name: 'Rohan Mehta',  smartId: 'LIB-00567', currentShift: 'Full Day', currentSeat: 'C-08', validTill: '2025-06-01', plan: 'Monthly plan', dailyRate: 5000 },
];

export const MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_SHIFTS: ManagerShiftsMigrationSampleMigrationShift[] = [
  { name: 'Morning',   seats: 4, rate: 3300 },
  { name: 'Afternoon', seats: 8, rate: 3600 },
  { name: 'Evening',   seats: 2, rate: 4000 },
  { name: 'Full Day',  seats: 1, rate: 5000 },
];
