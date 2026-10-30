import type { AdminFinancePaymentPromisesScenario } from '@/app/frontend_admin/admin_finance/finance_payment_promises/tests/harness/bootstrap';
import type { ReactNode, RefObject } from 'react';

/** Domain and fixture shapes for Finance. Values live only in admin_finance_mocks. */

export type AdminFinancePromiseItem = {
  id: number;
  studentName: string;
  smartId: string;
  promisedAmount: number;
  expectedDate: string;
  daysUntilDue: number;
  timesChanged: number;
  status: AdminFinancePromiseItemStatus;
  fulfilledDate?: string;
};

export type AdminFinancePromiseItemStatus = 'pending' | 'fulfilled' | 'overdue';

export interface AdminFinancePaymentPromisesExtendDialogProps {
  target: { id: number; name: string } | null;
  dialogRef: RefObject<HTMLDivElement | null>;
  newDate: string;
  reason: string;
  onDateChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export interface AdminFinancePaymentPromisesTableProps {
  promises: readonly AdminFinancePromiseItem[];
  isLoading: boolean;
  onFulfill: (id: number, name: string) => void;
  onExtend: (target: { id: number; name: string }) => void;
  canMutate: boolean;
}

export interface AdminFinancePaymentPromisesToolbarProps {
  isLiveMode: boolean;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export interface AdminFinancePaymentPromisesHarnessProps {
  children: ReactNode;
  scenario?: AdminFinancePaymentPromisesScenario;
}
