import type { AdminAccountsExpensesScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';

/** Canonical deterministic scenario list for the expense module's isolated test harness. */
export const AdminAccountsExpensesScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type { AdminAccountsExpensesScenario };
