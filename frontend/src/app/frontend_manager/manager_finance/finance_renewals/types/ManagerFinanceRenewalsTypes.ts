export type ManagerFinanceRenewalsPaymentMode = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';
export type ManagerFinanceRenewalsPaymentStatus = 'valid' | 'deleted' | 'unknown';
/** Monetary fields are integer minor units (paise/cents) per the frontend contract. */
export interface ManagerFinanceRenewalsPayment { id: string; receiptNumber?: string; date: string; studentName: string; smartId: string; amount: number; mode: ManagerFinanceRenewalsPaymentMode; txnId?: string; lateFee?: number; receivedBy: string; remark?: string; status: ManagerFinanceRenewalsPaymentStatus; deletionReason?: string; currency?: string; }
export type ManagerFinanceRenewalsRefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'unknown';
/** Monetary values remain absent when the supplied API contract does not identify their meaning or currency. */
export interface ManagerFinanceRenewalsRefund { id: string; studentName: string; smartId: string; exitDate?: string; depositHeld?: number; deductionAmount?: number; netRefund?: number; status: ManagerFinanceRenewalsRefundStatus; requestedDate?: string; processedDate?: string; paymentMethod?: string; rejectionReason?: string; currency?: string; }





/** URL filter values supported by the renewals feature. */
export type ManagerFinanceRenewalsRenewalFilter = 'expired' | 'expiring_7' | 'expiring_15';
