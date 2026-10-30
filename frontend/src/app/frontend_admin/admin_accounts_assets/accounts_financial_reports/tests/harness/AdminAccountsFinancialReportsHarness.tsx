import type { ReactNode } from 'react';
import { AdminAccountsFinancialReportsScenarioLabel, type AdminAccountsFinancialReportsScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/tests/harness/bootstrap';
import type { AdminAccountsFinancialReportsHarnessProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/types/AdminAccountsFinancialReportsTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminAccountsFinancialReportsHarness({ children, scenario = 'ACTIVE' }: AdminAccountsFinancialReportsHarnessProps) {
  return (
    <div data-testid="admin_accounts_financial_reports-harness" data-scenario={AdminAccountsFinancialReportsScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_accounts_financial_reports-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_accounts_financial_reports-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_accounts_financial_reports-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_accounts_financial_reports-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminAccountsFinancialReportsHarnessProps };
