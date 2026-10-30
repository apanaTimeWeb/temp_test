import type { AdminFinanceSecurityDepositsScenario } from '@/app/frontend_admin/admin_finance/finance_security_deposits/tests/harness/bootstrap';
import type { ReactNode, RefObject } from 'react';

export type AdminFinanceDeposit = {
  id: number;
  studentName: string;
  smartId: string;
  depositAmount: number;
  collectedBy: string;
  collectedDate: string;
  deductionAmount: number;
  deductionReason?: string;
  refundAmount?: number;
  status: AdminFinanceDepositStatus;
  refundedDate?: string;
};

export type AdminFinanceDepositStatus = 'held' | 'refunded' | 'forfeited';

export interface AdminFinanceSecurityDepositsDeductionDialogProps {
  target: { id: number; name: string } | null;
  dialogRef: React.Ref<HTMLDivElement>;
  amount: string;
  reason: string;
  onAmountChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export interface AdminFinanceSecurityDepositsRefundTarget {
  id: number;
  name: string;
  amount: number;
  deductionAmount: number;
  deductionReason?: string;
}

export interface AdminFinanceSecurityDepositsRefundDialogProps {
  target: AdminFinanceSecurityDepositsRefundTarget | null;
  dialogRef: React.Ref<HTMLDivElement>;
  refundAmount: string;
  deductionAmount: string;
  deductionReason: string;
  onRefundAmountChange: (value: string) => void;
  onDeductionAmountChange: (value: string) => void;
  onDeductionReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export interface AdminFinanceSecurityDepositsTableProps {
  deposits: readonly AdminFinanceDeposit[];
  isLoading: boolean;
  onProcessRefund: (deposit: AdminFinanceDeposit) => void;
  onAddDeduction: (deposit: AdminFinanceDeposit) => void;
  canMutate: boolean;
}

export interface AdminFinanceSecurityDepositsToolbarProps {
  isLiveMode: boolean;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export interface AdminFinanceSecurityDepositsHarnessProps {
  children: ReactNode;
  scenario?: AdminFinanceSecurityDepositsScenario;
}
