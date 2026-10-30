import '@/app/frontend_admin/admin_finance/finance_refunds/tests/harness/bootstrap';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinanceRefundsHarness, AdminFinanceRefundsScenarios } from '@/app/frontend_admin/admin_finance/finance_refunds/tests/harness/AdminFinanceRefundsHarness';

describe('finance_refunds visible scenario harness', () => {
  it.each(AdminFinanceRefundsScenarios)('renders the visible %s state', (scenario) => {
    render(<AdminFinanceRefundsHarness scenario={scenario}>Feature content</AdminFinanceRefundsHarness>);
    const container = screen.getByTestId('admin_finance_refunds-harness');
    expect(container.getAttribute('data-scenario')).toBe(scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase());
    if (scenario === 'ACTIVE') expect(screen.getByText('Feature content')).toBeTruthy();
    if (scenario === 'EMPTY') expect(screen.getByTestId('admin_finance_refunds-harness-empty')).toBeTruthy();
    if (scenario === 'SERVER_500') expect(screen.getByRole('alert')).toBeTruthy();
    if (scenario === 'TIMEOUT') expect(screen.getByTestId('admin_finance_refunds-harness-timeout')).toBeTruthy();
    if (scenario === 'UNAUTHORIZED') expect(screen.getByTestId('admin_finance_refunds-harness-unauthorized')).toBeTruthy();
  });
});
