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
import { Plus,Printer,RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback,useMemo,useState } from 'react';
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

  const initialExpenses: Expense[] = useMemo(() => {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return (MOCK as Expense[]).map((exp, idx) => {
      const d = new Date(today);
      if (idx === 0) {
        // Today
      } else if (idx === 1) {
        d.setDate(d.getDate() - 1);
      } else if (idx === 2) {
        d.setDate(d.getDate() - 3);
      } else if (idx === 3) {
        d.setDate(d.getDate() - 7);
      } else if (idx === 4) {
        d.setDate(d.getDate() - 14);
      } else {
        d.setDate(d.getDate() - 25);
      }
      return { ...exp, date: fmt(d) };
    });
  }, []);

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
      toast.success('Expense ledger synced with general ledger');
    }, 600);
  };

  const isDateInTimeHorizon = useCallback(
    (dateStr: string) => {
      if (timeHorizon === 'all') return true;
      const parsed = Date.parse(dateStr);
      if (Number.isNaN(parsed)) return true;
      const d = new Date(parsed);
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      if (timeHorizon === 'today') return d.getTime() >= startOfToday && d.getTime() < startOfToday + 86400000;
      if (timeHorizon === 'this_week') {
        const startOfWeek = startOfToday - ((now.getDay() || 7) - 1) * 86400000;
        return d.getTime() >= startOfWeek && d.getTime() <= startOfWeek + 7 * 86400000;
      }
      if (timeHorizon === 'this_month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      if (timeHorizon === 'custom') {
        if (customStartDate && d.getTime() < new Date(`${customStartDate}T00:00:00`).getTime()) return false;
        if (customEndDate && d.getTime() > new Date(`${customEndDate}T23:59:59`).getTime()) return false;
        return true;
      }
      return true;
    },
    [timeHorizon, customStartDate, customEndDate]
  );

  const visible = useMemo(() => {
    return expenses.filter((e) => {
      const matchCat = catFilter === 'all' || e.category === catFilter;
      const matchHorizon = isDateInTimeHorizon(e.date);
      return matchCat && matchHorizon;
    });
  }, [expenses, catFilter, isDateInTimeHorizon]);

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

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' || catFilter !== 'all' || modeFilter !== 'all' || timeHorizon !== 'all'
  );

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'all': return 'All Time';
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom':
        return customStartDate && customEndDate ? `${customStartDate} to ${customEndDate}` : 'Custom Range';
      default: return 'This Month';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const escapeCsv = (v: unknown) => {
    let s = String(v ?? '');
    return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const h = ['Date', 'Description', 'Category', 'Amount (INR)', 'Payment Mode', 'Paid By'].map(escapeCsv).join(',');
    const r = searchedExpenses
      .map((e) => [e.date, e.description, e.category, (e.amount / 100).toFixed(2), e.mode, e.paidBy].map(escapeCsv).join(','))
      .join('\r\n');
    const blob = new Blob([`\uFEFF${h}\r\n${r}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `expenses_ledger_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`,
      hidden: true,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Expenses exported to CSV successfully');
  };

  const handleAddExpense = (newExpense: Expense, amt: number) => {
    setExpenses([newExpense, ...expenses]);
    toast.success(`Expense of ₹${amt.toLocaleString('en-IN')} for "${newExpense.description}" logged successfully!`);
  };

  const handleDeleteExpense = (idToDelete: number) => {
    const target = expenses.find((e) => e.id === idToDelete);
    setExpenses((prev) => prev.filter((e) => e.id !== idToDelete));
    if (selectedExpense && selectedExpense.id === idToDelete) {
      setSelectedExpense(null);
    }
    toast.success(`Expense voucher for "${target?.description || idToDelete}" deleted successfully.`);
  };

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
        (idToDelete) => handleDeleteExpense(idToDelete)
      ),
    [tManagerUi, formatManagerExpensesCurrency]
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setCatFilter('all');
    setModeFilter('all');
    setTimeHorizon('all');
    setCustomStartDate('');
    setCustomEndDate('');
    toast.info('Filters have been reset to default.');
  };

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      {/* ── Clean Executive Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
              {tManagerUi('expense_ledger')}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary font-bold border border-border">
              {searchedExpenses.length} Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Track, audit, and disburse library operational expenses, petty cash, and fiscal ledger vouchers.
          </p>
        </div>

        {/* Action Buttons: Print Report, Sync Balances, Add Expense */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* ── Main Global Time Horizon Filter Bar with Glowing Halos ── */}
      <ManagerAccountsExpensesTimeHorizonBar
        timeHorizon={timeHorizon}
        setTimeHorizon={setTimeHorizon}
        timeHorizonOptions={TIME_HORIZON_OPTIONS}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
      />

      {/* ── Executive Expense Summary KPI Cards (Clean Display Cards, NOT Interlinked Toggle Buttons) ── */}
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

      {/* ── Category Filter Pills with Glowing Halos ── */}
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

      {/* ── Category Review Region ── */}
      <ManagerAccountsExpensesCategoryReview
        isOpen={isCategoryReviewOpen}
        categories={CATEGORIES}
        onClose={() => setIsCategoryReviewOpen(false)}
      />

      {/* ── Toolbar: Non-overlapping Search, Payment Mode Filter & CSV Export ── */}
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

      {/* ── Native Table Ledger ── */}
      <ManagerAccountsExpensesExpenseLedger
        emptyMessage={
          hasActiveFilters
            ? `No expenses recorded for ${timeHorizonLabel} matching the selected criteria.`
            : tManagerUi('no_matching_expenses_found')
        }
        rows={searchedExpenses}
        columnDefs={colDefs}
      />

      {/* ── Add Operational Expense Modal ── */}
      <ManagerAccountsExpensesAddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={handleAddExpense}
      />

      {/* ── Expense Voucher Audit Details Modal ── */}
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
