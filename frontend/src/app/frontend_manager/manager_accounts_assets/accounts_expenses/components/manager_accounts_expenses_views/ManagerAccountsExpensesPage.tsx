'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { ManagerAccountsExpensesAddExpenseModal } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_dialogs/ManagerAccountsExpensesAddExpenseModal';
import { ManagerAccountsExpensesDetailsModal } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_dialogs/ManagerAccountsExpensesDetailsModal';
import { ManagerAccountsExpensesCategoryReview } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesCategoryReview';
import ManagerAccountsExpensesExpenseCategoryFilter from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesExpenseCategoryFilter';
import ManagerAccountsExpensesExpenseSummaryCards from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesExpenseSummaryCards';
import { ManagerAccountsExpensesTimeHorizonBar } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesTimeHorizonBar';
import { ManagerAccountsExpensesToolbar } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesToolbar';
import { createManagerExpensesExpenseColumnDefinitions } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesExpenseColumnDefinitions';
import type { NativeColumn } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesNativeTable';
import ManagerAccountsExpensesExpenseLedger from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_widgets/ManagerAccountsExpensesExpenseLedger';
import { MANAGER_ACCOUNTING_EXPENSE_CATEGORIES as CATEGORIES } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';
import { MANAGER_ACCOUNTING_SAMPLE_EXPENSES as MOCK } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesDemoRepository';
import { useManagerExpensesCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesFormattingHook';
import type { Expense } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import type { ManagerAccountsExpensesMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesMainTypes';
import {
  buildInitialDemoExpenses,
  exportExpensesToCsv,
  formatExpensesInrRupees,
  getExpensesTimeHorizonLabel,
  isExpenseInTimeHorizon,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/utils/ManagerAccountsExpensesHelpers';
import { Plus, Printer, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

export type ManagerExpensesTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

const TIME_HORIZON_OPTIONS: Array<{ id: ManagerExpensesTimeHorizon; label: string }> = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'custom', label: 'Custom Range' },
];

export default function ManagerAccountsExpensesPage({ view, id }: ManagerAccountsExpensesMainProps) {
  const tManagerUi = useTranslations('manager.manager_expenses.ui');
  const formatManagerExpensesCurrency = useManagerExpensesCurrencyFormatter();

  const initialExpenses: Expense[] = useMemo(() => buildInitialDemoExpenses(MOCK as Expense[]), []);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [catFilter, setCatFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryReviewOpen, setIsCategoryReviewOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<ManagerExpensesTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const handleSyncExpenses = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Expense ledger synced with general ledger', { id: 'manager-expenses-sync' });
    }, 600);
  };

  const visible = useMemo(
    () =>
      expenses.filter(
        (e) =>
          (catFilter === 'all' || e.category === catFilter) &&
          isExpenseInTimeHorizon(e.date, timeHorizon, customStartDate, customEndDate)
      ),
    [expenses, catFilter, timeHorizon, customStartDate, customEndDate]
  );

  const searchedExpenses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visible.filter((e) => {
      const matchMode = modeFilter === 'all' || e.mode.toLowerCase() === modeFilter.toLowerCase();
      const matchQ =
        !q ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.paidBy.toLowerCase().includes(q) ||
        e.mode.toLowerCase().includes(q) ||
        (e.source && e.source.toLowerCase().includes(q)) ||
        (q === 'petty' && (e.source === 'petty_cash' || (!e.source && e.mode === 'cash'))) ||
        (q === 'bank' && (e.source === 'bank_direct' || (!e.source && e.mode !== 'cash')));
      return matchMode && matchQ;
    });
  }, [visible, modeFilter, searchQuery]);

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || catFilter !== 'all' || modeFilter !== 'all' || timeHorizon !== 'all');
  const timeHorizonLabel = useMemo(
    () => getExpensesTimeHorizonLabel(timeHorizon, customStartDate, customEndDate),
    [timeHorizon, customStartDate, customEndDate]
  );

  const handleExportCsv = () => {
    exportExpensesToCsv(searchedExpenses, timeHorizonLabel);
    toast.success('Expenses exported to CSV successfully', { id: 'manager-expenses-export-csv' });
  };

  const handleAddExpense = (newExpense: Expense, amt: number) => {
    setExpenses((prev) => [newExpense, ...prev]);
    toast.success(`Expense of ${formatExpensesInrRupees(amt)} for "${newExpense.description}" logged successfully!`, {
      id: 'manager-expenses-add-ok',
    });
  };

  const handleDeleteExpense = useCallback(
    (idToDelete: number) => {
      const target = expenses.find((e) => e.id === idToDelete);
      setExpenses((prev) => prev.filter((e) => e.id !== idToDelete));
      setSelectedExpense((prev) => (prev && prev.id === idToDelete ? null : prev));
      toast.success(`Expense voucher for "${target?.description || idToDelete}" deleted successfully.`, {
        id: `manager-expenses-del-${idToDelete}`,
      });
    },
    [expenses]
  );

  const colDefs: NativeColumn<Expense>[] = useMemo(
    () =>
      createManagerExpensesExpenseColumnDefinitions(
        {
          date: tManagerUi('date'),
          category: tManagerUi('category'),
          description: tManagerUi('description'),
          amount: tManagerUi('amount_inr'),
          mode: tManagerUi('mode'),
          paidBy: tManagerUi('paid_by'),
          actions: tManagerUi('actions'),
          deleteUnavailable: tManagerUi('delete_unavailable_verified_backend_mutation_contract_no_e31d2b'),
        },
        formatManagerExpensesCurrency,
        (expense) => setSelectedExpense(expense),
        handleDeleteExpense
      ),
    [tManagerUi, formatManagerExpensesCurrency, handleDeleteExpense]
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setCatFilter('all');
    setModeFilter('all');
    setTimeHorizon('all');
    setCustomStartDate('');
    setCustomEndDate('');
    toast.info('Filters have been reset to default.', { id: 'manager-expenses-reset-filters' });
  };

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">{tManagerUi('expense_ledger')}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary font-bold border border-border">
              {searchedExpenses.length} Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Track, audit, and disburse library operational expenses, petty cash, and fiscal ledger vouchers.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
            title="Print Expense Ledger"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleSyncExpenses}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
            title="Sync Expense Ledger"
          >
            {isSyncing ? <ButtonLoader icon="receipt" /> : <RefreshCw size={14} />}
            <span>{isSyncing ? 'Syncing...' : 'Sync Balances'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddExpenseOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-xs motion-safe:transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <ManagerAccountsExpensesTimeHorizonBar
        timeHorizon={timeHorizon}
        setTimeHorizon={setTimeHorizon}
        timeHorizonOptions={TIME_HORIZON_OPTIONS}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
      />

      <ManagerAccountsExpensesExpenseSummaryCards
        expenses={expenses}
        visibleExpenses={visible}
        formatCurrency={formatManagerExpensesCurrency}
        labels={{
          totalExpenses: tManagerUi('total_expenses'),
          thisMonth: TIME_HORIZON_OPTIONS.find((h) => h.id === timeHorizon)?.label ?? tManagerUi('this_month'),
          entries: tManagerUi('entries'),
          categories: tManagerUi('categories'),
        }}
        timeHorizonLabel={timeHorizonLabel}
      />

      <ManagerAccountsExpensesExpenseCategoryFilter
        categories={CATEGORIES}
        value={catFilter}
        onChange={setCatFilter}
        onViewCategories={() => setIsCategoryReviewOpen(true)}
        labels={{
          filterByCategory: tManagerUi('filter_by_category'),
          allCategories: tManagerUi('all_categories'),
          viewCategories: tManagerUi('view_categories'),
        }}
      />

      <ManagerAccountsExpensesCategoryReview isOpen={isCategoryReviewOpen} categories={CATEGORIES} onClose={() => setIsCategoryReviewOpen(false)} />

      <ManagerAccountsExpensesToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        modeFilter={modeFilter}
        setModeFilter={setModeFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        searchedCount={searchedExpenses.length}
        totalCount={expenses.length}
        timeHorizonLabel={timeHorizonLabel}
        onExportCsv={handleExportCsv}
      />

      <ManagerAccountsExpensesExpenseLedger
        emptyMessage={hasActiveFilters ? `No expenses recorded for ${timeHorizonLabel} matching the selected criteria.` : tManagerUi('no_matching_expenses_found')}
        rows={searchedExpenses}
        columnDefs={colDefs}
      />

      <ManagerAccountsExpensesAddExpenseModal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} onAddExpense={handleAddExpense} />

      <ManagerAccountsExpensesDetailsModal
        isOpen={Boolean(selectedExpense)}
        expense={selectedExpense}
        formatCurrency={formatManagerExpensesCurrency}
        onClose={() => setSelectedExpense(null)}
        onDeleteExpense={handleDeleteExpense}
      />
    </div>
  );
}
