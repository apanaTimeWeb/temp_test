import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('communication_notices E2E', () => {
  test('renders Notice Board and opens Post Notice & Emergency Broadcast modals', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_communication/communication_notices', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(1);

    await page.getByTestId('admin_communication-page-control-012').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');

    await page.getByTestId('admin_communication-emergency-broadcast-btn').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
