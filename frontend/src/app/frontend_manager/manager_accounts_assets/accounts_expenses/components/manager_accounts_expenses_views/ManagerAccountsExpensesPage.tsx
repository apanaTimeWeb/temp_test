'use client';
import type { ManagerAccountsExpensesMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesMainTypes';
import { useTranslations } from 'next-intl';

import { useManagerExpensesCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesFormattingHook';

// RESPONSIBILITY: Entry page for the manager_expenses module.
// DATA FLOW: Next.js Router -> Page -> Components


// RESPONSIBILITY: Entry page for the manager_expenses module.
// DATA FLOW: Next.js Router -> Page -> Components
import type { NativeColumn } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesNativeTable';
import { useState } from 'react';
import { Plus } from 'lucide-react';
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
  const expenses = MOCK;
  const [catFilter, setCatFilter] = useState('all');
  const [isCategoryReviewOpen, setIsCategoryReviewOpen] = useState(false);

  const visible = catFilter === 'all' ? expenses : expenses.filter(e => e.category === catFilter);

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
          <p className="fin-input-hint fin-text-warning" data-testid="manager-accounting-expenses-contract-warning" role="status">{tManagerUi('displayed_expenses_are_sample_records_add_and_delete_ope_ecb4a7')}</p>
        </div>
        <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed flex items-center gap-1" disabled title={tManagerUi('add_unavailable_verified_backend_mutation_contract_not_s_e46a6e')}>
          <Plus size={14} /> {tManagerUi('add_unavailable')}
        </button>
      </div>

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
          <p className="mt-4 text-sm text-warning" role="status">
            {tManagerUi('category_values_are_sample_data_add_delete_operations_ar_4a5b81')}
          </p>
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

    </div>
  );
}
