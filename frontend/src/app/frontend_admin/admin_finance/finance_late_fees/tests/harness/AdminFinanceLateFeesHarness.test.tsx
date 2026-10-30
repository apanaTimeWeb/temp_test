import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinanceLateFeesHarness } from '@/app/frontend_admin/admin_finance/finance_late_fees/tests/harness/AdminFinanceLateFeesHarness';
import { AdminFinanceLateFeesScenarios } from '@/app/frontend_admin/admin_finance/finance_late_fees/tests/harness/bootstrap';

describe('admin_finance_late_fees local scenario harness', () => {
  it.each(AdminFinanceLateFeesScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminFinanceLateFeesHarness scenario={scenario}>Feature content</AdminFinanceLateFeesHarness>);
    expect(screen.getByTestId('admin_finance_late_fees-harness').getAttribute('data-scenario')).toBe(
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
