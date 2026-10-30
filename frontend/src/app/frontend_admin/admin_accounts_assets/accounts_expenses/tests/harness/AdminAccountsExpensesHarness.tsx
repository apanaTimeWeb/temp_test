import type { ReactNode } from 'react';
import { type AdminAccountsExpensesScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/tests/harness/bootstrap';
import type { AdminAccountsExpensesHarnessProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';


/**
 * Deterministic, test-only state harness. Error states are mock scenarios, not claims about
 * a live API contract; the product screen stays demo-only until a verified API exists.
 */
export function AdminAccountsExpensesHarness({ children, scenario = 'ACTIVE' }: AdminAccountsExpensesHarnessProps) {
  if (scenario === 'ACTIVE') return <div data-testid="admin_accounts_expenses-harness" data-scenario="active">{children}</div>;
  if (scenario === 'EMPTY') return <section data-testid="admin_accounts_expenses-harness" data-scenario="empty" role="status"><h2>No expenses</h2><p>No expense records are available in this test scenario.</p></section>;
  if (scenario === 'UNAUTHORIZED') return <section data-testid="admin_accounts_expenses-harness" data-scenario="unauthorized" role="alert"><h2>Access unavailable</h2><p>This test scenario represents an authorization-denied state.</p></section>;
  if (scenario === 'TIMEOUT') return <section data-testid="admin_accounts_expenses-harness" data-scenario="timeout" role="alert"><h2>Request timed out</h2><p>This test scenario represents a timeout state.</p></section>;
  return <section data-testid="admin_accounts_expenses-harness" data-scenario="server-error" role="alert"><h2>Expenses unavailable</h2><p>This test scenario represents a server failure.</p></section>;
}


export type { AdminAccountsExpensesHarnessProps };
