import { expect, test } from '@playwright/test';

test('admin shell exposes the module-owned navigation landmark', async ({ page }) => {
  await page.goto('/admin/admin_dashboard/dashboard_overview');
  await expect(page.getByTestId('admin-sidebar')).toBeVisible();
  await expect(page.getByTestId('admin-navigation')).toBeVisible();
});
