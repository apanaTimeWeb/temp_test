import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminAccountsFinancialReportsHarness } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/tests/harness/AdminAccountsFinancialReportsHarness';
import { AdminAccountsFinancialReportsScenarios } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/tests/harness/bootstrap';

describe('admin_accounting_financial_reports local scenario harness', () => {
  it.each(AdminAccountsFinancialReportsScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminAccountsFinancialReportsHarness scenario={scenario}>Feature content</AdminAccountsFinancialReportsHarness>);
    expect(screen.getByTestId('admin_accounts_financial_reports-harness').getAttribute('data-scenario')).toBe(
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
