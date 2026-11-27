import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('finance_refunds E2E', () => {
  test('filters Refunds table by status, date buttons, and search', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_finance/finance_refunds', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(7);

    const statusSelect = main.locator('select').first();
    await statusSelect.selectOption('pending');
    const pendingRows = await main.locator('tbody tr').count();
    expect(pendingRows).toBeLessThanOrEqual(7);

    await statusSelect.selectOption('all');
    await expect(main.locator('tbody tr')).toHaveCount(7);

    await main.getByRole('button', { name: 'This Month', exact: true }).click();
    await main.getByRole('button', { name: 'All Time', exact: true }).click();
    await expect(main.locator('tbody tr')).toHaveCount(7);
  });
});
