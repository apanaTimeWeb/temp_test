export type ManagerFinanceFinesPaymentsPaymentMode = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';
export type ManagerFinanceFinesPaymentsPaymentStatus = 'valid' | 'deleted' | 'unknown';
/** Monetary fields are integer minor units (paise/cents) per the frontend contract. */
export interface ManagerFinanceFinesPaymentsPayment { id: string; receiptNumber?: string; date: string; studentName: string; smartId: string; amount: number; mode: ManagerFinanceFinesPaymentsPaymentMode; txnId?: string; lateFee?: number; receivedBy: string; remark?: string; status: ManagerFinanceFinesPaymentsPaymentStatus; deletionReason?: string; currency?: string; }
export type ManagerFinanceFinesPaymentsRefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'unknown';
/** Monetary values remain absent when the supplied API contract does not identify their meaning or currency. */
export interface ManagerFinanceFinesPaymentsRefund { id: string; studentName: string; smartId: string; exitDate?: string; depositHeld?: number; deductionAmount?: number; netRefund?: number; status: ManagerFinanceFinesPaymentsRefundStatus; requestedDate?: string; processedDate?: string; paymentMethod?: string; rejectionReason?: string; currency?: string; }

export type ManagerFinanceFinesPaymentsCollectFeeMode = 'cash' | 'upi' | 'card' | 'bank';
/** `dueAmount` is integer minor units. */
export interface ManagerFinanceFinesPaymentsCollectFeeStudent {
  id: number;
  name: string;
  smartId: string;
  phone: string;
  status: 'active' | 'expired' | 'suspended';
  dueAmount: number;
  plan: string;
  shift: string;
  seat: string;
  validUpto: string;
}
export interface ManagerFinanceFinesPaymentsCollectFeeReceiptPreviewProps {
  selectedStudent: ManagerFinanceFinesPaymentsCollectFeeStudent | null;
  mode: ManagerFinanceFinesPaymentsCollectFeeMode;
  modeLabels: Record<ManagerFinanceFinesPaymentsCollectFeeMode, string>;
  amount: string;
  total: number;
  isSubmitting: boolean;
  isCollectAvailable: boolean;
  receiptNumber: string;
  onCollect: () => void;
  onCancel: () => void;
}


export interface ManagerFinanceFinesPaymentsFineReceipt {
  receiptNo: string; member: string; fineType: string; amount: string; mode: string; date: string; collectedBy: string; txnId: string;
}
export interface ManagerFinanceFinesPaymentsFineReceiptPanelProps {
  receipt: ManagerFinanceFinesPaymentsFineReceipt | null;
  onCreateNew: () => void;
}

export interface ManagerFinanceFinesPaymentsAutoSuspendConfig { daysBeforeSuspend: number; currentlySuspended: number; autoRestoredThisMonth: number; manualRestores: number; }
export interface ManagerFinanceFinesPaymentsSuspendedStudent { id: number; studentId: number; studentName: string; smartId: string; seat: string; shift: string; daysOverdue: number; suspendedSince: string; }

/** URL filter values supported by the renewals feature. */
export type ManagerFinanceFinesPaymentsRenewalFilter = 'expired' | 'expiring_7' | 'expiring_15';
