import '@/app/frontend_admin/admin_finance/finance_collect_fee/tests/harness/bootstrap';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminFinanceCollectFeeHarness, AdminFinanceCollectFeeScenarios } from '@/app/frontend_admin/admin_finance/finance_collect_fee/tests/harness/AdminFinanceCollectFeeHarness';

describe('finance_collect_fee visible scenario harness', () => {
  it.each(AdminFinanceCollectFeeScenarios)('renders the visible %s state', (scenario) => {
    render(<AdminFinanceCollectFeeHarness scenario={scenario}>Feature content</AdminFinanceCollectFeeHarness>);
    expect(screen.getByTestId('admin_finance_collect_fee-harness').getAttribute('data-scenario')).toBe(scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase());
    if (scenario === 'ACTIVE') expect(screen.getByText('Feature content')).toBeTruthy();
    if (scenario === 'EMPTY') expect(screen.getByTestId('admin_finance_collect_fee-harness-empty')).toBeTruthy();
    if (scenario === 'SERVER_500') expect(screen.getByRole('alert')).toBeTruthy();
    if (scenario === 'TIMEOUT') expect(screen.getByTestId('admin_finance_collect_fee-harness-timeout')).toBeTruthy();
    if (scenario === 'UNAUTHORIZED') expect(screen.getByTestId('admin_finance_collect_fee-harness-unauthorized')).toBeTruthy();
  });
});
