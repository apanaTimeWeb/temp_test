'use client';
import type { ManagerAccountsExpensesExpenseSummaryCardsProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';

// RESPONSIBILITY: Render the accounts expenses expense summary cards section of the components feature. It does not own backend persistence or cross-feature business logic.




export default function ManagerAccountsExpensesExpenseSummaryCards({ expenses, visibleExpenses, formatCurrency, labels }: ManagerAccountsExpensesExpenseSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="fin-kpi-card"><p className="fin-kpi-label">{labels.totalExpenses}</p><p className="fin-kpi-value fin-text-danger">{formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}</p></div>
      <div className="fin-kpi-card"><p className="fin-kpi-label">{labels.thisMonth}</p><p className="fin-kpi-value">{formatCurrency(visibleExpenses.reduce((sum, expense) => sum + expense.amount, 0))}</p></div>
      <div className="fin-kpi-card"><p className="fin-kpi-label">{labels.entries}</p><p className="fin-kpi-value">{expenses.length}</p></div>
      <div className="fin-kpi-card"><p className="fin-kpi-label">{labels.categories}</p><p className="fin-kpi-value">{new Set(expenses.map(expense => expense.category)).size}</p></div>
    </div>
  );
}
