import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('members_coupons E2E', () => {
  test('filters coupons by status and opens Create Coupon dialog', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_members/members_coupons', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(1);

    const statusSelect = main.getByRole('combobox', { name: /Filter coupons by status/i });
    await statusSelect.selectOption('Expired');
    await statusSelect.selectOption('All');
    await expect(main.locator('tbody tr')).toHaveCount(1);

    await main.getByRole('button', { name: /Create Coupon/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
