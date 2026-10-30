import type { AdminFinanceAutoSuspendScenario } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/tests/harness/bootstrap';
import type { ReactNode, RefObject } from 'react';

export type AdminFinanceAutoSuspendConfig = { daysBeforeSuspend: number; currentlySuspended: number; autoRestoredThisMonth: number; manualRestores: number };

export type AdminFinanceSuspendedStudent = { id: number; studentId: number; studentName: string; smartId: string; seat: string; shift: string; daysOverdue: number; suspendedSince: string };

export interface AdminFinanceAutoSuspendKpiCardsProps {
  config: AdminFinanceAutoSuspendConfig | null;
  isLoading: boolean;
}

export interface AdminFinanceAutoSuspendPolicyCardProps {
  canEdit: boolean;
  config: AdminFinanceAutoSuspendConfig | null;
  isLoading: boolean;
  editing: boolean;
  days: string;
  updatePending: boolean;
  onDaysChange: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface AdminFinanceAutoSuspendRestoreDialogProps {
  target: { id: number; name: string } | null;
  dialogRef: React.Ref<HTMLDivElement>;
  reason: string;
  isPending: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export interface AdminFinanceAutoSuspendStudentsTableProps {
  students: readonly AdminFinanceSuspendedStudent[];
  isLoading: boolean;
  canRestore: boolean;
  onRestore: (student: AdminFinanceSuspendedStudent) => void;
}

export interface AdminFinanceAutoSuspendHarnessProps {
  children: ReactNode;
  scenario?: AdminFinanceAutoSuspendScenario;
}
