// tests/harness/AdminAssetsRegisterHarness.tsx
import type { ReactNode } from 'react';
import type { AdminAssetsRegisterScenario } from '@/app/frontend_admin/admin_accounts_assets/assets_register/tests/harness/bootstrap';

export interface AdminAssetsRegisterHarnessProps {
  children?: ReactNode;
  scenario?: AdminAssetsRegisterScenario;
}

export function AdminAssetsRegisterHarness({
  children,
  scenario = 'ACTIVE',
}: AdminAssetsRegisterHarnessProps) {
  if (scenario === 'ACTIVE') {
    return (
      <div data-testid="admin_assets_register-harness" data-scenario="active">
        {children}
      </div>
    );
  }

  if (scenario === 'EMPTY') {
    return (
      <section data-testid="admin_assets_register-harness" data-scenario="empty" role="status">
        <h2>No assets</h2>
        <p>No asset records are available in this test scenario.</p>
      </section>
    );
  }

  if (scenario === 'UNAUTHORIZED') {
    return (
      <section data-testid="admin_assets_register-harness" data-scenario="unauthorized" role="alert">
        <h2>Access unavailable</h2>
        <p>This test scenario represents an authorization-denied state.</p>
      </section>
    );
  }

  if (scenario === 'TIMEOUT') {
    return (
      <section data-testid="admin_assets_register-harness" data-scenario="timeout" role="alert">
        <h2>Request timed out</h2>
        <p>This test scenario represents a timeout state.</p>
      </section>
    );
  }

  return (
    <section data-testid="admin_assets_register-harness" data-scenario="server-error" role="alert">
      <h2>Asset register unavailable</h2>
      <p>This test scenario represents a server failure.</p>
    </section>
  );
}

export default AdminAssetsRegisterHarness;

