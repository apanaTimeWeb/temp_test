import type { ReactNode } from 'react';
import { AdminAccountsExpenseCategoriesScenarioLabel, type AdminAccountsExpenseCategoriesScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/tests/harness/bootstrap';
import type { AdminAccountsExpenseCategoriesHarnessProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/types/AdminAccountsExpenseCategoriesTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminAccountsExpenseCategoriesHarness({ children, scenario = 'ACTIVE' }: AdminAccountsExpenseCategoriesHarnessProps) {
  return (
    <div data-testid="admin_accounts_expense_categories-harness" data-scenario={AdminAccountsExpenseCategoriesScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_accounts_expense_categories-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_accounts_expense_categories-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_accounts_expense_categories-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_accounts_expense_categories-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminAccountsExpenseCategoriesHarnessProps };
