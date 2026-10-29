export type ManagerFinanceCollectFeePaymentMode = 'cash' | 'upi' | 'card' | 'bank' | 'unknown';
export type ManagerFinanceCollectFeePaymentStatus = 'valid' | 'deleted' | 'unknown';
/** Monetary fields are integer minor units (paise/cents) per the frontend contract. */
export interface ManagerFinanceCollectFeePayment { id: string; receiptNumber?: string; date: string; studentName: string; smartId: string; amount: number; mode: ManagerFinanceCollectFeePaymentMode; txnId?: string; lateFee?: number; receivedBy: string; remark?: string; status: ManagerFinanceCollectFeePaymentStatus; deletionReason?: string; currency?: string; }

export type ManagerFinanceCollectFeeMode = 'cash' | 'upi' | 'card' | 'bank';
/** `dueAmount` is integer minor units. */
export interface ManagerFinanceCollectFeeStudent {
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
export interface ManagerFinanceCollectFeeReceiptPreviewProps {
  selectedStudent: ManagerFinanceCollectFeeStudent | null;
  mode: ManagerFinanceCollectFeeMode;
  modeLabels: Record<ManagerFinanceCollectFeeMode, string>;
  amount: string;
  total: number;
  isSubmitting: boolean;
  isCollectAvailable: boolean;
  receiptNumber: string;
  onCollect: () => void;
  onCancel: () => void;
}




