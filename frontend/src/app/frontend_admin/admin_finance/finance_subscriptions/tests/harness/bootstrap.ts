/** Isolated test-scenario vocabulary owned by admin_finance_subscriptions. No sibling imports or live API assumptions. */
export const AdminFinanceSubscriptionsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminFinanceSubscriptionsScenario = (typeof AdminFinanceSubscriptionsScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminFinanceSubscriptionsScenarioLabel(scenario: AdminFinanceSubscriptionsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
