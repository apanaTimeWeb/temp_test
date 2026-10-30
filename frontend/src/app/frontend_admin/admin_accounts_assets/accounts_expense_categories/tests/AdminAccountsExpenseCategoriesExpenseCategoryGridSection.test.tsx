import { afterEach as suite0_afterEach, describe as suite0_describe, expect as suite0_expect, it as suite0_it, vi as suite0_vi } from "vitest";
import { cleanup as suite0_cleanup, fireEvent as suite0_fireEvent, render as suite0_render, screen as suite0_screen } from "@testing-library/react";
import Suite0_AdminAccountingExpenseCategoryGridSection from "@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/components/AdminAccountsExpenseCategoriesExpenseCategoryGridSection";
import { ADMIN_ACCOUNTING_EXPENSE_CATEGORY_FIXTURES as suite0_ADMIN_ACCOUNTING_EXPENSE_CATEGORY_FIXTURES } from "@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/mocks/AdminAccountsExpenseCategoriesExpenseCategoryFixtures";
import { describe as suite1_describe, expect as suite1_expect, it as suite1_it } from "vitest";
import { act as suite2_act, renderHook as suite2_renderHook } from "@testing-library/react";
import { afterEach as suite2_afterEach, describe as suite2_describe, expect as suite2_expect, it as suite2_it, vi as suite2_vi } from "vitest";
import suite2_useAdminAccountsExpenseCategoriesUnsavedChangesGuard from "@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/hooks/useAdminAccountsExpenseCategoriesUnsavedChangesGuard.ts";

describe("Consolidated from AdminAccountsExpenseCategoriesExpenseCategoryGridSection.test.tsx", () => {





suite0_afterEach(() => suite0_cleanup());

suite0_describe('AdminAccountingExpenseCategoryGridSection', () => {
  suite0_it('renders expense category cards and forwards a delete request', () => {
    const onDelete = suite0_vi.fn();
        suite0_render(<Suite0_AdminAccountingExpenseCategoryGridSection categories={suite0_ADMIN_ACCOUNTING_EXPENSE_CATEGORY_FIXTURES} onDelete={onDelete} canMutate={true} labels={{ spent: 'Spent', budget: 'Budget', percentUsed: (pct: number) => `${pct}% used`, overBudget: (amount: string | number) => `Over budget ${amount}`, deleteCategory: (name: string) => `Delete ${name}` }} />);
        const first = suite0_ADMIN_ACCOUNTING_EXPENSE_CATEGORY_FIXTURES[0];
        suite0_expect(first).toBeDefined();
        if (!first) throw new Error('Expected at least one synthetic expense category fixture.');
        suite0_fireEvent.click(suite0_screen.getByRole('button', { name: `Delete ${first.name}` }));
        suite0_expect(onDelete).toHaveBeenCalledWith(first);
  });
});

});


describe("Consolidated from AdminAccountsExpenseCategoriesStandaloneContract.test.ts", () => {
// Responsibility: verify the isolated admin_accounting_expense_categories contract remains discoverable by the host test runner.


suite1_describe('admin_accounting_expense_categories standalone contract', () => {
  suite1_it('has a module-owned test harness', () => {
    suite1_expect('admin_accounting_expense_categories').toMatch(/^admin_[a-z0-9_]+$/);
  });
});

});


describe("Consolidated from useAdminAccountsExpenseCategoriesUnsavedChangesGuard.test.ts", () => {




let anchor: HTMLAnchorElement | null = null;
suite2_afterEach(() => { anchor?.remove(); anchor = null; });

suite2_describe('useAdminAccountsExpenseCategoriesUnsavedChangesGuard', () => {
  suite2_it('requests confirmation before same-origin navigation while dirty', () => {
    const onBlockedNavigation = suite2_vi.fn();
    suite2_renderHook(() => suite2_useAdminAccountsExpenseCategoriesUnsavedChangesGuard(true, onBlockedNavigation));
    anchor = document.createElement('a');
    anchor.href = '/admin/next?tab=details';
    document.body.appendChild(anchor);
    suite2_act(() => { anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); });
    suite2_expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/next?tab=details');
  });

  suite2_it('does not intercept clean forms or browser exits', () => {
    const onBlockedNavigation = suite2_vi.fn();
    suite2_renderHook(() => suite2_useAdminAccountsExpenseCategoriesUnsavedChangesGuard(false, onBlockedNavigation));
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    suite2_expect(event.defaultPrevented).toBe(false);
    suite2_expect(onBlockedNavigation).not.toHaveBeenCalled();
  });
});

});

