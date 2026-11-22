/** Isolated test-scenario vocabulary owned by admin_finance_auto_suspend. */
export const AdminFinanceAutoSuspendScenarios = [
  'ACTIVE',
  'EMPTY',
  'SERVER_500',
  'TIMEOUT',
  'UNAUTHORIZED',
] as const;
export type AdminFinanceAutoSuspendScenario =
  (typeof AdminFinanceAutoSuspendScenarios)[number];

export function AdminFinanceAutoSuspendScenarioLabel(
  scenario: AdminFinanceAutoSuspendScenario
): string {
  switch (scenario) {
    case 'ACTIVE':
      return 'active';
    case 'EMPTY':
      return 'empty';
    case 'SERVER_500':
      return 'server-error';
    case 'TIMEOUT':
      return 'timeout';
    case 'UNAUTHORIZED':
      return 'unauthorized';
  }
}
