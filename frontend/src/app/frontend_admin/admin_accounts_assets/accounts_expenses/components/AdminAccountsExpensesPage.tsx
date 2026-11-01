'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ADMIN_ACCOUNTING_EXPENSE_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/mocks/scenarios/admin_accounts_expenses.scenarios';
import { ADMIN_ACCOUNTS_EXPENSES_ROUTES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminAccountsExpensesAddPage from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesAddPage';
import AdminAccountsExpensesHeaderSection from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesHeaderSection';
import AdminAccountsExpensesKpiSection from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesKpiSection';
import AdminAccountsExpensesFilterSection, {
  type AdminAccountsExpensesCategoryFilter,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesFilterSection';
import AdminAccountsExpensesTableSection from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesTableSection';
import AdminAccountsExpensesApprovalModal from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesApprovalModal';
import AdminAccountsExpensesRejectionModal from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesRejectionModal';
import type {
  AdminAccountsExpensesRouteView,
  AdminAccountsExpensesStatusFilter,
  AdminAccountingDeleteConfirmationDialogProps,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';

// RESPONSIBILITY: Owns the expense ledger route state, approval workflow, and list/add view orchestration.

/** Owns transient demo ledger and approval state. Live mutations remain blocked without a verified API contract. */
export function AdminAccountsExpensesPage({ view = 'list' }: { view?: AdminAccountsExpensesRouteView }) {
  const router = useRouter();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [expenses, setExpenses] = useState<AdminAccountingExpense[]>(() =>
    isDemoMode ? [...ADMIN_ACCOUNTING_EXPENSE_FIXTURES] : []
  );
  const [catFilter, setCatFilter] = useState<AdminAccountsExpensesCategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<AdminAccountsExpensesStatusFilter>('all');
  const [pendingDelete, setPendingDelete] = useState<AdminAccountingExpense | null>(null);
  const [pendingApprove, setPendingApprove] = useState<AdminAccountingExpense | null>(null);
  const [pendingReject, setPendingReject] = useState<AdminAccountingExpense | null>(null);

  const handleAddExpense = (newExpense: AdminAccountingExpense) => {
    setExpenses((current) => [...current, newExpense]);
  };

  const handleDelete = (id: number) => {
    if (!isDemoMode) {
      toast.error(t('DELETE_BLOCKED'), { id: 'admin-accounts-expenses-delete-blocked' });
      return;
    }
    setExpenses((current) => current.filter((expense) => expense.id !== id));
    toast.info(t('DEMO_DELETED'), { id: 'admin-accounts-expenses-demo-deleted' });
  };

  const handleApproveExpense = (expenseId: number) => {
    setExpenses((current) =>
      current.map((e) =>
        e.id === expenseId
          ? {
              ...e,
              status: 'APPROVED',
              approvedBy: 'Admin (Demo)',
              approvedAt: new Date().toISOString(),
            }
          : e
      )
    );
    setPendingApprove(null);
    toast.success('Expense request approved and petty cash release authorized.', {
      id: `admin-expense-approved-${expenseId}`,
    });
  };

  const handleRejectExpense = (expenseId: number, reason: string) => {
    setExpenses((current) =>
      current.map((e) =>
        e.id === expenseId
          ? {
              ...e,
              status: 'REJECTED',
              rejectionReason: reason,
              approvedBy: 'Admin (Demo)',
              approvedAt: new Date().toISOString(),
            }
          : e
      )
    );
    setPendingReject(null);
    toast.info('Expense request rejected. Manager notified.', {
      id: `admin-expense-rejected-${expenseId}`,
    });
  };

  if (view === 'add') {
    return (
      <AdminAccountsExpensesAddPage
        onSaveExpense={handleAddExpense}
        onCancel={() => router.push(ADMIN_ACCOUNTS_EXPENSES_ROUTES.route)}
      />
    );
  }

  const pendingCount = expenses.filter((e) => e.status === 'PENDING_APPROVAL').length;

  const visibleExpenses = expenses.filter((expense) => {
    if (catFilter !== 'all' && expense.category !== catFilter) return false;
    if (statusFilter !== 'all' && (expense.status ?? 'APPROVED') !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {!isDemoMode && (
        <p role="status" className="rounded-lg border border-warning-bg bg-warning-bg p-3 text-warning-text">
          {t('LIVE_UNAVAILABLE')}
        </p>
      )}
      <AdminAccountsExpensesHeaderSection
        onAddExpense={() => router.push(ADMIN_ACCOUNTS_EXPENSES_ROUTES.create)}
        canMutate={isDemoMode}
      />
      <AdminAccountsExpensesKpiSection expenses={expenses} visibleExpenses={visibleExpenses} />
      <AdminAccountsExpensesFilterSection
        value={catFilter}
        statusFilter={statusFilter}
        onChange={setCatFilter}
        onStatusChange={setStatusFilter}
        pendingCount={pendingCount}
      />
      <AdminAccountsExpensesTableSection
        expenses={visibleExpenses}
        onRequestDelete={setPendingDelete}
        onRequestApprove={setPendingApprove}
        onRequestReject={setPendingReject}
        canMutate={isDemoMode}
      />
      <AdminAccountingDeleteConfirmationDialog
        open={pendingDelete !== null}
        title={t('DELETE_TITLE')}
        description={pendingDelete ? t('DELETE_DESCRIPTION', { description: pendingDelete.description }) : ''}
        confirmLabel={t('DELETE')}
        cancelLabel={t('CANCEL')}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) handleDelete(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
      <AdminAccountsExpensesApprovalModal
        expense={pendingApprove}
        open={pendingApprove !== null}
        onConfirm={handleApproveExpense}
        onCancel={() => setPendingApprove(null)}
      />
      <AdminAccountsExpensesRejectionModal
        expense={pendingReject}
        open={pendingReject !== null}
        onConfirm={handleRejectExpense}
        onCancel={() => setPendingReject(null)}
      />
    </div>
  );
}

export default AdminAccountsExpensesPage;
export type { AdminAccountsExpensesRouteView };

// RESPONSIBILITY: AdminAccountingDeleteConfirmationDialog component owned by admin_accounting; responsibility folder: admin_accounting_delete_confirmation_dialog.

export function AdminAccountingDeleteConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: AdminAccountingDeleteConfirmationDialogProps) {
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) onCancel();
    },
    [onCancel]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium bg-card text-text-secondary cursor-pointer"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium bg-danger-bg text-danger-text cursor-pointer"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
