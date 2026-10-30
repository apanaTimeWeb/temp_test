import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinanceSecurityDepositsHarness } from '@/app/frontend_admin/admin_finance/finance_security_deposits/tests/harness/AdminFinanceSecurityDepositsHarness';
import { AdminFinanceSecurityDepositsScenarios } from '@/app/frontend_admin/admin_finance/finance_security_deposits/tests/harness/bootstrap';

describe('admin_finance_security_deposits local scenario harness', () => {
  it.each(AdminFinanceSecurityDepositsScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminFinanceSecurityDepositsHarness scenario={scenario}>Feature content</AdminFinanceSecurityDepositsHarness>);
    expect(screen.getByTestId('admin_finance_security_deposits-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    if (scenario === 'ACTIVE') {
      expect(screen.getByText('Feature content')).toBeTruthy();
      expect(screen.queryByRole('alert')).toBeNull();
      return;
    }

    expect(screen.queryByText('Feature content')).toBeNull();
    if (scenario === 'EMPTY') {
      expect(screen.getByRole('status').textContent).toContain('No records available');
      return;
    }
    if (scenario === 'SERVER_500') {
      expect(screen.getByRole('alert').textContent).toContain('HTTP 500');
      return;
    }
    if (scenario === 'TIMEOUT') {
      expect(screen.getByRole('alert').textContent).toContain('timeout');
      return;
    }
    expect(screen.getByRole('alert').textContent).toContain('HTTP 401');
  });
});
