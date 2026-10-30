import { describe as suite0_describe, expect as suite0_expect, it as suite0_it } from "vitest";
import { render as suite0_render, screen as suite0_screen } from "@testing-library/react";
import { AdminAccountingExpenseRecordSchema as suite0_AdminAccountingExpenseRecordSchema, createAdminAccountingExpenseCategoryFormSchema as suite0_createAdminAccountingExpenseCategoryFormSchema, createAdminAccountingExpenseFormSchema as suite0_createAdminAccountingExpenseFormSchema } from "@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas";
import { AdminAccountsExpensesHarness as suite0_AdminAccountsExpensesHarness } from "@/app/frontend_admin/admin_accounts_assets/accounts_expenses/tests/harness/AdminAccountsExpensesHarness";
import { AdminAccountsExpensesScenarios as suite0_AdminAccountsExpensesScenarios } from "@/app/frontend_admin/admin_accounts_assets/accounts_expenses/tests/harness/bootstrap";
import suite0_englishMessages from "@/app/frontend_admin/admin_accounts_assets/accounts_expenses/locales/admin_accounts_expenses_en.json";
import suite0_hindiMessages from "@/app/frontend_admin/admin_accounts_assets/accounts_expenses/locales/admin_accounts_expenses_hi.json";
import { act as suite1_act, renderHook as suite1_renderHook } from "@testing-library/react";
import { afterEach as suite1_afterEach, describe as suite1_describe, expect as suite1_expect, it as suite1_it, vi as suite1_vi } from "vitest";
import { useAdminAccountsExpensesUnsavedChangesGuard as suite1_useAdminAccountsExpensesUnsavedChangesGuard } from "@/app/frontend_admin/admin_accounts_assets/accounts_expenses/hooks/useAdminAccountsExpensesUnsavedChangesGuard";

describe("Consolidated from AdminAccountsExpensesFeatureContracts.test.tsx", () => {








const englishCategories = suite0_englishMessages.ADMIN_ACCOUNTING.EXPENSE_CATEGORIES;
const hindiCategories = suite0_hindiMessages.ADMIN_ACCOUNTING.EXPENSE_CATEGORIES;
const englishExpense = suite0_englishMessages.ADMIN_ACCOUNTING.EXPENSE_ADD;
const hindiExpense = suite0_hindiMessages.ADMIN_ACCOUNTING.EXPENSE_ADD;
const invalidCategory = { name: '   ', budget: -1 };
const invalidExpense = { date: '', category: '', description: ' ', amount: 0, paidBy: '', mode: 'cash' as const, notes: '' };

const expenseDraft = {
  date: '2026-10-13', category: 'Electricity', description: 'Power bill', amount: 1250.5,
  paidBy: 'Admin', mode: 'upi' as const, notes: '',
};

suite0_describe('expense-category form schema', () => {
  suite0_it('returns English validation messages for an invalid category draft', () => {
    const result = suite0_createAdminAccountingExpenseCategoryFormSchema((key) => englishCategories[key]).safeParse(invalidCategory);
    suite0_expect(result.success).toBe(false);
    if (result.success) throw new Error('Expected invalid expense category to be rejected.');
    const messages = result.error.issues.map((issue) => issue.message);
    suite0_expect(messages).toContain(englishCategories.VALIDATION_NAME_REQUIRED);
    suite0_expect(messages).toContain(englishCategories.VALIDATION_BUDGET_NONNEGATIVE);
  });

  suite0_it('uses Hindi messages and accepts a valid category draft', () => {
    const schema = suite0_createAdminAccountingExpenseCategoryFormSchema((key) => hindiCategories[key]);
    const invalid = schema.safeParse(invalidCategory);
    suite0_expect(invalid.success).toBe(false);
    if (!invalid.success) suite0_expect(invalid.error.issues[0]?.message).toBe(hindiCategories.VALIDATION_NAME_REQUIRED);
    suite0_expect(schema.safeParse({ name: 'Internet', budget: 10000 }).success).toBe(true);
  });
});

suite0_describe('expense form schema', () => {
  suite0_it('returns localized English errors for missing/invalid expense fields', () => {
    const result = suite0_createAdminAccountingExpenseFormSchema((key) => englishExpense[key]).safeParse(invalidExpense);
    suite0_expect(result.success).toBe(false);
    if (result.success) throw new Error('Expected invalid expense to be rejected.');
    const messages = result.error.issues.map((issue) => issue.message);
    suite0_expect(messages).toContain(englishExpense.VALIDATION_DATE_REQUIRED);
    suite0_expect(messages).toContain(englishExpense.VALIDATION_AMOUNT_POSITIVE);
  });

  suite0_it('uses Hindi messages and accepts a valid expense draft', () => {
    const schema = suite0_createAdminAccountingExpenseFormSchema((key) => hindiExpense[key]);
    const invalid = schema.safeParse(invalidExpense);
    suite0_expect(invalid.success).toBe(false);
    if (!invalid.success) suite0_expect(invalid.error.issues[0]?.message).toBe(hindiExpense.VALIDATION_DATE_REQUIRED);
    suite0_expect(schema.safeParse(expenseDraft).success).toBe(true);
  });

  suite0_it('rejects impossible dates and amounts with more than two decimal places', () => {
    const schema = suite0_createAdminAccountingExpenseFormSchema((key) => englishExpense[key]);
    suite0_expect(schema.safeParse({ ...expenseDraft, date: '2026-02-30' }).success).toBe(false);
    suite0_expect(schema.safeParse({ ...expenseDraft, amount: 12.345 }).success).toBe(false);
  });
});

suite0_describe('expense record storage boundary and monetary invariants', () => {
  const record = { id: 1, date: '2026-10-13', category: 'Electricity', description: 'Power bill', amount: 125050, paidBy: 'Admin', mode: 'upi', notes: '' };
  suite0_it('accepts positive integer paise and rejects zero or fractional paise', () => {
    suite0_expect(suite0_AdminAccountingExpenseRecordSchema.safeParse(record).success).toBe(true);
    suite0_expect(suite0_AdminAccountingExpenseRecordSchema.safeParse({ ...record, amount: 0 }).success).toBe(false);
    suite0_expect(suite0_AdminAccountingExpenseRecordSchema.safeParse({ ...record, amount: 12.5 }).success).toBe(false);
  });

  suite0_it('rejects impossible dates in transient expense records', () => {
    suite0_expect(suite0_AdminAccountingExpenseRecordSchema.safeParse({ ...record, date: '2026-02-30' }).success).toBe(false);
  });
});

suite0_describe('scenario harness exercises each declared UI state', () => {
  suite0_it.each(suite0_AdminAccountsExpensesScenarios)('renders the %s scenario', (scenario) => {
    suite0_render(<suite0_AdminAccountsExpensesHarness scenario={scenario}><p>Active expenses content</p></suite0_AdminAccountsExpensesHarness>);
    const harness = suite0_screen.getByTestId('admin_accounts_expenses-harness');
    const expected = ({ ACTIVE: 'active', EMPTY: 'empty', SERVER_500: 'server-error', TIMEOUT: 'timeout', UNAUTHORIZED: 'unauthorized' } as const)[scenario];
    suite0_expect(harness.getAttribute('data-scenario')).toBe(expected);
    if (scenario === 'ACTIVE') suite0_expect(suite0_screen.getByText('Active expenses content').textContent).toBe('Active expenses content');
    if (scenario === 'EMPTY') suite0_expect(suite0_screen.getByRole('status').textContent).toContain('No expenses');
    if (scenario !== 'ACTIVE' && scenario !== 'EMPTY') suite0_expect(suite0_screen.getByRole('alert')).toBeTruthy();
  });
});

});


describe("Consolidated from useAdminAccountsExpensesUnsavedChangesGuard.test.ts", () => {




let anchor: HTMLAnchorElement | null = null;
suite1_afterEach(() => { anchor?.remove(); anchor = null; });

suite1_describe('useAdminAccountsExpensesUnsavedChangesGuard', () => {
  suite1_it('blocks same-origin navigation and delegates to the form confirmation', () => {
    const onBlockedNavigation = suite1_vi.fn();
    suite1_renderHook(() => suite1_useAdminAccountsExpensesUnsavedChangesGuard(true, onBlockedNavigation));
    anchor = document.createElement('a');
    anchor.href = '/admin/accounts/expenses?view=all';
    document.body.appendChild(anchor);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    suite1_act(() => { anchor?.dispatchEvent(event); });
    suite1_expect(event.defaultPrevented).toBe(true);
    suite1_expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/accounts/expenses?view=all');
  });

  suite1_it('allows clean forms and new-window links', () => {
    const onBlockedNavigation = suite1_vi.fn();
    suite1_renderHook(() => suite1_useAdminAccountsExpensesUnsavedChangesGuard(false, onBlockedNavigation));
    anchor = document.createElement('a');
    anchor.href = '/admin/accounts/expenses?view=all';
    document.body.appendChild(anchor);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    suite1_act(() => { anchor?.dispatchEvent(event); });
    suite1_expect(event.defaultPrevented).toBe(false);
    suite1_expect(onBlockedNavigation).not.toHaveBeenCalled();
  });
});

});

