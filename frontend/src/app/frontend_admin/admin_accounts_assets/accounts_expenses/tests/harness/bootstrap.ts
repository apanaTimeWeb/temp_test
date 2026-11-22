/** Canonical deterministic scenario list for the expense module's isolated test harness. */
export const AdminAccountsExpensesScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminAccountsExpensesScenario = (typeof AdminAccountsExpensesScenarios)[number];
