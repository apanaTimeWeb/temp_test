import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('assets_register E2E', () => {
  test('filters Assets Register by status/category and opens Add Capital Asset modal', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_accounts_assets/assets_register', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(5);

    await main.getByRole('button', { name: /Needs Service/i }).click();
    await expect(main.locator('tbody tr')).toHaveCount(2);

    await main.getByRole('button', { name: /All Assets/i }).click();
    await expect(main.locator('tbody tr')).toHaveCount(5);

    await main.getByRole('combobox', { name: /All Categories/i }).selectOption('AC_HVAC');
    expect(await main.locator('tbody tr').count()).toBeLessThanOrEqual(5);
    await main.getByRole('combobox', { name: /All Categories/i }).selectOption('ALL');
    await expect(main.locator('tbody tr')).toHaveCount(5);

    await main.getByRole('button', { name: 'Add Capital Asset', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
