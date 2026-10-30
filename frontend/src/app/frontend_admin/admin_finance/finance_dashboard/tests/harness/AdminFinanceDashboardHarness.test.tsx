import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinanceDashboardHarness } from '@/app/frontend_admin/admin_finance/finance_dashboard/tests/harness/AdminFinanceDashboardHarness';
import { AdminFinanceDashboardScenarios } from '@/app/frontend_admin/admin_finance/finance_dashboard/tests/harness/bootstrap';

describe('admin_finance_finance_dashboard local scenario harness', () => {
  it.each(AdminFinanceDashboardScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminFinanceDashboardHarness scenario={scenario}>Feature content</AdminFinanceDashboardHarness>);
    expect(screen.getByTestId('admin_finance_dashboard-harness').getAttribute('data-scenario')).toBe(
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
