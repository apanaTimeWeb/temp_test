export type ManagerFinanceRefundsRefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'unknown';
export interface ManagerFinanceRefundsRefund {
  id: string; studentName: string; smartId: string; amount: number; exitDate?: string; depositHeld?: number; deductionAmount?: number;
  netRefund?: number; status: ManagerFinanceRefundsRefundStatus; requestedDate?: string; processedDate?: string;
  paymentMethod?: string; rejectionReason?: string; currency?: string;
}
