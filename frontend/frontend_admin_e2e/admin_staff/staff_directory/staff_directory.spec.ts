import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('staff_directory & staff domain routes E2E', () => {
  test('loads staff directory, switches sub-navigation views, and verifies staff sidebar links', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_staff/staff_directory', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(4);

    const navigation = page.getByTestId('admin-navigation');
    await expect(navigation.locator('a[href="/admin/admin_staff/staff_attendance"]')).toHaveCount(1);
    await expect(navigation.locator('a[href="/admin/admin_staff/staff_payroll"]')).toHaveCount(1);

    await page.getByTestId('admin_staff_directory-AdminStaffDirectoryViewSIDEBARNAVIGATIONSection-navigation-active').click();
    await page.getByTestId('admin_staff_directory-AdminStaffDirectoryViewSIDEBARNAVIGATIONSection-navigation-sessions').click();
    await page.getByTestId('admin_staff_directory-AdminStaffDirectoryViewSIDEBARNAVIGATIONSection-navigation-all').click();
    await expect(main.locator('tbody tr')).toHaveCount(4);
  });
});
