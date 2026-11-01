// tests/harness/AdminAccountsDailySettlementHarness.tsx
import type { ReactNode } from 'react';
import type { AdminAccountsDailySettlementScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/tests/harness/bootstrap';

export interface AdminAccountsDailySettlementHarnessProps {
  children?: ReactNode;
  scenario?: AdminAccountsDailySettlementScenario;
}

export function AdminAccountsDailySettlementHarness({
  children,
  scenario = 'ACTIVE',
}: AdminAccountsDailySettlementHarnessProps) {
  if (scenario === 'ACTIVE') {
    return (
      <div data-testid="admin_accounts_daily_settlement-harness" data-scenario="active">
        {children}
      </div>
    );
  }

  if (scenario === 'EMPTY') {
    return (
      <section data-testid="admin_accounts_daily_settlement-harness" data-scenario="empty" role="status">
        <h2>No settlements</h2>
        <p>No settlement records are available in this test scenario.</p>
      </section>
    );
  }

  if (scenario === 'UNAUTHORIZED') {
    return (
      <section data-testid="admin_accounts_daily_settlement-harness" data-scenario="unauthorized" role="alert">
        <h2>Access unavailable</h2>
        <p>This test scenario represents an authorization-denied state.</p>
      </section>
    );
  }

  if (scenario === 'TIMEOUT') {
    return (
      <section data-testid="admin_accounts_daily_settlement-harness" data-scenario="timeout" role="alert">
        <h2>Request timed out</h2>
        <p>This test scenario represents a timeout state.</p>
      </section>
    );
  }

  return (
    <section data-testid="admin_accounts_daily_settlement-harness" data-scenario="server-error" role="alert">
      <h2>Settlement reconciliation unavailable</h2>
      <p>This test scenario represents a server failure.</p>
    </section>
  );
}

export default AdminAccountsDailySettlementHarness;

