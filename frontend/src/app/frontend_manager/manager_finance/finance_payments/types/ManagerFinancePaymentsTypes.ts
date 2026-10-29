export type ManagerFinancePaymentsPaymentMode = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';
export type ManagerFinancePaymentsPaymentStatus = 'valid' | 'deleted' | 'unknown';
export interface ManagerFinancePaymentsPayment {
  id: string; receiptNumber?: string; date: string; studentName: string; smartId: string;
  amount: number; mode: ManagerFinancePaymentsPaymentMode; txnId?: string; lateFee?: number;
  receivedBy: string; remark?: string; status: ManagerFinancePaymentsPaymentStatus;
  deletionReason?: string; currency?: string;
}
