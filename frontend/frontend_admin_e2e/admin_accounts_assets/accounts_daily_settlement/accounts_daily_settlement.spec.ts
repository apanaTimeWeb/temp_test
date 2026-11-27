import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('accounts_daily_settlement E2E', () => {
  test('switches settlement status filters accurately and searches records', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_accounts_assets/accounts_daily_settlement', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(5);

    await main.getByRole('button', { name: /Pending Approval/i }).click();
    await expect(main.locator('tbody tr')).toHaveCount(2);

    await main.getByRole('button', { name: /Flagged Discrepancies/i }).click();
    await expect(main.locator('tbody tr')).toHaveCount(1);

    await main.getByRole('button', { name: /All Settlements/i }).click();
    await expect(main.locator('tbody tr')).toHaveCount(5);
  });
});
