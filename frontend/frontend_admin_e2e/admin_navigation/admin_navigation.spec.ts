import { expect, test } from '@playwright/test';
test('admin shell exposes the module-owned navigation landmark', async ({ page }) => {
  await page.goto('/admin/admin_dashboard');
  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible();
  await expect(page.getByTestId('admin_sidebar-AdminShellSidebar-link-admin-admin-dashboard')).toBeVisible();
});
