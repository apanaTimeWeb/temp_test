export type ManagerFinanceLateFeesPaymentMode = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';
export type ManagerFinanceLateFeesPaymentStatus = 'valid' | 'deleted' | 'unknown';
/** Monetary fields are integer minor units (paise/cents) per the frontend contract. */
export interface ManagerFinanceLateFeesPayment { id: string; receiptNumber?: string; date: string; studentName: string; smartId: string; amount: number; mode: ManagerFinanceLateFeesPaymentMode; txnId?: string; lateFee?: number; receivedBy: string; remark?: string; status: ManagerFinanceLateFeesPaymentStatus; deletionReason?: string; currency?: string; }
export type ManagerFinanceLateFeesRefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'unknown';
/** Monetary values remain absent when the supplied API contract does not identify their meaning or currency. */
export interface ManagerFinanceLateFeesRefund { id: string; studentName: string; smartId: string; exitDate?: string; depositHeld?: number; deductionAmount?: number; netRefund?: number; status: ManagerFinanceLateFeesRefundStatus; requestedDate?: string; processedDate?: string; paymentMethod?: string; rejectionReason?: string; currency?: string; }





