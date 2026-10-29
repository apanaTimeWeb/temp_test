export type ManagerFinanceReceiptsPaymentMode = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';
export type ManagerFinanceReceiptsPaymentStatus = 'valid' | 'deleted' | 'unknown';
/** Monetary fields are integer minor units (paise/cents) per the frontend contract. */
export interface ManagerFinanceReceiptsPayment { id: string; receiptNumber?: string; date: string; studentName: string; smartId: string; amount: number; mode: ManagerFinanceReceiptsPaymentMode; txnId?: string; lateFee?: number; receivedBy: string; remark?: string; status: ManagerFinanceReceiptsPaymentStatus; deletionReason?: string; currency?: string; }
export type ManagerFinanceReceiptsRefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'unknown';
/** Monetary values remain absent when the supplied API contract does not identify their meaning or currency. */
export interface ManagerFinanceReceiptsRefund { id: string; studentName: string; smartId: string; exitDate?: string; depositHeld?: number; deductionAmount?: number; netRefund?: number; status: ManagerFinanceReceiptsRefundStatus; requestedDate?: string; processedDate?: string; paymentMethod?: string; rejectionReason?: string; currency?: string; }





