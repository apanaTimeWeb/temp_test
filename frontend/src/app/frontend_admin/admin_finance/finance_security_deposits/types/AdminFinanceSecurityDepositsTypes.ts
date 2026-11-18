export type SecurityDepositStatus = 'held' | 'refunded' | 'forfeited';

export interface AdminFinanceSecurityDeposit {
  id: number;
  studentName: string;
  smartId: string;
  depositAmount: number; // in INR
  collectedBy: string;
  collectedDate: string;
  deductionAmount: number; // in INR
  deductionReason?: string;
  status: SecurityDepositStatus;
  refundedDate?: string;
  seat?: string;
  phone?: string;
  branch?: string;
}

export type DepositSortField =
  | 'studentName'
  | 'depositAmount'
  | 'status'
  | 'collectedBy'
  | 'collectedDate'
  | 'deductionAmount'
  | 'refundedDate';

export type AdminDepositsTimeHorizon =
  | 'all'
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'custom';
