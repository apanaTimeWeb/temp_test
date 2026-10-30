import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('admin shell exposes the module-owned navigation landmark', async ({ page }) => {
  await page.goto('/admin/admin_dashboard');
  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible();
  await expect(page.getByTestId('admin_sidebar-AdminShellSidebar-link-admin-admin-dashboard')).toBeVisible();
});
