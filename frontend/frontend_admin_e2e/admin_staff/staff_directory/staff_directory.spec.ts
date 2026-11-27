import { expect, test } from '@playwright/test';

test.describe('Canonical staff domain routes', () => {
  test('sidebar links include staff attendance and staff payroll alongside staff directory', async ({ page }) => {
    await page.goto('/admin/admin_staff/staff_directory');
    await expect(page.getByRole('heading').first()).toBeVisible();
    const navigation = page.getByTestId('admin-navigation');
    await expect(navigation.locator('a[href="/admin/admin_staff/staff_attendance"]')).toHaveCount(1);
    await expect(navigation.locator('a[href="/admin/admin_staff/staff_payroll"]')).toHaveCount(1);
  });
});
