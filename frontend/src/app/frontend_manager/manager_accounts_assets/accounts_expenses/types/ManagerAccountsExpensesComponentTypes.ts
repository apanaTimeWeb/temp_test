/** Module-local component props and UI/state types extracted from component files. */
import type { MANAGER_ACCOUNTING_PAYMENT_MODES } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';
import type { ManagerAccountsExpensesExpenseSample } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesDemoRepository';
import type { ManagerAccountsExpensesSearchParams } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesMainTypes';
import type { ReactNode } from 'react';

export type ManagerAccountsExpensesExpenseCategoryFilterProps = {
  categories: readonly string[];
  value: string;
  onChange: (value: string) => void;
  onViewCategories: () => void;
  labels: { filterByCategory: string; allCategories: string; viewCategories: string };
};

export type ManagerAccountsExpensesExpenseSummaryCardsProps = {
  expenses: readonly ManagerAccountsExpensesExpenseSample[];
  visibleExpenses: readonly ManagerAccountsExpensesExpenseSample[];
  formatCurrency: (amount: number) => string;
  labels: { totalExpenses: string; thisMonth: string; entries: string; categories: string };
};

export type Labels = {
  date: string;
  category: string;
  description: string;
  amount: string;
  mode: string;
  paidBy: string;
  actions: string;
  deleteUnavailable: string;
};

export type PaymentMode = (typeof MANAGER_ACCOUNTING_PAYMENT_MODES)[number];

export type CurrencyFormatter = (amount: number) => string;

export interface NativeCellParams<T = object> { data?: T; value?: string | number | boolean | null; }

export interface NativeColumn<T = object> {
  field?: string;
  headerName?: string;
  sortable?: boolean;
  cellClass?: string | ((params: NativeCellParams<T>) => string);
  cellRenderer?: (params: NativeCellParams<T>) => ReactNode;
  valueFormatter?: (params: NativeCellParams<T>) => ReactNode;
  [key: string]: unknown;
}

export interface ManagerAccountsExpensesNativeTableProps<T extends object> { rows: T[]; columns: NativeColumn<T>[]; getRowKey: (row: T) => string; labels?: { previous: string; next: string }; }

export type Expense = ManagerAccountsExpensesExpenseSample;

export type ManagerAccountsExpensesExpenseLedgerProps = {
  rows: readonly ManagerAccountsExpensesExpenseSample[];
  columnDefs: NativeColumn<ManagerAccountsExpensesExpenseSample>[];
  emptyMessage: string;
};

export type ManagerAccountsExpensesPageProps = {
  searchParams?: Promise<ManagerAccountsExpensesSearchParams>;
};

export type ManagerAccountsExpensesSortDirection = 'asc' | 'desc';

export type ManagerAccountsExpensesCategoryTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
