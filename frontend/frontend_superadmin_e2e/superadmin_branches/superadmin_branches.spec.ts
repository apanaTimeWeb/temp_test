import { expect, test } from '@playwright/test';

test('redirects superadmin_branches to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_branches');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_branches(?:\/branches_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads branches_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_branches/branches_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_branches\/branches_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
