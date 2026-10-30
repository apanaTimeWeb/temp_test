import type { ReactNode } from 'react';

export type AdminFinancePaymentAmountUnit = 'minor' | 'major';

export type AdminFinancePaymentMode2 = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';

export type AdminFinancePaymentStatus3 = 'valid' | 'deleted' | 'unknown';

export interface AdminFinancePayment {
  id: string | number;
  receiptNumber: string;
  date: string;
  studentName: string;
  smartId: string;
  amount: number;
  currencyCode?: string;
  amountUnit?: AdminFinancePaymentAmountUnit;
  mode: AdminFinancePaymentMode2;
  txnId?: string;
  lateFee?: number;
  receivedBy: string;
  status: AdminFinancePaymentStatus3;
  deletionReason?: string;
}

export type AdminFinancePaymentsScenario = "ACTIVE" | "EMPTY" | "SERVER_500" | "TIMEOUT" | "UNAUTHORIZED";

export interface AdminFinancePaymentsHarnessProps {
  children?: ReactNode;
  scenario?: AdminFinancePaymentsScenario;
}
