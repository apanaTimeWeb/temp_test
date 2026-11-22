import type { ReactNode } from 'react';

export type AdminFinanceRefundAmountUnit = 'minor' | 'major';

export type AdminFinanceRefundStatus2 = 'pending' | 'approved' | 'rejected' | 'processed';

export interface AdminFinanceRefund {
  id: string | number;
  studentName: string;
  smartId: string;
  exitDate?: string;
  depositHeld: number;
  deductionAmount: number;
  netRefund: number;
  currencyCode?: string;
  amountUnit?: AdminFinanceRefundAmountUnit;
  status: AdminFinanceRefundStatus2;
  processedDate?: string;
  paymentMethod?: string;
  rejectionReason?: string;
  branchName?: string;
  branchId?: string;
  studentPhone?: string;
  studentEmail?: string;
  transactionUtr?: string;
  beneficiaryAccount?: string;
  receiptNumber?: string;
  disbursedAt?: string;
  disbursedBy?: string;
}

export type AdminFinanceRefundsScenario = "ACTIVE" | "EMPTY" | "SERVER_500" | "TIMEOUT" | "UNAUTHORIZED";

export interface AdminFinanceRefundsHarnessProps {
  children?: ReactNode;
  scenario?: AdminFinanceRefundsScenario;
}
