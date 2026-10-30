import '@/app/frontend_admin/admin_finance/finance_payments/tests/harness/bootstrap';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinancePaymentsHarness, AdminFinancePaymentsScenarios } from '@/app/frontend_admin/admin_finance/finance_payments/tests/harness/AdminFinancePaymentsHarness';

describe('finance_payments visible scenario harness', () => {
  it.each(AdminFinancePaymentsScenarios)('renders the visible %s state', (scenario) => {
    render(<AdminFinancePaymentsHarness scenario={scenario}>Feature content</AdminFinancePaymentsHarness>);
    const container = screen.getByTestId('admin_finance_payments-harness');
    expect(container.getAttribute('data-scenario')).toBe(scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase());
    if (scenario === 'ACTIVE') expect(screen.getByText('Feature content')).toBeTruthy();
    if (scenario === 'EMPTY') expect(screen.getByTestId('admin_finance_payments-harness-empty')).toBeTruthy();
    if (scenario === 'SERVER_500') expect(screen.getByRole('alert')).toBeTruthy();
    if (scenario === 'TIMEOUT') expect(screen.getByTestId('admin_finance_payments-harness-timeout')).toBeTruthy();
    if (scenario === 'UNAUTHORIZED') expect(screen.getByTestId('admin_finance_payments-harness-unauthorized')).toBeTruthy();
  });
});
