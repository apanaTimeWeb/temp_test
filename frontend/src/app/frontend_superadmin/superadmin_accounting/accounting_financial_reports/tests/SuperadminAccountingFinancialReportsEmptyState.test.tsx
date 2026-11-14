// RESPONSIBILITY: Define source-level test coverage for accounting financial reports using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_financial_reports/tests/SuperadminAccountingFinancialReportsEmptyState.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuperadminAccountingFinancialReportsEmptyState } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/components/SuperadminAccountingFinancialReportsEmptyState';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

/** Component regression test for accessible, localized empty collection behavior. */
describe('SuperadminAccountingFinancialReportsEmptyState', () => {
  it('renders a named status region with the feature-local empty message', () => {
    render(<SuperadminAccountingFinancialReportsEmptyState />);
    expect(screen.getByRole('status').getAttribute('data-testid')).toBe( 'superadmin-accounting-accounting-financial-reports-empty-state');
    expect(screen.getByText('COPY.NO_FINANCIAL_REPORT_DATA')).toBeTruthy();
    expect(screen.getByRole('status').querySelector('svg')?.getAttribute('width')).toBe('18');
    expect(screen.getByRole('status').querySelector('svg')?.getAttribute('height')).toBe('18');
  });
});
