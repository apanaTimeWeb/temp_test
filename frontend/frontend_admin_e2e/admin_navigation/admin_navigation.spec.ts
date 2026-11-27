import { expect, test } from '@playwright/test';

test('admin shell exposes navigation landmark and navigates cleanly between domains', async ({ page }) => {
  await page.goto('/admin/admin_dashboard/dashboard_overview');
  await expect(page.getByTestId('admin-sidebar')).toBeVisible();
  const navigation = page.getByTestId('admin-navigation');
  await expect(navigation).toBeVisible();
  await expect(navigation.locator('a[href^="/admin/"]')).toHaveCount(34);

  await navigation.locator('a[href="/admin/admin_members/members_directory"]').click();
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_directory(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Member Management/i);
});
