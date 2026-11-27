

// Owned by: admin / admin_accounts_assets / accounts_expenses autonomous sub-module.
// No backend endpoint contract is supplied for this demo-only ledger; do not invent one.
export const ADMIN_ACCOUNTS_EXPENSES_ROUTES = {
  route: '/admin/admin_accounts_assets/accounts_expenses',
  create: '/admin/admin_accounts_assets/accounts_expenses?view=add',
} as const;

export const ADMIN_ACCOUNTS_EXPENSES_API = {} as const;

export const ADMIN_ACCOUNTING_EXPENSE_CATEGORIES = [
  'Electricity', 'Maintenance', 'Stationery', 'Internet', 'Cleaning', 'Miscellaneous', 'Rent', 'Salary',
] as const;
