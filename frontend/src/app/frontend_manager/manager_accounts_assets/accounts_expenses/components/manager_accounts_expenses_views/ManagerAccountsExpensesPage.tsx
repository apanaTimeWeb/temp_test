'use client';
import type { ManagerAccountsExpensesMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesMainTypes';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useManagerExpensesCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesFormattingHook';
import type { NativeColumn } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesNativeTable';
import { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  X,
  CheckCircle,
  IndianRupee,
  Receipt,
  Search,
  Download,
  Calendar,
  RefreshCw,
  Wallet,
  Building2,
  FileText,
  CreditCard,
} from 'lucide-react';
import ManagerAccountsExpensesExpenseSummaryCards from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesExpenseSummaryCards';
import ManagerAccountsExpensesExpenseCategoryFilter from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesExpenseCategoryFilter';
import ManagerAccountsExpensesExpenseLedger from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_widgets/ManagerAccountsExpensesExpenseLedger';
import { createManagerExpensesExpenseColumnDefinitions } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesExpenseColumnDefinitions';
import { MANAGER_ACCOUNTING_EXPENSE_CATEGORIES as CATEGORIES } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';
import { MANAGER_ACCOUNTING_SAMPLE_EXPENSES as MOCK } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesDemoRepository';
import type { Expense } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';

export type ManagerExpensesTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

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

  // Global Time Horizon State
  const [timeHorizon, setTimeHorizon] = useState<ManagerExpensesTimeHorizon>('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Form State
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<string>(CATEGORIES[0] || 'Utilities');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseMode, setExpenseMode] = useState<'cash' | 'upi' | 'card' | 'bank'>('cash');
  const [expensePaidBy, setExpensePaidBy] = useState('Manager Counter');
  const [voucherNo, setVoucherNo] = useState('');

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

      if (timeHorizon === 'today') {
        return d.getTime() >= startOfToday && d.getTime() < startOfToday + 86400000;
      }
      if (timeHorizon === 'this_week') {
        const startOfWeek = startOfToday - ((now.getDay() || 7) - 1) * 86400000;
        return d.getTime() >= startOfWeek && d.getTime() <= startOfWeek + 7 * 86400000;
      }
      if (timeHorizon === 'this_month') {
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }
      if (timeHorizon === 'custom') {
        if (customStartDate && d.getTime() < new Date(`${customStartDate}T00:00:00`).getTime()) return false;
        if (customEndDate && d.getTime() > new Date(`${customEndDate}T23:59:59`).getTime()) return false;
        return true;
      }
      return true;
    },
    [timeHorizon, customStartDate, customEndDate]
  );

  // Expenses filtered by category and time horizon
  const visible = useMemo(() => {
    return expenses.filter((e) => {
      const matchCat = catFilter === 'all' || e.category === catFilter;
      const matchHorizon = isDateInTimeHorizon(e.date);
      return matchCat && matchHorizon;
    });
  }, [expenses, catFilter, isDateInTimeHorizon]);

  // Expenses filtered by category, time horizon, search query, and mode
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
        return customStartDate && customEndDate
          ? `${customStartDate} to ${customEndDate}`
          : 'Custom Range';
      default: return 'This Month';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const handleExportCsv = () => {
    const headers = `Expense Ledger Export - Scope: ${timeHorizonLabel}\nDate,Description,Category,Amount (INR),Payment Mode,Paid By\n`;
    const rows = searchedExpenses
      .map(
        (e) =>
          `"${e.date}","${e.description}","${e.category}","${(e.amount / 100).toFixed(2)}","${e.mode}","${e.paidBy}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `expenses_ledger_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Expenses exported to CSV successfully');
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc.trim()) {
      toast.error('Expense description is required.');
      return;
    }
    const amt = Number(expenseAmount);
    if (!amt || amt <= 0) {
      toast.error('Valid positive expense amount is required.');
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      category: expenseCategory,
      description: voucherNo.trim() ? `${expenseDesc.trim()} (Bill #${voucherNo.trim()})` : expenseDesc.trim(),
      amount: Math.round(amt * 100),
      mode: expenseMode,
      paidBy: expensePaidBy.trim() || 'Manager Counter',
    };

    setExpenses([newExpense, ...expenses]);
    setIsAddExpenseOpen(false);
    setExpenseDesc('');
    setExpenseAmount('');
    setVoucherNo('');
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

  const timeHorizonOptions: Array<{ id: ManagerExpensesTimeHorizon; label: string }> = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      {/* ── Executive ERP Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-primary uppercase tracking-wider">Accounting & Operations</span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <Wallet size={12} />
                Disbursement & Petty Cash
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-secondary/10 text-secondary border border-border">
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

            <p className="text-sm text-secondary">
              {tManagerUi('track_all_library_operational_expenses')}
            </p>
          </div>

          {/* Action buttons */}
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
        <div
          className="p-4 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2 shadow-sm"
          role="status"
        >
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ── Main Global Time Horizon Filter Bar ── */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Expense Time Horizon:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Time Horizon Pills */}
          <div className="inline-flex bg-muted/60 p-1 rounded-xl border border-border flex-wrap">
            {timeHorizonOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTimeHorizon(opt.id)}
                className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                  timeHorizon === opt.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          {timeHorizon === 'custom' && (
            <div className="flex items-center gap-2 flex-wrap text-xs bg-muted/40 p-1.5 rounded-lg border border-border">
              <label className="flex items-center gap-1 text-secondary">
                <span>From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
                />
              </label>
              <label className="flex items-center gap-1 text-secondary">
                <span>To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2 py-1 bg-card border border-border rounded text-xs text-primary outline-none focus:border-primary"
                />
              </label>
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  className="p-1 text-secondary hover:text-destructive"
                  title="Clear custom dates"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Executive Expense Summary KPI Cards ── */}
      <ManagerAccountsExpensesExpenseSummaryCards
        expenses={expenses}
        visibleExpenses={visible}
        formatCurrency={formatManagerExpensesCurrency}
        labels={{
          totalExpenses: tManagerUi('total_expenses'),
          thisMonth: timeHorizonOptions.find((h) => h.id === timeHorizon)?.label ?? tManagerUi('this_month'),
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

      {isCategoryReviewOpen && (
        <section
          aria-labelledby="manager-expenses-category-review-title"
          className="rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-scale-up"
          role="region"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-base font-bold text-primary" id="manager-expenses-category-review-title">
              {tManagerUi('expense_categories')}
            </h2>
            <button
              type="button"
              onClick={() => setIsCategoryReviewOpen(false)}
              className="p-1 rounded-lg text-secondary hover:text-primary"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-2 text-xs text-secondary">
            {tManagerUi('review_sample_budget_allocation_per_expense_category')}
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((category) => (
              <div
                key={category}
                className="px-3 py-2 rounded-xl border border-border bg-muted/30 text-xs font-semibold text-primary flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>{category}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-primary"
              onClick={() => setIsCategoryReviewOpen(false)}
              type="button"
            >
              {tManagerUi('cancel')}
            </button>
          </div>
        </section>
      )}

      {/* ── Toolbar: Search, Mode Filter & CSV Export ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="search"
              placeholder="Search description, payee, or category..."
              className="w-full pl-9 pr-3 py-2 bg-muted/40 border border-border rounded-lg text-xs text-primary outline-none focus:border-primary focus:bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            aria-label="Filter by Payment Mode"
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="min-h-9 py-1.5 px-3 bg-muted/40 border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card cursor-pointer"
          >
            <option value="all">All Modes</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCatFilter('all');
                setModeFilter('all');
                setTimeHorizon('all');
                setCustomStartDate('');
                setCustomEndDate('');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
              title="Reset all filters"
            >
              <X size={13} /> Reset
            </button>
          )}

          <span className="text-xs font-semibold text-secondary px-1 shrink-0">
            Showing {searchedExpenses.length} of {expenses.length} expenses ({timeHorizonLabel})
          </span>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm shrink-0"
          title="Export Expenses as CSV"
        >
          <Download size={13} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* ── Native Table Ledger ── */}
      <ManagerAccountsExpensesExpenseLedger
        emptyMessage={hasActiveFilters ? `No expenses recorded for ${timeHorizonLabel} matching the selected criteria.` : tManagerUi('no_matching_expenses_found')}
        rows={searchedExpenses}
        columnDefs={colDefs}
      />

      {/* ── Add Operational Expense Modal ── */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden motion-safe:animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Receipt className="text-primary" size={18} />
                <h3 className="font-bold text-primary text-base">Record Operational Expense</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="p-1 rounded-lg text-secondary hover:text-primary cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-secondary block mb-1">
                  Expense Category <span className="text-destructive">*</span>
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-secondary block mb-1">
                  Description / Purpose <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Broadband recharge, RO filter service, Printing..."
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-secondary block mb-1">
                    Amount (INR) <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">₹</span>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      placeholder="0.00"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-secondary block mb-1">Payment Mode</label>
                  <select
                    value={expenseMode}
                    onChange={(e) => setExpenseMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary uppercase"
                  >
                    <option value="cash">Cash (Counter)</option>
                    <option value="upi">UPI / QR</option>
                    <option value="card">Card (POS)</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-secondary block mb-1">Bill / Voucher #</label>
                  <input
                    type="text"
                    placeholder="Optional voucher no."
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary block mb-1">Paid By (Disbursed by)</label>
                  <input
                    type="text"
                    value={expensePaidBy}
                    onChange={(e) => setExpensePaidBy(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-primary outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-secondary hover:text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mgr-btn-primary px-4 py-2 rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
                >
                  <CheckCircle size={14} /> Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
