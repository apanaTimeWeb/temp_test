import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('settings_branches E2E', () => {
  test('loads Library Branches page, toggles branch status, and supports search', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_settings/settings_branches', { checkSearchInput: true });

    const toggleBtn = page.getByTestId('admin-branch-toggle-BR-001');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await expect(toggleBtn).toContainText('Activate');
    await toggleBtn.click();
    await expect(toggleBtn).toContainText('Deactivate');
  });
});
