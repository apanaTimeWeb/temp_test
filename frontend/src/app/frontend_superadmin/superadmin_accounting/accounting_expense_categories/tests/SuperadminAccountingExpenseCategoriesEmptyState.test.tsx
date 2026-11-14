// RESPONSIBILITY: Define source-level test coverage for accounting expense categories using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_expense_categories/tests/SuperadminAccountingExpenseCategoriesEmptyState.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuperadminAccountingExpenseCategoriesEmptyState } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/components/SuperadminAccountingExpenseCategoriesEmptyState';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

/** Component regression test for accessible, localized empty collection behavior. */
describe('SuperadminAccountingExpenseCategoriesEmptyState', () => {
  it('renders a named status region with the feature-local empty message', () => {
    render(<SuperadminAccountingExpenseCategoriesEmptyState />);
    expect(screen.getByRole('status').getAttribute('data-testid')).toBe( 'superadmin-accounting-accounting-expense-categories-empty-state');
    expect(screen.getByText('COPY.NO_EXPENSE_CATEGORIES_FOUND')).toBeTruthy();
    expect(screen.getByRole('status').querySelector('svg')?.getAttribute('width')).toBe('18');
  });
});
