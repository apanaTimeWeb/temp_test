import type { ReactNode } from 'react';

export interface AdminFinanceDemoReceipt { id: string; receiptNumber: string; studentName: string; studentId: string; phone: string; date: string; amount: number; paymentMode: string; planName: string; shift: string; seat: string; }

export type AdminFinanceDemoReceiptDetail = AdminFinanceDemoReceipt & {
  receiptNo: string;
  plan: string;
  items: { label: string; amount: number }[];
  total: number;
  txnId: string;
};

export interface AdminFinanceEmptyStateProps {
  title: string;
  description?: string;
}

export type FilterMode = 'all' | 'upi' | 'cash' | 'card' | 'bank transfer';

export type RouteSearchParams = Record<string, string | string[] | undefined>;

export type AdminFinanceReceiptsScenario = "ACTIVE" | "EMPTY" | "SERVER_500" | "TIMEOUT" | "UNAUTHORIZED";

export interface AdminFinanceReceiptsHarnessProps {
  children?: ReactNode;
  scenario?: AdminFinanceReceiptsScenario;
}
