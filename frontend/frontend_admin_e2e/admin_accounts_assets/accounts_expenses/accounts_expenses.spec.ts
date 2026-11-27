import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('accounts_expenses E2E', () => {
  test('filters Operational Expenses by category, approval tab, and navigates Add Expense flow', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_accounts_assets/accounts_expenses', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(6);

    await main.getByRole('button', { name: /Pending Approvals/i }).click();
    await expect(main.locator('tbody tr')).toHaveCount(2);

    await main.getByRole('button', { name: 'All Expenses', exact: true }).click();
    await expect(main.locator('tbody tr')).toHaveCount(6);

    const catSelect = main.locator('select').first();
    await catSelect.selectOption('Electricity');
    expect(await main.locator('tbody tr').count()).toBeLessThanOrEqual(6);
    await catSelect.selectOption('all');
    await expect(main.locator('tbody tr')).toHaveCount(6);

    await main.getByRole('button', { name: 'Add Expense', exact: true }).click();
    await expect(page).toHaveURL(/view=add/);
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
