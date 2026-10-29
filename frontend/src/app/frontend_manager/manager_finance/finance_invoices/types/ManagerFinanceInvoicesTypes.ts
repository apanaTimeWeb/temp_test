export type ManagerFinanceInvoicesPaymentMode = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';
export type ManagerFinanceInvoicesPaymentStatus = 'valid' | 'deleted' | 'unknown';
/** Monetary fields are integer minor units (paise/cents) per the frontend contract. */
export interface ManagerFinanceInvoicesPayment { id: string; receiptNumber?: string; date: string; studentName: string; smartId: string; amount: number; mode: ManagerFinanceInvoicesPaymentMode; txnId?: string; lateFee?: number; receivedBy: string; remark?: string; status: ManagerFinanceInvoicesPaymentStatus; deletionReason?: string; currency?: string; }
export type ManagerFinanceInvoicesRefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'unknown';
/** Monetary values remain absent when the supplied API contract does not identify their meaning or currency. */
export interface ManagerFinanceInvoicesRefund { id: string; studentName: string; smartId: string; exitDate?: string; depositHeld?: number; deductionAmount?: number; netRefund?: number; status: ManagerFinanceInvoicesRefundStatus; requestedDate?: string; processedDate?: string; paymentMethod?: string; rejectionReason?: string; currency?: string; }





