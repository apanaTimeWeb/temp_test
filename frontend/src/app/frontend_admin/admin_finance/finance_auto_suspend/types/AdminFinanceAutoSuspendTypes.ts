export interface AdminFinanceAutoSuspendConfig {
  daysBeforeSuspend: number;
  currentlySuspended: number;
  autoRestoredThisMonth: number;
  manualRestores: number;
}

export interface AdminFinanceAutoSuspendSuspendedStudent {
  id: number;
  studentId: number;
  studentName: string;
  smartId: string;
  seat: string;
  shift: string;
  daysOverdue: number;
  suspendedSince: string;
  phone?: string;
  duesAmount: number;
  planName: string;
  branch: string;
}

export type SuspendSortField =
  | 'studentName'
  | 'seat'
  | 'shift'
  | 'daysOverdue'
  | 'suspendedSince'
  | 'duesAmount';
