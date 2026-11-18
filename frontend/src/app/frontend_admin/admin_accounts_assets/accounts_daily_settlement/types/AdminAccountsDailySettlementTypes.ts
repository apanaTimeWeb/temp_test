// types/AdminAccountsDailySettlementTypes.ts

export type SettlementStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'DISCREPANCY_FLAGGED';

export type DiscrepancyResolutionAction = 'DEDUCT_SALARY' | 'CARRY_FORWARD' | 'IMMEDIATE_DEPOSIT' | 'WRITE_OFF';

export interface DailySettlementRecord {
  id: string;
  date: string;
  branchId: string;
  branchName: string;
  shiftName: string;
  managerId: string;
  managerName: string;
  openingCash: number; // in paise
  cashCollected: number; // in paise
  upiCollected: number; // in paise
  expensesPaid: number; // in paise
  expectedClosingCash: number; // in paise
  actualHandoverCash: number; // in paise
  difference: number; // in paise (actual - expected)
  bankDepositSlipUrl?: string | null;
  bankReferenceNumber?: string | null;
  managerNotes?: string | null;
  adminNotes?: string | null;
  status: SettlementStatus;
  discrepancyReason?: string | null;
  resolutionAction?: DiscrepancyResolutionAction | null;
  resolutionNotes?: string | null;
  createdAt: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
}

export interface DailySettlementKpiSummary {
  expectedCashToday: number; // in paise
  clearedCashToday: number; // in paise
  pendingHandoverAmount: number; // in paise
  discrepancyShortageAmount: number; // in paise
  totalPendingCount: number;
  totalFlaggedCount: number;
}

export interface DailySettlementFilterParams {
  branchId?: string;
  status?: SettlementStatus | 'ALL';
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApproveSettlementPayload {
  settlementId: string;
  adminNotes?: string;
  verifiedCashAmount: number;
}

export interface FlagDiscrepancyPayload {
  settlementId: string;
  discrepancyReason: string;
  adminNotes: string;
  resolutionAction?: DiscrepancyResolutionAction;
}

