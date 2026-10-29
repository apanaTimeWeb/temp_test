export type ManagerFinanceAutoSuspendPaymentMode = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';
export type ManagerFinanceAutoSuspendPaymentStatus = 'valid' | 'deleted' | 'unknown';
/** Monetary fields are integer minor units (paise/cents) per the frontend contract. */
export interface ManagerFinanceAutoSuspendPayment { id: string; receiptNumber?: string; date: string; studentName: string; smartId: string; amount: number; mode: ManagerFinanceAutoSuspendPaymentMode; txnId?: string; lateFee?: number; receivedBy: string; remark?: string; status: ManagerFinanceAutoSuspendPaymentStatus; deletionReason?: string; currency?: string; }
export type ManagerFinanceAutoSuspendRefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'unknown';
/** Monetary values remain absent when the supplied API contract does not identify their meaning or currency. */
export interface ManagerFinanceAutoSuspendRefund { id: string; studentName: string; smartId: string; exitDate?: string; depositHeld?: number; deductionAmount?: number; netRefund?: number; status: ManagerFinanceAutoSuspendRefundStatus; requestedDate?: string; processedDate?: string; paymentMethod?: string; rejectionReason?: string; currency?: string; }


export interface ManagerFinanceAutoSuspendConfig { daysBeforeSuspend: number; currentlySuspended: number; autoRestoredThisMonth: number; manualRestores: number; }
export interface ManagerFinanceAutoSuspendSuspendedStudent { id: number; studentId: number; studentName: string; smartId: string; seat: string; shift: string; daysOverdue: number; suspendedSince: string; }

