export type SeatStatus = 'free' | 'occupied' | 'expiring' | 'maintenance' | 'unknown';
export type LockerCellStatus = 'free' | 'occupied' | 'maintenance' | 'unknown';
export type AllocationStatus = 'Active' | 'Expired' | 'Suspended' | 'unknown';
export type SeatHistoryReason = 'Admission' | 'Shift Change' | 'Seat Change' | 'unknown' | (string & {});

export interface SeatData { uuid?: string; id: string; status: SeatStatus; student?: string; smartId?: string; shift?: string; expiry?: string; }
export interface LockerData { uuid?: string; id: string; status: LockerCellStatus; student?: string; smartId?: string; location?: string; }
export interface ManagerShiftsMigrationAllocationRow { id: string; studentName: string; smartId: string; seatNo: string; shift: string; customSlots: string; lockerNo: string; validFrom: string; validTill: string; daysLeft: number; status: AllocationStatus; }
export interface ManagerShiftsMigrationSeatHistoryRow { seatNo: string; studentName: string; smartId: string; shift: string; occupiedFrom: string; occupiedTill: string; duration: string; reason: SeatHistoryReason; }


export interface ManagerShiftsMigrationStepperProps { step: number; }
export interface ManagerShiftsMigrationSummaryProps {
  student: { name: string; smartId: string; currentShift: string; currentSeat: string; validTill: string };
  daysLeft: number; newShift: string; newSeat: string; showCustomSlot: boolean; customStart: string; customEnd: string;
}

export type ManagerShiftsMigrationPayMode = 'Cash' | 'UPI' | 'Card';
export interface ManagerShiftsMigrationReviewProps {
  oldRate: number; newRate: number; daysLeft: number; adjustment: number; isPaying: boolean;
  payMode: ManagerShiftsMigrationPayMode; txnId: string; remark: string;
  onPayModeChange: (mode: ManagerShiftsMigrationPayMode) => void;
  onTxnIdChange: (value: string) => void; onRemarkChange: (value: string) => void;
}
