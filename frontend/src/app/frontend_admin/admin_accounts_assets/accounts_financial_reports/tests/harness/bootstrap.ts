import type { AdminAccountsFinancialReportsScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';

/** Isolated test-scenario vocabulary owned by admin_accounts_financial_reports. No sibling imports or live API assumptions. */
export const AdminAccountsFinancialReportsScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type { AdminAccountsFinancialReportsScenario };

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminAccountsFinancialReportsScenarioLabel(scenario: AdminAccountsFinancialReportsScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}
