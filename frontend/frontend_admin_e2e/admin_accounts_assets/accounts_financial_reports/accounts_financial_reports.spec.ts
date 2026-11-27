import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('accounts_financial_reports E2E', () => {
  test('switches Financial Reports periods and verifies export controls cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_accounts_assets/accounts_financial_reports');

    const main = page.getByRole('main');
    await main.getByRole('button', { name: 'Quarterly', exact: true }).click();
    await main.getByRole('button', { name: 'Yearly', exact: true }).click();
    await main.getByRole('button', { name: 'Monthly', exact: true }).click();

    await expect(main.getByRole('button', { name: 'CSV', exact: true })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Excel', exact: true })).toBeVisible();
    await expect(main.getByRole('button', { name: 'PDF', exact: true })).toBeVisible();
  });
});
