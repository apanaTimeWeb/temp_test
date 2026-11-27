import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import type {
  AdminAccountsExpensesCategoryFilter,
  AdminAccountsExpensesStatusFilter,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';

export type AdminExpenseTimeRange = 'all' | 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom';

export function escapeExpenseHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function getExpenseTimeRangeLabel(timeRange: AdminExpenseTimeRange): string {
  switch (timeRange) {
    case 'today': return 'Today';
    case 'this_week': return 'This Week';
    case 'this_month': return 'This Month';
    case 'last_month': return 'Last Month';
    case 'custom': return 'Custom Range';
    default: return 'All Time';
  }
}

export function filterAdminExpenses(
  expenses: AdminAccountingExpense[],
  opts: {
    isAllBranches: boolean;
    selectedBranch: { name: string } | null;
    catFilter: AdminAccountsExpensesCategoryFilter;
    statusFilter: AdminAccountsExpensesStatusFilter;
    searchQuery: string;
    timeRange: AdminExpenseTimeRange;
    customStartDate: string;
    customEndDate: string;
  },
): AdminAccountingExpense[] {
  const { isAllBranches, selectedBranch, catFilter, statusFilter, searchQuery, timeRange, customStartDate, customEndDate } = opts;
  return expenses.filter((expense) => {
    if (!isAllBranches && selectedBranch) {
      const matchesBranch = expense.branchName && (
        expense.branchName.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
        selectedBranch.name.toLowerCase().includes(expense.branchName.toLowerCase())
      );
      if (!matchesBranch) return false;
    }
    if (catFilter !== 'all' && expense.category !== catFilter) return false;
    if (statusFilter !== 'all' && (expense.status ?? 'APPROVED') !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const match =
        expense.description?.toLowerCase().includes(q) ||
        expense.paidBy?.toLowerCase().includes(q) ||
        expense.category?.toLowerCase().includes(q) ||
        expense.branchName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (timeRange !== 'all' && expense.date) {
      const d = new Date(expense.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (timeRange === 'today') {
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        if (!(d >= today && d <= end)) return false;
      } else if (timeRange === 'this_week') {
        const ws = new Date(today);
        ws.setDate(today.getDate() - today.getDay());
        if (d < ws) return false;
      } else if (timeRange === 'this_month') {
        if (d < new Date(today.getFullYear(), today.getMonth(), 1)) return false;
      } else if (timeRange === 'last_month') {
        const lms = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lme = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
        if (d < lms || d > lme) return false;
      } else if (timeRange === 'custom') {
        if (customStartDate && d < new Date(customStartDate)) return false;
        if (customEndDate) {
          const ce = new Date(customEndDate);
          ce.setHours(23, 59, 59, 999);
          if (d > ce) return false;
        }
      }
    }
    return true;
  });
}
