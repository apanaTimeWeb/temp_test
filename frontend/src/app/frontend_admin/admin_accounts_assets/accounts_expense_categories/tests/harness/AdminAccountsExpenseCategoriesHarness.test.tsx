import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminAccountsExpenseCategoriesHarness } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/tests/harness/AdminAccountsExpenseCategoriesHarness';
import { AdminAccountsExpenseCategoriesScenarios } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/tests/harness/bootstrap';

describe('admin_accounting_expense_categories local scenario harness', () => {
  it.each(AdminAccountsExpenseCategoriesScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminAccountsExpenseCategoriesHarness scenario={scenario}>Feature content</AdminAccountsExpenseCategoriesHarness>);
    expect(screen.getByTestId('admin_accounts_expense_categories-harness').getAttribute('data-scenario')).toBe(
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
