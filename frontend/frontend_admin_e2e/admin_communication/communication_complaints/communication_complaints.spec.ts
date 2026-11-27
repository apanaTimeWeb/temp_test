import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('communication_complaints E2E', () => {
  test('switches complaint status tabs accurately and opens Add Complaint modal', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_communication/communication_complaints', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(5);

    await page.getByTestId('admin_communication-complaints-tab-open').click();
    await expect(main.locator('tbody tr')).toHaveCount(2);

    await page.getByTestId('admin_communication-complaints-tab-in-progress').click();
    await expect(main.locator('tbody tr')).toHaveCount(1);

    await page.getByTestId('admin_communication-complaints-tab-resolved').click();
    await expect(main.locator('tbody tr')).toHaveCount(2);

    await page.getByTestId('admin_communication-complaints-tab-all').click();
    await expect(main.locator('tbody tr')).toHaveCount(5);

    await page.getByTestId('admin_communication-page-control-014').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
