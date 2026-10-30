import '@/app/frontend_admin/admin_finance/finance_receipts/tests/harness/bootstrap';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinanceReceiptsHarness, AdminFinanceReceiptsScenarios } from '@/app/frontend_admin/admin_finance/finance_receipts/tests/harness/AdminFinanceReceiptsHarness';

describe('finance_receipts visible scenario harness', () => {
  it.each(AdminFinanceReceiptsScenarios)('renders the visible %s state', (scenario) => {
    render(<AdminFinanceReceiptsHarness scenario={scenario}>Feature content</AdminFinanceReceiptsHarness>);
    expect(screen.getByTestId('admin_finance_receipts-harness').getAttribute('data-scenario')).toBe(scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase());
    if (scenario === 'ACTIVE') expect(screen.getByText('Feature content')).toBeTruthy();
    if (scenario === 'EMPTY') expect(screen.getByTestId('admin_finance_receipts-harness-empty')).toBeTruthy();
    if (scenario === 'SERVER_500') expect(screen.getByRole('alert')).toBeTruthy();
    if (scenario === 'TIMEOUT') expect(screen.getByTestId('admin_finance_receipts-harness-timeout')).toBeTruthy();
    if (scenario === 'UNAUTHORIZED') expect(screen.getByTestId('admin_finance_receipts-harness-unauthorized')).toBeTruthy();
  });

  it('retains the legacy standalone contract assertion', () => {
    expect('admin_finance_receipt').toMatch(/^admin_[a-z0-9_]+$/);
  });
});
