'use client';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
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

type AdminExpenseTimeRange = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

/** Owns transient demo ledger and approval state. Live mutations remain blocked without a verified API contract. */
export function AdminAccountsExpensesPage({ view = 'list' }: { view?: AdminAccountsExpensesRouteView }) {
  const router = useRouter();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');
  const isDemoMode = isFrontendDemoModeEnabled();
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const [expenses, setExpenses] = useState<AdminAccountingExpense[]>(() =>
    isDemoMode ? [...ADMIN_ACCOUNTING_EXPENSE_FIXTURES] : []
  );
  const [catFilter, setCatFilter] = useState<AdminAccountsExpensesCategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<AdminAccountsExpensesStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<AdminAccountingExpense | null>(null);
  const [pendingApprove, setPendingApprove] = useState<AdminAccountingExpense | null>(null);
  const [pendingReject, setPendingReject] = useState<AdminAccountingExpense | null>(null);
  const [timeRange, setTimeRange] = useState<AdminExpenseTimeRange>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

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

  const visibleExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      if (!isAllBranches && selectedBranch) {
        const matchesBranch = expense.branchName && (
          expense.branchName.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
          selectedBranch.name.toLowerCase().includes(expense.branchName.toLowerCase())
        );
        if (!matchesBranch) {
          return false;
        }
      }
      if (catFilter !== 'all' && expense.category !== catFilter) return false;
      if (statusFilter !== 'all' && (expense.status ?? 'APPROVED') !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchDesc = expense.description?.toLowerCase().includes(q);
        const matchPayee = expense.paidBy?.toLowerCase().includes(q);
        const matchCategory = expense.category?.toLowerCase().includes(q);
        const matchBranch = expense.branchName?.toLowerCase().includes(q);
        if (!matchDesc && !matchPayee && !matchCategory && !matchBranch) return false;
      }

      // Time-range filter
      if (timeRange !== 'all' && expense.date) {
        const d = new Date(expense.date);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (timeRange === 'today') { const end = new Date(today); end.setHours(23,59,59,999); if (!(d >= today && d <= end)) return false; }
        else if (timeRange === 'this_week') { const ws = new Date(today); ws.setDate(today.getDate() - today.getDay()); if (d < ws) return false; }
        else if (timeRange === 'this_month') { const ms = new Date(today.getFullYear(), today.getMonth(), 1); if (d < ms) return false; }
        else if (timeRange === 'custom') {
          if (customStartDate && d < new Date(customStartDate)) return false;
          if (customEndDate) { const ce = new Date(customEndDate); ce.setHours(23,59,59,999); if (d > ce) return false; }
        }
      }

      return true;
    });
  }, [expenses, isAllBranches, selectedBranch, catFilter, statusFilter, searchQuery, timeRange, customStartDate, customEndDate]);

  const timeRangeLabel = useMemo(() => {
    return timeRange === 'all' ? 'All Time' : timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'this_month' ? 'This Month' : 'Custom Range';
  }, [timeRange]);

  return (
    <div className="space-y-6 pb-10">
      {!isDemoMode && (
        <p role="status" className="rounded-xl border border-warning-border bg-warning-bg p-3 text-xs font-medium text-warning-text">
          {t('LIVE_UNAVAILABLE')}
        </p>
      )}

      {/* Executive Header with Global Time Horizon */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <AdminAccountsExpensesHeaderSection
          onAddExpense={() => router.push(ADMIN_ACCOUNTS_EXPENSES_ROUTES.create)}
          canMutate={isDemoMode}
        />
        {/* Time Horizon Pill Bar */}
        <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface p-2 shadow-sm backdrop-blur-md self-start">
          <div className="flex items-center rounded-lg bg-surface-muted p-1 border border-border">
            {(['all', 'today', 'this_week', 'this_month', 'custom'] as const).map((r) => (
              <button key={r} type="button" onClick={() => setTimeRange(r)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${timeRange === r ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
              >
                {r === 'all' ? 'All Time' : r === 'today' ? 'Today' : r === 'this_week' ? 'This Week' : r === 'this_month' ? 'This Month' : <><Calendar className="h-3 w-3" />Custom</>}
              </button>
            ))}
          </div>
          {timeRange === 'custom' && (
            <div className="flex items-center gap-1.5 text-xs">
              <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} aria-label="Start date" className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <span className="text-text-muted">to</span>
              <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} aria-label="End date" className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          )}
        </div>
      </div>

      <AdminAccountsExpensesKpiSection expenses={expenses} visibleExpenses={visibleExpenses} timeRangeLabel={timeRangeLabel} />
      <AdminAccountsExpensesFilterSection
        value={catFilter}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
