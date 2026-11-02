'use client';
import type { ManagerAccountsExpensesMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesMainTypes';
import { useTranslations } from 'next-intl';
import { useManagerExpensesCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesFormattingHook';
import type { NativeColumn } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesNativeTable';
import { useState } from 'react';
import { Plus, X, CheckCircle, IndianRupee, Receipt } from 'lucide-react';
import ManagerAccountsExpensesExpenseSummaryCards from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesExpenseSummaryCards';
import ManagerAccountsExpensesExpenseCategoryFilter from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_sections/ManagerAccountsExpensesExpenseCategoryFilter';
import ManagerAccountsExpensesExpenseLedger from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_widgets/ManagerAccountsExpensesExpenseLedger';
import { createManagerExpensesExpenseColumnDefinitions } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesExpenseColumnDefinitions';
import { MANAGER_ACCOUNTING_EXPENSE_CATEGORIES as CATEGORIES } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';
import { MANAGER_ACCOUNTING_SAMPLE_EXPENSES as MOCK } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesDemoRepository';
import type { Expense } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';

export default function ManagerAccountsExpensesPage({ view, id }: ManagerAccountsExpensesMainProps) {
  const tManagerUi = useTranslations('manager.manager_expenses.ui');
  const formatManagerExpensesCurrency = useManagerExpensesCurrencyFormatter();
  
  const [expenses, setExpenses] = useState<Expense[]>(MOCK as Expense[]);
  const [catFilter, setCatFilter] = useState('all');
  const [isCategoryReviewOpen, setIsCategoryReviewOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<string>(CATEGORIES[0] || 'Utilities');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseMode, setExpenseMode] = useState<'cash' | 'upi' | 'card' | 'bank'>('cash');
  const [expensePaidBy, setExpensePaidBy] = useState('Manager Counter');
  const [voucherNo, setVoucherNo] = useState('');

  const visible = catFilter === 'all' ? expenses : expenses.filter((e) => e.category === catFilter);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc.trim()) {
      alert('Expense description is required.');
      return;
    }
    const amt = Number(expenseAmount);
    if (!amt || amt <= 0) {
      alert('Valid positive expense amount is required.');
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
    formatManagerExpensesCurrency,
  );

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">{tManagerUi('expense_ledger')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('track_all_library_operational_expenses')}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddExpenseOpen(true)}
          className="mgr-btn-primary flex items-center gap-1.5 text-xs font-semibold"
        >
          <Plus size={14} /> Add Operational Expense
        </button>
      </div>

      {feedbackToast && (
        <div className="p-3 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      <ManagerAccountsExpensesExpenseSummaryCards
        expenses={expenses}
        visibleExpenses={visible}
        formatCurrency={formatManagerExpensesCurrency}
        labels={{
          totalExpenses: tManagerUi('total_expenses'),
          thisMonth: tManagerUi('this_month'),
          entries: tManagerUi('entries'),
          categories: tManagerUi('categories'),
        }}
      />

      <ManagerAccountsExpensesExpenseCategoryFilter
        categories={CATEGORIES}
        value={catFilter}
        onChange={setCatFilter}
        onViewCategories={() => setIsCategoryReviewOpen(true)}
        labels={{ filterByCategory: tManagerUi('filter_by_category'), allCategories: tManagerUi('all_categories'), viewCategories: tManagerUi('view_categories') }}
      />

      {isCategoryReviewOpen && (
        <section aria-labelledby="manager-expenses-category-review-title" className="rounded-xl border border-border bg-card p-6 shadow-card" role="region">
          <h2 className="text-lg font-semibold text-primary" id="manager-expenses-category-review-title">
            {tManagerUi('expense_categories')}
          </h2>
          <p className="mt-2 text-sm text-secondary">{tManagerUi('review_sample_budget_allocation_per_expense_category')}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-primary">
            {CATEGORIES.map((category) => <li key={category}>{category}</li>)}
          </ul>
          <div className="mt-6 flex justify-end">
            <button className="fin-btn fin-btn-secondary" onClick={() => setIsCategoryReviewOpen(false)} type="button">
              {tManagerUi('cancel')}
            </button>
          </div>
        </section>
      )}

      <ManagerAccountsExpensesExpenseLedger
        rows={visible}
        columnDefs={colDefs}
        emptyMessage={tManagerUi('no_expenses_found')}
      />

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Receipt size={18} />
                </div>
                <h2 className="text-base font-bold text-primary">Add Operational Expense</h2>
              </div>
              <button type="button" onClick={() => setIsAddExpenseOpen(false)} className="text-secondary hover:text-primary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  className="mgr-input text-xs"
                  placeholder="e.g. RO Filter Cartridge Replacement / Wi-Fi Bill"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Category *</label>
                  <select
                    className="mgr-select text-xs"
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Amount (INR) *</label>
                  <div className="relative">
                    <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                    <input
                      type="number"
                      required
                      min="1"
                      className="mgr-input pl-8 text-xs font-mono font-bold"
                      placeholder="0.00"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Payment Mode</label>
                  <select
                    className="mgr-select text-xs"
                    value={expenseMode}
                    onChange={(e) => setExpenseMode(e.target.value as 'cash' | 'upi' | 'card' | 'bank')}
                  >
                    <option value="cash">Cash (Counter)</option>
                    <option value="upi">UPI / Online</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Paid By / Authorized</label>
                  <input
                    type="text"
                    className="mgr-input text-xs"
                    placeholder="e.g. Branch Manager"
                    value={expensePaidBy}
                    onChange={(e) => setExpensePaidBy(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Bill / Voucher Reference No. (Optional)</label>
                <input
                  type="text"
                  className="mgr-input text-xs font-mono"
                  placeholder="e.g. BILL-RO-892"
                  value={voucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button type="button" onClick={() => setIsAddExpenseOpen(false)} className="mgr-btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
                  <CheckCircle size={14} /> Save Expense Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
