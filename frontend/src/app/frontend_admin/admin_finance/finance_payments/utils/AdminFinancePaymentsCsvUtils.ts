import type { AdminFinancePaymentAmountUnit } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
export interface AdminFinancePaymentsCsvRecord {
  receiptNumber: string;
  date: string;
  studentName: string;
  smartId: string;
  amount: number;
  currencyCode?: string;
  amountUnit?: AdminFinancePaymentAmountUnit;
  mode: string;
  lateFee?: number;
  receivedBy: string;
  status: string;
}

function escapeAdminFinanceCsvCell(value: unknown): string {
  let text = String(value ?? '');
  if (typeof value === 'string' && /^[\u0000-\u0020]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

/** Exports only loaded ledger rows and preserves each row's declared currency/unit; absent metadata stays unknown. */
export interface AdminFinancePaymentsCsvLabels {
  receipt: string; date: string; student: string; smartId: string; amount: string; currency: string; amountUnit: string; mode: string; lateFee: string; receivedBy: string; status: string;
}

export function buildAdminFinancePaymentsCsv(records: readonly AdminFinancePaymentsCsvRecord[], headerLabels: AdminFinancePaymentsCsvLabels): string {
  const header = [headerLabels.receipt, headerLabels.date, headerLabels.student, headerLabels.smartId, headerLabels.amount, headerLabels.currency, headerLabels.amountUnit, headerLabels.mode, headerLabels.lateFee, headerLabels.receivedBy, headerLabels.status];
  const rows: readonly (readonly unknown[])[] = [header, ...records.map((payment) => [
    payment.receiptNumber, payment.date, payment.studentName, payment.smartId, payment.amount,
    payment.currencyCode ?? 'unknown', payment.amountUnit ?? 'unknown', payment.mode, payment.lateFee ?? '', payment.receivedBy, payment.status,
  ])];
  return `\uFEFF${rows.map((row) => row.map(escapeAdminFinanceCsvCell).join(',')).join('\r\n')}`;
}
