import { expect, test } from '@playwright/test';

test.describe('Canonical staff role navigation', () => {
  test('staff directory links to the canonical staff_roles_permissions submodule', async ({ page }) => {
    await page.goto('/admin/admin_staff/staff_directory');
    await expect(page.getByRole('heading', { name: 'Staff directory' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open existing staff management' })).toHaveAttribute('href', '/admin/admin_staff/staff_roles_permissions');
  });
});
