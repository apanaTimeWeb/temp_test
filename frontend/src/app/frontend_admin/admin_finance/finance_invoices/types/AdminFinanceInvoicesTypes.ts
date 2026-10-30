import type { ReactNode } from 'react';

export interface AdminFinanceDemoInvoice { id: string; invoiceNumber: string; studentName: string; studentId: string; phone: string; invoiceDate: string; grandTotal: number; paymentStatus: AdminFinanceDemoInvoicePaymentStatus; paymentMode: string; planName: string; shift: string; seat: string; }

export type AdminFinanceDemoInvoiceDetail = AdminFinanceDemoInvoice & {
  libraryName: string;
  libraryAddress: string;
  libraryGstin: string;
  libraryPhone: string;
  studentSmartId: string;
  studentPhone: string;
  studentAddress: string;
  paymentDate: string;
  items: { description: string; hsnCode: string; duration: string; amount: number; gstPercent: number; gstAmount: number }[];
  subtotal: number;
  totalGst: number;
  paymentTransactionId: string;
};

export type AdminFinanceDemoInvoicePaymentStatus = 'paid' | 'pending' | 'overdue';

export interface AdminFinanceEmptyStateProps {
  title: string;
  description?: string;
}

export type FilterStatus = 'all' | 'paid' | 'pending' | 'overdue';

export type RouteSearchParams = Record<string, string | string[] | undefined>;

export type AdminFinanceInvoicesScenario = "ACTIVE" | "EMPTY" | "SERVER_500" | "TIMEOUT" | "UNAUTHORIZED";

export interface AdminFinanceInvoicesHarnessProps {
  children?: ReactNode;
  scenario?: AdminFinanceInvoicesScenario;
}
