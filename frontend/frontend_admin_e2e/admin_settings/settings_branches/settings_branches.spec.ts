import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('settings_branches E2E', () => {
  test('loads Library Branches page, toggles branch status, opens Edit modal, and supports search', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_settings/settings_branches', { checkSearchInput: true });

    const toggleBtn = page.getByTestId('admin-branch-toggle-BR-001');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await expect(toggleBtn).toContainText('Activate');
    await toggleBtn.click();
    await expect(toggleBtn).toContainText('Deactivate');

    await page.getByTestId('admin-branch-edit-BR-001').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
