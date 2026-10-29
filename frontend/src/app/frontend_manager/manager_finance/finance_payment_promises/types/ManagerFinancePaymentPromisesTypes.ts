export type ManagerFinancePaymentPromisesPaymentMode = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';
export type ManagerFinancePaymentPromisesPaymentStatus = 'valid' | 'deleted' | 'unknown';
/** Monetary fields are integer minor units (paise/cents) per the frontend contract. */
export interface ManagerFinancePaymentPromisesPayment { id: string; receiptNumber?: string; date: string; studentName: string; smartId: string; amount: number; mode: ManagerFinancePaymentPromisesPaymentMode; txnId?: string; lateFee?: number; receivedBy: string; remark?: string; status: ManagerFinancePaymentPromisesPaymentStatus; deletionReason?: string; currency?: string; }
export type ManagerFinancePaymentPromisesRefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'unknown';
/** Monetary values remain absent when the supplied API contract does not identify their meaning or currency. */
export interface ManagerFinancePaymentPromisesRefund { id: string; studentName: string; smartId: string; exitDate?: string; depositHeld?: number; deductionAmount?: number; netRefund?: number; status: ManagerFinancePaymentPromisesRefundStatus; requestedDate?: string; processedDate?: string; paymentMethod?: string; rejectionReason?: string; currency?: string; }

