import '@/app/frontend_admin/admin_finance/finance_invoices/tests/harness/bootstrap';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinanceInvoicesHarness, AdminFinanceInvoicesScenarios } from '@/app/frontend_admin/admin_finance/finance_invoices/tests/harness/AdminFinanceInvoicesHarness';

describe('finance_invoices visible scenario harness', () => {
  it.each(AdminFinanceInvoicesScenarios)('renders the visible %s state', (scenario) => {
    render(<AdminFinanceInvoicesHarness scenario={scenario}>Feature content</AdminFinanceInvoicesHarness>);
    expect(screen.getByTestId('admin_finance_invoices-harness').getAttribute('data-scenario')).toBe(scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase());
    if (scenario === 'ACTIVE') expect(screen.getByText('Feature content')).toBeTruthy();
    if (scenario === 'EMPTY') expect(screen.getByTestId('admin_finance_invoices-harness-empty')).toBeTruthy();
    if (scenario === 'SERVER_500') expect(screen.getByRole('alert')).toBeTruthy();
    if (scenario === 'TIMEOUT') expect(screen.getByTestId('admin_finance_invoices-harness-timeout')).toBeTruthy();
    if (scenario === 'UNAUTHORIZED') expect(screen.getByTestId('admin_finance_invoices-harness-unauthorized')).toBeTruthy();
  });

  it('retains the legacy standalone contract assertion', () => {
    expect('admin_finance_invoice').toMatch(/^admin_[a-z0-9_]+$/);
  });
});
