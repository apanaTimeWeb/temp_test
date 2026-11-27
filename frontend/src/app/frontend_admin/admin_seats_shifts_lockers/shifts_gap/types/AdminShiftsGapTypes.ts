export interface AdminShiftsBookedBlock {
  startH: number;
  endH: number;
  label: string;
}

export interface AdminShiftsGapBlock {
  startH: number;
  endH: number;
  seats: number;
  revLoss: number;
}

export interface AdminShiftsShiftGapFixture {
  id: string;
  name: string;
  occupied: number;
  capacity: number;
  booked: AdminShiftsBookedBlock[];
  gaps: AdminShiftsGapBlock[];
}

