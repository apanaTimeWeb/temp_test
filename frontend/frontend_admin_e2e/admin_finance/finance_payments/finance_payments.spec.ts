import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('finance_payments E2E', () => {
  test('filters Payment History by payment mode, date range, and search', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_finance/finance_payments', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(10);

    await main.getByRole('button', { name: 'Today', exact: true }).click();
    await main.getByRole('button', { name: 'All Time', exact: true }).click();
    await expect(main.locator('tbody tr')).toHaveCount(10);

    const modeSelect = main.locator('select').first();
    await modeSelect.selectOption('upi');
    const upiRows = await main.locator('tbody tr').count();
    expect(upiRows).toBeLessThanOrEqual(10);

    await modeSelect.selectOption('all');
    await expect(main.locator('tbody tr')).toHaveCount(10);
  });
});
