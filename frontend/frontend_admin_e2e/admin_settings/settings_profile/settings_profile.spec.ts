import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('settings_profile E2E', () => {
  test('switches Profile & Preferences navigation tabs and redirects legacy branches view', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_settings/settings_profile');

    await page.getByTestId('admin_profile-AdminProfilePage-navigation-subscription').click();
    await expect(page.getByTestId('admin_profile-AdminProfilePage-navigation-subscription')).toHaveAttribute('aria-pressed', 'true');

    await page.getByTestId('admin_profile-AdminProfilePage-navigation-edit').click();
    await expect(page.getByTestId('admin_profile-AdminProfilePage-navigation-edit')).toHaveAttribute('aria-pressed', 'true');

    await page.getByTestId('admin_profile-AdminProfilePage-navigation-password').click();
    await expect(page.getByTestId('admin_profile-AdminProfilePage-navigation-password')).toHaveAttribute('aria-pressed', 'true');

    await page.getByTestId('admin_profile-AdminProfilePage-navigation-profile').click();
    await expect(page.getByTestId('admin_profile-AdminProfilePage-navigation-profile')).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/admin/admin_settings/settings_profile?view=branches');
    await expect(page).toHaveURL(/\/admin\/admin_settings\/settings_branches(?:[?#]|$)/);
  });
});
