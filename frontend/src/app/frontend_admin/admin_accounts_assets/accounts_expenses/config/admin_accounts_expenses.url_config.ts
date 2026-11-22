

// Owned by: admin / admin_accounts_assets / accounts_expenses autonomous sub-module.
// No backend endpoint contract is supplied for this demo-only ledger; do not invent one.
export const ADMIN_ACCOUNTS_EXPENSES_ROUTES = {
  route: '/admin/admin_accounts_assets/accounts_expenses',
  create: '/admin/admin_accounts_assets/accounts_expenses?view=add',
} as const;

export const ADMIN_ACCOUNTS_EXPENSES_API = {} as const;

export const ADMIN_ACCOUNTING_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const ADMIN_ACCOUNTING_DEFAULT_PAGE_SIZE = 25 as const;

export const ADMIN_ACCOUNTING_EXPENSE_CATEGORIES = [
  'Electricity', 'Maintenance', 'Stationery', 'Internet', 'Cleaning', 'Miscellaneous', 'Rent', 'Salary',
] as const;

export const ADMIN_ACCOUNTING_EXPENSE_MODE_BADGE = {
  cash: 'inline-flex min-h-11 items-center rounded-md border border-border bg-pay-cash-bg px-3 py-2 text-sm font-medium text-pay-cash',
  upi: 'inline-flex min-h-11 items-center rounded-md border border-border bg-pay-upi-bg px-3 py-2 text-sm font-medium text-pay-upi',
  card: 'inline-flex min-h-11 items-center rounded-md border border-border bg-pay-card-bg px-3 py-2 text-sm font-medium text-pay-card',
  bank: 'inline-flex min-h-11 items-center rounded-md border border-border bg-pay-bank-bg px-3 py-2 text-sm font-medium text-pay-bank',
} as const;
