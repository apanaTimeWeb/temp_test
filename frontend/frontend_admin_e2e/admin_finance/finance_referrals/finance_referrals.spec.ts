import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('finance_referrals E2E', () => {
  test('renders loaded referrer rows, switches time horizons, and searches ledger', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_finance/finance_referrals', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(6);

    await main.getByRole('button', { name: 'All Time', exact: true }).click();
    await expect(main.locator('tbody tr')).toHaveCount(6);

    await main.getByRole('button', { name: 'This Month', exact: true }).click();
    await expect(main.locator('tbody tr')).toHaveCount(6);

    const searchBox = main.getByPlaceholder(/Search referrer or student name/i);
    await searchBox.fill('Ananya');
    const filteredCount = await main.locator('tbody tr').count();
    expect(filteredCount).toBeLessThan(6);
    await searchBox.fill('');
    await expect(main.locator('tbody tr')).toHaveCount(6);
  });
});
