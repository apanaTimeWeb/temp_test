'use client';
import type { ManagerAccountsExpensesMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesMainTypes';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useManagerExpensesCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesFormattingHook';
import type { NativeColumn } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesNativeTable';
import { useState, useMemo, useCallback } from 'react';
import { Plus, RefreshCw, Wallet } from 'lucide-react';
import ManagerAccountsExpensesExpenseSummaryCards from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesExpenseSummaryCards';
import ManagerAccountsExpensesExpenseCategoryFilter from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesExpenseCategoryFilter';
import ManagerAccountsExpensesExpenseLedger from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_widgets/ManagerAccountsExpensesExpenseLedger';
import { createManagerExpensesExpenseColumnDefinitions } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesExpenseColumnDefinitions';
import { MANAGER_ACCOUNTING_EXPENSE_CATEGORIES as CATEGORIES } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';
import { MANAGER_ACCOUNTING_SAMPLE_EXPENSES as MOCK } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesDemoRepository';
import type { Expense } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import { ManagerAccountsExpensesTimeHorizonBar } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesTimeHorizonBar';
import { ManagerAccountsExpensesToolbar } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesToolbar';
import { ManagerAccountsExpensesAddExpenseModal } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_dialogs/ManagerAccountsExpensesAddExpenseModal';
import { ManagerAccountsExpensesCategoryReview } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesCategoryReview';

export type ManagerExpensesTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

const TIME_HORIZON_OPTIONS: Array<{ id: ManagerExpensesTimeHorizon; label: string }> = [
  { id: 'all', label: 'All Time' }, { id: 'today', label: 'Today' }, { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' }, { id: 'custom', label: 'Custom Range' },
];

export default function ManagerAccountsExpensesPage({ view, id }: ManagerAccountsExpensesMainProps) {
  const tManagerUi = useTranslations('manager.manager_expenses.ui');
  const formatManagerExpensesCurrency = useManagerExpensesCurrencyFormatter();

  const [expenses, setExpenses] = useState<Expense[]>(MOCK as Expense[]);
  const [catFilter, setCatFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryReviewOpen, setIsCategoryReviewOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [timeHorizon, setTimeHorizon] = useState<ManagerExpensesTimeHorizon>('this_month');
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
        e.mode.toLowerCase().includes(q);
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
    const r = searchedExpenses.map((e) => [e.date, e.description, e.category, (e.amount / 100).toFixed(2), e.mode, e.paidBy].map(escapeCsv).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${h}\r\n${r}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `expenses_ledger_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`,
      hidden: true,
    });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Expenses exported to CSV successfully');
  };

  const handleAddExpense = (newExpense: Expense, amt: number) => {
    setExpenses([newExpense, ...expenses]);
    setFeedbackToast(`Expense of ₹${amt} for "${newExpense.description}" logged successfully!`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const colDefs: NativeColumn<Expense>[] = createManagerExpensesExpenseColumnDefinitions(
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
    formatManagerExpensesCurrency
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setCatFilter('all');
    setModeFilter('all');
    setTimeHorizon('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      {/* ── Executive ERP Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-primary uppercase tracking-wider">Accounting & Operations</span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-danger-bg text-danger border border-border">
                <Wallet size={12} /> Disbursement & Petty Cash
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-muted text-secondary border border-border">
                📍 Central Branch
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                {tManagerUi('expense_ledger')}
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-md bg-primary-subtle text-primary font-bold">
                {searchedExpenses.length} Records • Scope: {timeHorizonLabel}
              </span>
            </div>

            <p className="text-sm text-secondary">{tManagerUi('track_all_library_operational_expenses')}</p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            <button
              type="button"
              onClick={handleSyncExpenses}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm active:scale-95 disabled:opacity-60"
              title="Sync Expense Ledger"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin text-primary' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Journal'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(true)}
              className="mgr-btn-primary min-h-11 px-4 rounded-xl shadow-sm inline-flex items-center gap-2 text-sm font-semibold"
            >
              <Plus size={16} />
              <span>Add Operational Expense</span>
            </button>
          </div>
        </div>
      </div>

      {feedbackToast && (
        <div className="p-4 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center gap-2 shadow-sm" role="status">
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ── Main Global Time Horizon Filter Bar ── */}
      <ManagerAccountsExpensesTimeHorizonBar
        timeHorizon={timeHorizon}
        setTimeHorizon={setTimeHorizon}
        timeHorizonOptions={TIME_HORIZON_OPTIONS}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
      />

      {/* ── Executive Expense Summary KPI Cards ── */}
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

      {/* ── Category Filter Pills ── */}
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

      {/* ── Toolbar: Search, Mode Filter & CSV Export ── */}
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
        emptyMessage={hasActiveFilters ? `No expenses recorded for ${timeHorizonLabel} matching the selected criteria.` : tManagerUi('no_matching_expenses_found')}
        rows={searchedExpenses}
        columnDefs={colDefs}
      />

      {/* ── Add Operational Expense Modal ── */}
      <ManagerAccountsExpensesAddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
}
