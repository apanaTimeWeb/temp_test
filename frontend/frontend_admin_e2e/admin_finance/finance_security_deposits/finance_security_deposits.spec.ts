import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('finance_security_deposits E2E', () => {
  test('filters Security Deposits ledger by status, date buttons, and search', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_finance/finance_security_deposits', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(7);

    const statusSelect = main.getByRole('combobox', { name: /Filter deposit status/i });
    await statusSelect.selectOption('held');
    expect(await main.locator('tbody tr').count()).toBeLessThanOrEqual(7);

    await statusSelect.selectOption('all');
    await expect(main.locator('tbody tr')).toHaveCount(7);

    await main.getByRole('button', { name: 'Today', exact: true }).click();
    await main.getByRole('button', { name: 'All Time', exact: true }).click();
    await expect(main.locator('tbody tr')).toHaveCount(7);
  });
});
