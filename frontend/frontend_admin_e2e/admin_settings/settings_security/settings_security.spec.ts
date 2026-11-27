import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('settings_security E2E', () => {
  test('switches all 7 Library Security panels cleanly including Audit Trail', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_settings/settings_security');

    await page.getByTestId('admin_security-AdminSecurityNavigation-tab-login-security').click();
    await page.getByTestId('admin_security-AdminSecurityNavigation-tab-device-sessions').click();
    await page.getByTestId('admin_security-AdminSecurityNavigation-tab-failed-logins').click();
    await page.getByTestId('admin_security-AdminSecurityNavigation-tab-blocked-users').click();
    await page.getByTestId('admin_security-AdminSecurityNavigation-tab-events').click();
    await page.getByTestId('admin_security-AdminSecurityNavigation-tab-audit-trail').click();
    await expect(page.getByRole('main').locator('tbody tr').first()).toBeVisible();

    await page.getByTestId('admin_security-AdminSecurityNavigation-tab-active-sessions').click();
    await expect(page.getByTestId('admin-security-revoke-all-other-sessions-btn')).toBeVisible();
  });
});
