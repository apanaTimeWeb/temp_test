'use client';

import { AdminAccountingDeleteConfirmationDialog } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountingDeleteConfirmationDialog';
import AdminAccountsExpensesAddPage from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesAddPage';
import AdminAccountsExpensesApprovalModal from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesApprovalModal';
import AdminAccountsExpensesFilterSection, {
  type AdminAccountsExpensesCategoryFilter,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesFilterSection';
import AdminAccountsExpensesHeaderSection from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesHeaderSection';
import AdminAccountsExpensesKpiSection from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesKpiSection';
import AdminAccountsExpensesRejectionModal from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesRejectionModal';
import AdminAccountsExpensesTableSection from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesTableSection';
import AdminAccountsExpenseVoucherModal from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpenseVoucherModal';
import { ADMIN_ACCOUNTING_EXPENSE_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.demo_data';
import { ADMIN_ACCOUNTS_EXPENSES_ROUTES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import type {
  AdminAccountsExpensesRouteView,
  AdminAccountsExpensesStatusFilter,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';
import {
  type AdminExpenseTimeRange,
  exportAdminExpensesCsv,
  exportAdminExpensesExcel,
  filterAdminExpenses,
  getExpenseTimeRangeLabel,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/adminAccountsExpensesExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export { AdminAccountingDeleteConfirmationDialog };

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
  const [viewingVoucher, setViewingVoucher] = useState<AdminAccountingExpense | null>(null);

  const visibleExpenses = useMemo(
    () => filterAdminExpenses(expenses, { isAllBranches, selectedBranch, catFilter, statusFilter, searchQuery, timeRange, customStartDate, customEndDate }),
    [expenses, isAllBranches, selectedBranch, catFilter, statusFilter, searchQuery, timeRange, customStartDate, customEndDate]
  );

  const timeRangeLabel = useMemo(() => getExpenseTimeRangeLabel(timeRange), [timeRange]);

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
      current.map((e) => (e.id === expenseId ? { ...e, status: 'APPROVED', approvedBy: 'Admin (Demo)', approvedAt: new Date().toISOString() } : e))
    );
    setPendingApprove(null);
    toast.success('Expense request approved and petty cash release authorized.', { id: `admin-expense-approved-${expenseId}` });
  };

  const handleRejectExpense = (expenseId: number, reason: string) => {
    setExpenses((current) =>
      current.map((e) => (e.id === expenseId ? { ...e, status: 'REJECTED', rejectionReason: reason, approvedBy: 'Admin (Demo)', approvedAt: new Date().toISOString() } : e))
    );
    setPendingReject(null);
    toast.info('Expense request rejected. Manager notified.', { id: `admin-expense-rejected-${expenseId}` });
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

  return (
    <div className="space-y-6 pb-10">
      {!isDemoMode && <p role="status" className="sr-only">{t('LIVE_UNAVAILABLE')}</p>}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <AdminAccountsExpensesHeaderSection
          onAddExpense={() => router.push(ADMIN_ACCOUNTS_EXPENSES_ROUTES.create)}
          canMutate={isDemoMode}
          onExportCsv={() => exportAdminExpensesCsv(visibleExpenses)}
          onExportExcel={() => exportAdminExpensesExcel(visibleExpenses)}
        />
        <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface-highlight p-2 shadow-card self-start">
          <div className="flex items-center rounded-lg bg-card p-1 border border-border">
            {(['all', 'today', 'this_week', 'this_month', 'last_month', 'custom'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold motion-safe:transition-colors ${
                  timeRange === r ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {r === 'all' ? 'All Time' : r === 'today' ? 'Today' : r === 'this_week' ? 'This Week' : r === 'this_month' ? 'This Month' : r === 'last_month' ? 'Last Month' : <><Calendar className="h-3 w-3" aria-hidden="true" />Custom</>}
              </button>
            ))}
          </div>
          {timeRange === 'custom' && (
            <div className="flex items-center gap-1.5 text-xs">
              <input maxLength={100} type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} aria-label="Start date" className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <span className="text-text-secondary">to</span>
              <input maxLength={100} type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} aria-label="End date" className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
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
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        onExportCsv={() => exportAdminExpensesCsv(visibleExpenses)}
        onExportExcel={() => exportAdminExpensesExcel(visibleExpenses)}
      />
      <AdminAccountsExpensesTableSection
        expenses={visibleExpenses}
        onRequestDelete={setPendingDelete}
        onRequestApprove={setPendingApprove}
        onRequestReject={setPendingReject}
        onViewVoucher={setViewingVoucher}
        canMutate={isDemoMode}
      />
      <AdminAccountingDeleteConfirmationDialog
        open={pendingDelete !== null}
        title={t('DELETE_TITLE')}
        description={pendingDelete ? t('DELETE_DESCRIPTION', { description: pendingDelete.description }) : ''}
        confirmLabel={t('DELETE')}
        cancelLabel={t('CANCEL')}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) handleDelete(pendingDelete.id); setPendingDelete(null); }}
      />
      <AdminAccountsExpensesApprovalModal expense={pendingApprove} open={pendingApprove !== null} onConfirm={handleApproveExpense} onCancel={() => setPendingApprove(null)} />
      <AdminAccountsExpensesRejectionModal expense={pendingReject} open={pendingReject !== null} onConfirm={handleRejectExpense} onCancel={() => setPendingReject(null)} />
      <AdminAccountsExpenseVoucherModal
        expense={viewingVoucher}
        isOpen={viewingVoucher !== null}
        onClose={() => setViewingVoucher(null)}
        onApprove={(exp) => { handleApproveExpense(exp.id); setViewingVoucher(null); }}
        onReject={(exp) => { setViewingVoucher(null); setPendingReject(exp); }}
      />
    </div>
  );
}

export default AdminAccountsExpensesPage;
export type { AdminAccountsExpensesRouteView };
