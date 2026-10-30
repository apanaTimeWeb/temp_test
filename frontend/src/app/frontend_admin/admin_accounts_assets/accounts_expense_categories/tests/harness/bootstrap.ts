/** Isolated test-scenario vocabulary owned by admin_accounts_expense_categories. No sibling imports or live API assumptions. */
export const AdminAccountsExpenseCategoriesScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminAccountsExpenseCategoriesScenario = (typeof AdminAccountsExpenseCategoriesScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminAccountsExpenseCategoriesScenarioLabel(scenario: AdminAccountsExpenseCategoriesScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
