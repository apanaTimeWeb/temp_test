export type SeatStatus = 'free' | 'occupied' | 'expiring' | 'maintenance' | 'unknown';
export type LockerCellStatus = 'free' | 'occupied' | 'maintenance' | 'unknown';
export type AllocationStatus = 'Active' | 'Expired' | 'Suspended' | 'unknown';
export type SeatHistoryReason = 'Admission' | 'Shift Change' | 'Seat Change' | 'unknown' | (string & {});

export interface SeatData { uuid?: string; id: string; status: SeatStatus; student?: string; smartId?: string; shift?: string; expiry?: string; }
export interface LockerData { uuid?: string; id: string; status: LockerCellStatus; student?: string; smartId?: string; location?: string; }
export interface ManagerLockersManagementAllocationRow { id: string; studentName: string; smartId: string; seatNo: string; shift: string; customSlots: string; lockerNo: string; validFrom: string; validTill: string; daysLeft: number; status: AllocationStatus; }
export interface ManagerLockersManagementSeatHistoryRow { seatNo: string; studentName: string; smartId: string; shift: string; occupiedFrom: string; occupiedTill: string; duration: string; reason: SeatHistoryReason; }
