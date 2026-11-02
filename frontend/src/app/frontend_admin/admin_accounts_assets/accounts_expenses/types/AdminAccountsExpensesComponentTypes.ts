import type { ADMIN_ACCOUNTING_EXPENSE_CATEGORIES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import type { AdminAccountsExpensesScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminAccountsExpensesAddPageProps {
  onSaveExpense: (expense: AdminAccountingExpense) => void;
  onCancel: () => void;
}

export interface AdminAccountingDeleteConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export type AdminAccountsExpensesCategoryFilter = 'all' | (typeof ADMIN_ACCOUNTING_EXPENSE_CATEGORIES)[number];
export type AdminAccountsExpensesStatusFilter = 'all' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface AdminAccountsExpensesFilterSectionProps {
  value: AdminAccountsExpensesCategoryFilter;
  statusFilter?: AdminAccountsExpensesStatusFilter;
  onChange: (value: AdminAccountsExpensesCategoryFilter) => void;
  onStatusChange?: (status: AdminAccountsExpensesStatusFilter) => void;
  pendingCount?: number;
}

export interface AdminAccountsExpensesHeaderSectionProps {
  onAddExpense: () => void;
  canMutate: boolean;
}

export interface AdminAccountsExpensesKpiSectionProps {
  expenses: readonly AdminAccountingExpense[];
  visibleExpenses: readonly AdminAccountingExpense[];
}

export type AdminAccountsExpensesRouteView = 'list' | 'add';

export interface AdminAccountsExpensesTableSectionProps {
  expenses: readonly AdminAccountingExpense[];
  onRequestDelete: (expense: AdminAccountingExpense) => void;
  onRequestApprove?: (expense: AdminAccountingExpense) => void;
  onRequestReject?: (expense: AdminAccountingExpense) => void;
  canMutate: boolean;
}

export interface AdminAccountsExpensesApprovalModalProps {
  expense: AdminAccountingExpense | null;
  open: boolean;
  onConfirm: (expenseId: number) => void;
  onCancel: () => void;
}

export interface AdminAccountsExpensesRejectionModalProps {
  expense: AdminAccountingExpense | null;
  open: boolean;
  onConfirm: (expenseId: number, reason: string) => void;
  onCancel: () => void;
}

export type RouteSearchParams = Record<string, string | string[] | undefined>;

export interface AdminAccountsExpensesHarnessProps {
  children: ReactNode;
  scenario?: AdminAccountsExpensesScenario;
}
