import type { ReactNode } from 'react';
import { AdminAccountsShiftGapAnalyzerScenarioLabel, type AdminAccountsShiftGapAnalyzerScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/tests/harness/bootstrap';
import type { AdminAccountsShiftGapAnalyzerHarnessProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/types/AdminAccountsShiftGapAnalyzerTypes';


/** Test-only deterministic state harness. It renders observable active, empty, server-error, timeout, and unauthorized states without assuming a backend DTO or live API contract. */
export function AdminAccountsShiftGapAnalyzerHarness({ children, scenario = 'ACTIVE' }: AdminAccountsShiftGapAnalyzerHarnessProps) {
  return (
    <div data-testid="admin_accounts_shift_gap_analyzer-harness" data-scenario={AdminAccountsShiftGapAnalyzerScenarioLabel(scenario)} data-scenario-state={scenario}>
      {scenario === 'ACTIVE' ? children : scenario === 'EMPTY' ? (
        <div role="status" data-testid="admin_accounts_shift_gap_analyzer-harness-state-empty">No records available in this isolated scenario.</div>
      ) : scenario === 'SERVER_500' ? (
        <div role="alert" data-testid="admin_accounts_shift_gap_analyzer-harness-state-server-error">Simulated server error response (HTTP 500).</div>
      ) : scenario === 'TIMEOUT' ? (
        <div role="alert" data-testid="admin_accounts_shift_gap_analyzer-harness-state-timeout">Simulated request timeout.</div>
      ) : (
        <div role="alert" data-testid="admin_accounts_shift_gap_analyzer-harness-state-unauthorized">Simulated unauthorized response (HTTP 401).</div>
      )}
    </div>
  );
}


export type { AdminAccountsShiftGapAnalyzerHarnessProps };
